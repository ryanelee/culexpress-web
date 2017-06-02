angular.module('culAdminApp')
    .factory('storage', ['$window', function ($window) {
        return {
            session: {
                setObject: function (key, obj) {
                    $window.sessionStorage.setItem(key, angular.toJson(obj));
                },
                getObject: function (key) {
                    return angular.fromJson($window.sessionStorage.getItem(key));
                },
                setValue: function (key, value) {
                    $window.sessionStorage.setItem(key, value);
                },
                getValue: function (key) {
                    return $window.sessionStorage.getItem(key);
                },
                remove: function (key) {
                    $window.sessionStorage.removeItem(key);
                }
            },
            local: {
                setObject: function (key, obj) {
                    $window.localStorage.setItem(key, angular.toJson(obj));
                },
                getObject: function (key) {
                    return angular.fromJson($window.localStorage.getItem(key));
                },
                setValue: function (key, value) {
                    $window.localStorage.setItem(key, value);
                },
                getValue: function (key) {
                    return $window.localStorage.getItem(key);
                },
                remove: function (key) {
                    $window.localStorage.removeItem(key);
                }
            },
            getSearchObject: function () {
                var searchBar = "";
                console.log('12');
                console.log(this.session.getValue("historyFlag"));
                if (this.session.getValue("historyFlag") == 1) {
                    if (this.session.getObject("searchBar")) {
                        searchBar = this.session.getObject("searchBar");
                        if (searchBar.startDate) {
                            searchBar.startDate = new Date(searchBar.startDate)
                        }
                        if (searchBar.endDate) {
                            searchBar.endDate = new Date(searchBar.startDate)
                        }
                    }
                    this.session.remove("historyFlag");
                }
                return searchBar;
            }
        }
    }]);