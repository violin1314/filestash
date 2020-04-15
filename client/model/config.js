import { http_get, http_post, http_delete, debounce } from '../helpers/';

class ConfigModel {
    constructor(){}

    all(){
        return http_get("/bhfilebrowser/admin/api/config").then((d) => d.result);
    }

    save(config, debounced = true, fn_ok, fn_err){
        let url = "/bhfilebrowser/admin/api/config";

        if(debounced){
            if(!this.debounced_post){
                this.debounced_post = debounce((url, config) => {
                    return http_post(url, config).then(this.refresh).then((a) => {
                        if(typeof fn_ok === "function") return fn_ok();
                        return Promise.resolve(a)
                    }).catch((err) => {
                        if(typeof fn_err === "function") return fn_err();
                        return Promise.reject(err)
                    });
                }, 1000);
            }
            return this.debounced_post(url, config)
        }
        return http_post(url, config).then(this.refresh).then((a) => {
            if(typeof fn_ok === "function") return fn_ok();
            return Promise.resolve(a)
        }).catch((err) => {
            if(typeof fn_err === "function") return fn_err();
            return Promise.reject(err)
        });
    }

    refresh(){
        return http_get("/bhfilebrowser/api/config").then((config) => {
            window.CONFIG = config.result;
        });
    }
}

class PluginModel {
    constructor(){}

    all(){
        return http_get("/bhfilebrowser/admin/api/plugin").then((r) => r.results);
    }
}

class BackendModel {
    constructor(){}

    all(){
        return http_get("/bhfilebrowser/api/backend").then((r) => r.result);
    }
}

export const Plugin = new PluginModel();
export const Config = new ConfigModel();
export const Backend = new BackendModel();
