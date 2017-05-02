'use strict';

angular
    .module('culwebApp')
    .controller('IndexController', ['$rootScope', '$scope', '$location', 'AuthService', '$http', 'Customer',
        function($rootScope, $scope, $location, AuthService, $http, Customer) {
            if (!$rootScope.currentUser) {
                $rootScope.currentUser = JSON.parse(AuthService.getStorage(AuthService.userInfoKey));
            };
            console.log("客户编号："+$rootScope.currentUser.customerNumber);
            $scope.logout = function() {
                AuthService.logout(function() {
                    $location.path('/login');
                });
            };

            $scope.tipMessageList=[];
            $scope.getMessageOperationlog = function() {
                Customer.getMessageOperationlog().then(function(data) {
                    $scope.tipMessageList = data.data.data;
                })
            }
            $scope.getMessageOperationlog();

            $scope.getDetail = function(item) {
                Customer.updateMessageOperation({ messageNumber: item.messageNumber }).then(function(data) {
                })
                $location.path('customer/question/' + item.messageNumber)

            }
            
            $scope.btnViewMessageList = function() {
                $location.path('customer/myquestions');
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