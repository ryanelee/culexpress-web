'use strict';

angular.module('culwebApp')
    .service('AuthService', function($rootScope, $http) {

        var self = this;

        self.userInfoKey = "user_info";
        self.userTypes = ['culwebapp_user', 'culwebapp_admin', 'culwebapp_public'];

        self.addStorage = function(obj, isGlobal) {
            if (isGlobal) {
                localStorage.setItem(self.userInfoKey, JSON.stringify(obj))
            } else {
                sessionStorage.setItem(self.userInfoKey, JSON.stringify(obj))
            }
        }

        self.clearStorage = function() {
            localStorage.removeItem(self.userInfoKey);
            localStorage.removeItem('user');
            sessionStorage.removeItem(self.userInfoKey);
        }

        self.getStorage = function(storageKey) {
            return sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey);
        }



        self.register = function(user, success, error) {
            var key = CryptoJS.lib.WordArray.random(128 / 8);

            var bodyData = {
                data: CryptoJS.AES.encrypt(JSON.stringify(user), key.toString()).toString(),
                key: key.toString()
            };

            $http.post(cul.apiPath + '/customer/register', bodyData).then(function(result) {
                self.clearStorage();
                var str_userInfo = JSON.stringify(result);
                sessionStorage.setItem(self.userInfoKey, str_userInfo);
                $rootScope.currentUser = result;

                success(result)
            }, function(err) {
                error(err)
            });
        };

        self.login = function(user, success, error) {
            var key = CryptoJS.lib.WordArray.random(128 / 8);

            var bodyData = {
                data: CryptoJS.AES.encrypt(JSON.stringify(user), key.toString()).toString(),
                key: key.toString()
            };

            return $http.post(cul.apiPath + '/customer/login2', bodyData);
        };


        self.getCustomerMessage = function(bodyData) {
            return $http.post(cul.apiPath + '/customer/getCustomerMessage', bodyData);
        }

        self.logout = function(success) {
            self.clearStorage();

            $rootScope.isLogined = false;
            $rootScope.currentUser = null;
            success && success();
        };

    });