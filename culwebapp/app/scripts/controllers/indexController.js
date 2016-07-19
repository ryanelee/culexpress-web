'use strict';

angular
    .module('culwebApp')
    .controller('IndexController', ['$rootScope', '$scope', '$location', 'AuthService', '$http',
    function ($rootScope, $scope, $location, AuthService, $http) {
        $scope.logout = function () {
            AuthService.logout(function () {
                $location.path('/login');
            });
        };

        $http.get(cul.apiPath + '/web/reference').success(function (data) {
            $scope.References = data;
        });

        $scope.$on('$routeChangeSuccess', function (scope, next, current) {
            $(document.body).scrollTop(0);
            if($location.path()==='/'){
                $('#txtTrackingNumber').val('');
            }
        });
       
    }]);