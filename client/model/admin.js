import { http_post, http_get } from '../helpers';

export const Admin = {
    login: function(password = ""){
        return http_post("/bhfilebrowser/admin/api/session", {password: password});
    },
    isAdmin: function(){
        return http_get("/bhfilebrowser/admin/api/session").then((res) => res.result);
    }
};
