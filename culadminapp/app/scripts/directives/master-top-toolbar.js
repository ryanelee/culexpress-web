﻿'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:masterTopToolbar
 * @description
 * # masterTopToolbar
 */
angular.module('culAdminApp')
    .directive('masterTopToolbar', ["$rootScope", "$http", "userService", "$location", "customerService", "faqService", "plugMessenger",
        function ($rootScope, $http, userService, $location, customerService, faqService, plugMessenger) {
            return {
                templateUrl: "views/templates/master/top_tpl.html",
                restrict: 'E',
                replace: true,
                $scope: true,
                link: function postLink($scope, $element, attrs) {
                    $rootScope.$emit('changeMenu');
                    $scope.btnLogout = function () {
                        userService.logout(function () {
                            $scope.$root.userInfo = null;
                        });
                    };

                    $scope.btnViewMessageList = function () {
                        $location.path("/customer/messagelist");
                    }

                    $scope.btnVieIdauthList = function () {
                        $location.path("/customer/idauth");
                    }

                    $scope.getVipAndMsg = function () {
                        customerService.getVipAndMsg({}, function (result) {
                            $scope.vipCount = result.data.count;
                            $scope.vipData = result.data.data;
                        })
                    }
                    $rootScope.getmessageList = function () {
                        // status: 'Processing' 
                        faqService.getMessageOperationlog({ status: 'Processing', noMessageType: 28 }, function (result) {
                            $scope.tipMessage = result.data;
                            $scope.tipMessageLength = result.data.length;
                        })
                    }

                    $rootScope.getIdMessageList = function () {
                        // status: 'Processing' 
                        faqService.getMessageOperationlog({ status: 'Processing', messageTypes: 28 }, function (result) {
                            $scope.idMessage = result.data;
                            $scope.idCardLength = result.data.length;
                        })
                    }
                    $scope.$on("updateMessageList", function () {
                        $rootScope.getIdMessageList();
                    })

                    $scope.getVipAndMsg();
                    $rootScope.getmessageList();
                    $rootScope.getIdMessageList();
                    $scope.updateAllIdMessageOperate = function () {
                        plugMessenger.confirm(" 确定标记所有身份证申请为已读", function (isOk) {
                            if (isOk) {
                                faqService.updateMessageOperation({ idAll: true }).then(function (data) {
                                    $rootScope.getIdMessageList();
                                })
                            }
                        })

                    }
                    $scope.btnViewMessage = function (message) {
                        $location.path("/customer/faqdetail").search({ messageNumber: message.messageNumber });
                    }
                    $scope.btnViewAddressMessage = function (message) {
                        faqService.updateMessageOperation({ messageNumber: message.messageNumber }).then(function (data) {
                            if (message.authType == 2) {
                                $location.path("/customer/idauth").search({ authType: 2 });
                            } else {
                                $location.path("/customer/addressdetail").search({ transactionNumber: message.addressId });

                            }
                        })
                    }

                    $scope.$on('message', function (result) {
                        $rootScope.getmessageList();
                    })

                    $scope.btnViewCustomer = function (vip) {
                        $location.path("/customer/customerdetail").search({ customerNumber: vip.customerNumber });
                    }

                    $scope.btnViewCustomerList = function () {
                        $location.path("/customer/customerlist");
                    }
                }
            };
        }
    ]);