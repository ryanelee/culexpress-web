'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:masterTopToolbar
 * @description
 * # masterTopToolbar
 */
angular.module('culAdminApp')
    .directive('masterTopToolbar', ["$http", "userService", "$location", "customerService", "faqService",
        function($http, userService, $location, customerService, faqService) {
            return {
                templateUrl: "views/templates/master/top_tpl.html",
                restrict: 'E',
                replace: true,
                $scope: true,
                link: function postLink($scope, $element, attrs) {
                    $scope.btnLogout = function() {
                        userService.logout(function() {
                            $scope.$root.userInfo = null;
                        });
                    };

                    console.log("wonderful");
                    $scope.btnViewMessageList = function() {
                        $location.path("/customer/messagelist");
                    }

                    $scope.getVipAndMsg = function() {
                        customerService.getVipAndMsg({}, function(result) {
                            console.log(result);
                            $scope.vipCount = result.data.count;
                            $scope.vipData = result.data.data;
                        })
                    }
                    $scope.getmessageList = function() {
                        faqService.getList({}, function(result) {
                            $scope.tipMessage = result.data;
                            $scope.tipMessageLength = result.data.length;
                            console.log("__" + $scope.tipMessageLength);
                        })
                    }
                    $scope.getVipAndMsg();
                    $scope.getmessageList();
                    $scope.btnViewMessage = function(message) {
                        $location.path("/customer/faqdetail").search({ messageNumber: message.messageNumber });
                    }

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