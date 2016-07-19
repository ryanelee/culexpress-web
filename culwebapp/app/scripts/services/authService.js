'use strict';

angular.module('culwebApp')
    .service('AuthService', function ($rootScope, $http) {

        var self = this;

        self.userInfoKey = "user_info";
        self.userTypes = ['culwebapp_user', 'culwebapp_admin', 'culwebapp_public'];

        self.addStorage = function (obj, isGlobal) {
            if (isGlobal) {
                localStorage.setItem(self.userInfoKey, JSON.stringify(obj))
            }
            else {
                sessionStorage.setItem(self.userInfoKey, JSON.stringify(obj))
            }
        }

        self.clearStorage = function () {
            localStorage.removeItem(self.userInfoKey);
            sessionStorage.removeItem(self.userInfoKey);
        }

        self.getStorage = function (storageKey) {
            return sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey);
        }



        self.register = function (user, success, error) {
            $http.post(cul.apiPath + '/customer/register', user
        ).success(function (result) {
            self.clearStorage();
            var str_userInfo = JSON.stringify(result);
            sessionStorage.setItem(self.userInfoKey, str_userInfo);
            $rootScope.currentUser = result;

            success(result);
        }).error(error);
        };

        self.login = function (user, success, error) {
            return $http.post(cul.apiPath + '/customer/login2', user);
        };

        self.logout = function (success) {
            self.clearStorage();
            $rootScope.isLogined = false;
            $rootScope.currentUser = null;
            success && success();
        };

    });