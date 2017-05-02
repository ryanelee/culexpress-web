var sysServices = angular.module('sysServices', []);

sysServices.factory('storage', ['$window', function($window) {
    return {
        session: {
            setObject: function(key, obj) {
                $window.sessionStorage.setItem(key, angular.toJson(obj));
            },
            getObject: function(key) {
                return angular.fromJson($window.sessionStorage.getItem(key));
            },
            setValue: function(key, value) {
                $window.sessionStorage.setItem(key, value);
            },
            getValue: function(key) {
                return $window.sessionStorage.getItem(key);
            }
        },
        local: {
            setObject: function(key, obj) {
                $window.localStorage.setItem(key, angular.toJson(obj));
            },
            getObject: function(key) {
                return angular.fromJson($window.localStorage.getItem(key));
            },
            setValue: function(key, value) {
                $window.localStorage.setItem(key, value);
            },
            getValue: function(key) {
                return $window.localStorage.getItem(key);
            },
            remove: function(key) {
                $window.localStorage.removeItem(key);
            }
        }
    }
}]);


sysServices.factory('Auth', ['storage', '$http', '$window', '$location',
    function(storage, $hhtp, $window, $location) {
        return {
            getToken: function() {
                return storage.session.getValue('jwtToken');
            },
            setToken: function(token) {
                storage.session.setValue('jwtToken', token);
            },
            isAuthenticated: function() {
                if (storage.session.getObject('user')) {
                    return true;
                } else {
                    return false;
                }
            },
            getUser: function() {
                return storage.session.getObject('user');
            },
            setUser: function(user) {
                storage.session.setObject('user', user);
            },
            logout: function() {
                storage.session.remove('jwtToken');
                storage.session.remove('user');
            },
            login: function(obj) {

            }
        }
    }
]);