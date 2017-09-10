'use strict';

angular.module('culwebApp')
    .service('AuthService', function($rootScope, $http, $window) {

        var self = this;

        self.userInfoKey = "user_info";
        self.userTypes = ['culwebapp_user', 'culwebapp_admin', 'culwebapp_public'];

        self.addStorage = function(obj, isGlobal) {
            sessionStorage.setItem(self.userInfoKey, JSON.stringify(obj))
            if (isGlobal) {
                localStorage.setItem(self.userInfoKey, JSON.stringify(obj))
            } else {
                // sessionStorage.setItem(self.userInfoKey, JSON.stringify(obj))
            }
        }

        self.clearStorage = function() {
            console.log("哈哈哈哈");
            localStorage.removeItem(self.userInfoKey);
            sessionStorage.removeItem(self.userInfoKey);
            window.sessionStorage.removeItem('cache_warehouse');
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
                self.setUser(result);
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
            // localStorage.removeItem('user');

            $rootScope.currentUser = null;
            success && success();
        };


        self.storage = function() {
            return {
                session: {
                    setObject: function(key, obj) {
                        sessionStorage.setItem(key, angular.toJson(obj));
                    },
                    getObject: function(key) {
                        return angular.fromJson(sessionStorage.getItem(key));
                    },
                    setValue: function(key, value) {
                        sessionStorage.setItem(key, value);
                    },
                    getValue: function(key) {
                        return sessionStorage.getItem(key);
                    }
                },
                local: {
                    setObject: function(key, obj) {
                        localStorage.setItem(key, angular.toJson(obj));
                    },
                    getObject: function(key) {
                        return angular.fromJson(localStorage.getItem(key));
                    },
                    setValue: function(key, value) {
                        localStorage.setItem(key, value);
                    },
                    getValue: function(key) {
                        return localStorage.getItem(key);
                    },
                    remove: function(key) {
                        localStorage.removeItem(key);
                    }
                }
            }
        }

        self.isLogined = function() {
            if (sessionStorage.getItem('user_info')) {
                return true;
            } else {
                return false;
            }
        }

        self.setUser = function(user) {
            sessionStorage.setItem('user_info', angular.toJson(user));
        }

        self.getUser = function() {
            return angular.fromJson(sessionStorage.getItem('user_info'));
        }

        self.Auth = function() {
            return {
                getToken: function() {
                    return self.storage.session.getValue('jwtToken');
                },
                setToken: function(token) {
                    self.storage.session.setValue('jwtToken', token);
                },
                isLogined: function() {
                    if (self.storage.session.getObject('user_info')) {
                        return true;
                    } else {
                        return false;
                    }
                },
                getUser: function() {
                    return self.storage.session.getObject('user_info');
                },
                setUser: function(user) {
                    self.storage.session.setObject('user_info', user);
                },
                logout: function() {
                    self.storage.session.remove('jwtToken');
                    self.storage.session.remove('user_info');
                },
                login: function(obj) {

                }
            }
        }




    });