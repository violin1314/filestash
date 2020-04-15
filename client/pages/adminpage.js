import React from 'react';
import Path from 'path';
import { Route, Switch, Link, NavLink } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './error.scss';
import './adminpage.scss';
import { Icon, LoadingPage } from '../components/';
import { Config, Admin } from '../model';
import { notify } from '../helpers/';
import { HomePage, DashboardPage, ConfigPage, LogPage, PluginPage, SupportPage, SetupPage, LoginPage } from './adminpage/';


function AdminOnly(WrappedComponent){
    return class extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                isAdmin: null
            };
            this.admin = () => {
                Admin.isAdmin().then((t) => {
                    this.setState({isAdmin: t});
                }).catch((err) => {
                    notify.send("Error: " + (err && err.message) , "error");
                });
            };
            this.timeout = window.setInterval(this.admin.bind(this), 30 * 1000);
        }

        componentDidMount(){
            this.admin.call(this);
        }

        componentWillUnmount(){
            window.clearInterval(this.timeout);
        }

        render(){
            if(this.state.isAdmin === true){
                return ( <WrappedComponent {...this.props} /> );
            } else if(this.state.isAdmin === false) {
                return ( <LoginPage reload={() => this.admin()} /> );
            }
            return ( <LoadingPage />);
        }
    };
}

@AdminOnly
export class AdminPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isAdmin: null
        };
    }

    render(){
        return (
            <div className="component_page_admin">
              <SideMenu url={this.props.match.url}/>
              <div className="page_container scroll-y">
                <ReactCSSTransitionGroup key={window.location.pathname} transitionName="adminpage" transitionLeave={true} transitionEnter={true} transitionLeaveTimeout={15000} transitionEnterTimeout={20000} transitionAppear={true} transitionAppearTimeout={20000}>
                  <Switch>
                    <Route path={this.props.match.url + "/dashboard"} component={DashboardPage} />
                    <Route path={this.props.match.url + "/configure"} component={ConfigPage} />
                    <Route path={this.props.match.url + "/activity"} component={LogPage} />
                    <Route path={this.props.match.url + "/plugins"} component={PluginPage} />
                    <Route path={this.props.match.url + "/support"} component={SupportPage} />
                    <Route path={this.props.match.url + "/setup"} component={SetupPage} />
                    <Route path={this.props.match.url} component={HomePage} />
                  </Switch>
                </ReactCSSTransitionGroup>
              </div>
            </div>
        );
    }
}

const SideMenu = (props) => {
    return (
        <div className="component_menu_sidebar no-select">
          <NavLink to="/" className="header">
            <Icon name="arrow_left" />
          </NavLink>
          <h2>Admin console</h2>
          <ul>
            <li>
              <NavLink activeClassName="active" to={props.url + "/dashboard"}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to={props.url + "/configure"}>
                Configure
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to={props.url + "/activity"}>
                Activity
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to={props.url + "/support"}>
                Support
              </NavLink>
            </li>
          </ul>
        </div>
    );
};
