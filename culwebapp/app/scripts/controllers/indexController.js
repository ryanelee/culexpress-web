'use strict';

angular
    .module('culwebApp')
    .controller('IndexController', ['$rootScope', '$scope', '$location', 'AuthService', '$http', 'Customer',
        function($rootScope, $scope, $location, AuthService, $http, Customer) {
            // if (!$rootScope.currentUser) {
            $rootScope.currentUser = AuthService.getUser();
            // };
            // console.log("客户编号：" + $rootScope.currentUser.customerNumber);
            $scope.logout = function() {
                AuthService.logout(function() {
                    $scope.isLogin();
                    $location.path('/login');
                });
            };
            $scope.isLogin = function() {
                $scope.isLogined = AuthService.isLogined();
            }
            $scope.isLogined = AuthService.isLogined();
            $scope.$on('isLogin', function() {
                $scope.isLogin();
            })

            $scope.tipMessageList = [];
            $scope.tipMessageLength = 0;
            $scope.getMessageOperationlog = function() {
                Customer.getMessageOperationlog().then(function(data) {
                    $scope.tipMessageList = data.data.data;  
                    $scope.tipMessageLength =  data.data.data.length;             
                })
            }
            $scope.getMessageOperationlog();

            // $scope.load = function() {  
            //     $scope.tipMessageLength = $scope.tipMessageList.length;  
            // }
            $scope.getDetail = function(item) {
                Customer.updateMessageOperation({ messageNumber: item.messageNumber }).then(function(data) {
                    $location.path('customer/question/' + item.messageNumber)
                })
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