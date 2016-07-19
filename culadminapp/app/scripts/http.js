'use strict';

angular.module('culAdminApp').config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push(["$q", "plugMessenger", function ($q, plugMessenger) {
        return {
            'request': function (config) {
                $("#global-loading").show();
                var _token = sessionStorage.getItem("token");
                if (!!_token) config.headers["token"] = _token;
                return config;
            },

            'requestError': function (request) {
                $("#global-loading").hide();
                return request;
            },

            'response': function (response) {
                $("#global-loading").hide();
                var _token = response.headers("Token");
                if (!!_token) sessionStorage.setItem("token", _token);
                return response;
            },

            'responseError': function (response) {
                $("#global-loading").hide();
                if (response.status == 401) {   //授权失败，退出到登录页面
                    cul.service.user.logout()
                }
                plugMessenger.error(response.data.message);
                return response;
            }
        };
    }]);
}]);