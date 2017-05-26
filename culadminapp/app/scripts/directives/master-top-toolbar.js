'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:masterTopToolbar
 * @description
 * # masterTopToolbar
 */
angular.module('culAdminApp')
    .directive('masterTopToolbar', ["$rootScope", "$http", "userService", "$location", "customerService", "faqService",
        function($rootScope, $http, userService, $location, customerService, faqService) {
            return {
                templateUrl: "views/templates/master/top_tpl.html",
                restrict: 'E',
                replace: true,
                $scope: true,
                link: function postLink($scope, $element, attrs) {
                    //console.log('2345678');
                    $rootScope.$emit('changeMenu');
                    $scope.btnLogout = function() {
                        userService.logout(function() {
                            $scope.$root.userInfo = null;
                        });
                    };

                    $scope.btnViewMessageList = function() {
                        $location.path("/customer/messagelist");
                    }

                    $scope.getVipAndMsg = function() {
                        customerService.getVipAndMsg({}, function(result) {
                            $scope.vipCount = result.data.count;
                            $scope.vipData = result.data.data;
                        })
                    }
                    $rootScope.getmessageList = function() {
                        // status: 'Processing' 
                        faqService.getMessageOperationlog({ status: 'Processing' }, function(result) {
                            console.log(result);
                            $scope.tipMessage = result.data;
                            $scope.tipMessageLength = result.data.length;
                        })
                    }
                    $scope.getVipAndMsg();
                    $rootScope.getmessageList();
                    $scope.btnViewMessage = function(message) {
                        $location.path("/customer/faqdetail").search({ messageNumber: message.messageNumber });
                    }
                    $scope.$on('message', function(result) {
                        $rootScope.getmessageList();
                    })

                    $scope.btnViewCustomer = function(vip) {
                        $location.path("/customer/customerdetail").search({ customerNumber: vip.customerNumber });
                    }

                    $scope.btnViewCustomerList = function() {
                        $location.path("/customer/customerlist");
                    }
                }
            };
        }
    ]);