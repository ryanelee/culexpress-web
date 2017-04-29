'use strict';

angular
    .module('culwebApp')
    .controller('IndexController', ['$rootScope', '$scope', '$location', 'AuthService', '$http', 'Customer',
        function($rootScope, $scope, $location, AuthService, $http, Customer) {
            $scope.logout = function() {
                AuthService.logout(function() {
                    $location.path('/login');
                });
            };



            $scope.getMessageOperationlog = function() {
                Customer.getMessageOperationlog().then(function(data) {
                    console.log("34567")
                    console.log(data)
                })
            }
            $scope.getMessageOperationlog();

            $scope.getDetail = function() {
                Customer.getMessageOperationlog({ messageNumber: item.messageNumber }).then(function(data) {
                    console.log("34567")
                    console.log(data)
                })
                $location.path('customer/question/JK07220170424155914')

            }



            // $http.get(cul.apiPath + '/web/reference').then(function (data) {
            //     $scope.References = data;
            // });

            $scope.$on('$routeChangeSuccess', function(scope, next, current) {
                $(document.body).scrollTop(0);
                if ($location.path() === '/') {
                    $('#txtTrackingNumber').val('');
                }
            });

        }
    ]);