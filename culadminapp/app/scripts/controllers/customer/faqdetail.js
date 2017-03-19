﻿'use strict';
 
/**
 * @ngdoc function
 * @name culAdminApp.controller:FAQDetailCtrl
 * @description
 * # FAQDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('FAQDetailCtrl', ["$scope", "$location", "$window", "faqService", "warehouseService", "customerMessageService", "plugMessenger",
        function($scope, $location, $window, faqService, warehouseService, customerMessageService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.messageTypeList = [];
            $scope.search = {};
            $scope.tpl_status = {
                messageNumber: $location.search().messageNumber,
                messageTypeData: [],
                warehouseList: []
            }




            faqService.getMessageType(7, function(result) {
                $scope.tpl_status.messageTypeData = [{ "typeID": "", "typeName": "全部" }].concat(result);
                result.forEach(function(data) {
                    if (data.typeID == '19' || data.typeID == '20' ||
                        data.typeID == '21' || data.typeID == '22' ||
                        data.typeID == '23' || data.typeID == '24' ||
                        data.typeID == '25' || data.typeID == '26') {
                        $scope.messageTypeList.push(data);
                    }
                })

            });
            // faqService.getMessageType();
            warehouseService.getWarehouse(function(result) {
                $scope.tpl_status.warehouseList = result;
            });

            faqService.getDetail($scope.tpl_status.messageNumber, function(result) {
                console.log(result);
                $scope.images = result.images.split(',')
                console.log($scope.images)
                $scope.data = result;
                faqService.getMessagelog({ messageNumber: $scope.tpl_status.messageNumber }, function(logs) {
                    $scope.logs = logs.data;
                    var _messageType = $.grep($scope.tpl_status.messageTypeData, function(n) { return n.typeID == $scope.data.messageType });
                    if (_messageType.length > 0) $scope.data._messageType = _messageType[0].typeName;
                    switch ($scope.data.status) {
                        case "0":
                        case "Closed":
                            $scope.data._status = "已关闭";
                            break;
                        case "1":
                        case "Processing":
                            $scope.data._status = "待处理";
                            break;
                        case "ForwardWH":
                            $scope.data._status = "转交仓库";
                            break;
                    }
                    var _receivedWarehouse = $.grep($scope.tpl_status.warehouseList, function(n) { return n.warehouseNumber == $scope.data.receivedWarehouseNumber });
                    if (_receivedWarehouse.length > 0) $scope.data._receivedWarehouseName = _receivedWarehouse[0].warehouseName;
                    $scope.refreshMessage();
                })

            });

            $scope.refreshMessage = function() {
                customerMessageService.getDetail($scope.tpl_status.messageNumber, function(result) {
                    $scope.messageLogs = [];
                    if (!!result) {
                        $scope.messageLogs = result.messageLogs;
                    }
                });
            }

            $scope.btnMessagePush = function() {
                    if (!!$scope._message) {
                        customerMessageService.push({
                            "messageNumber": $scope.tpl_status.messageNumber,
                            "message": $scope._message
                        }, function(result) {
                            $scope.refreshMessage();
                            $scope._message = "";
                        });
                    }
                }
                //查看客户信息
           $scope.btnOpenDetail = function (type, item) {
              switch (type) {
                  case "customerDetail":
                      $location.search({ customerNumber: item.customerNumber });
                      $location.path("/customer/customerdetail");
                      break;
              }
          }

            $scope.btnViewCustomer = function(orderNumber) {
                console.log(orderNumber);
                return;
                $location.path("/order/orderdetail").search({ orderNumber: 'JK020OJWV10000049' });
            }


            $scope.setMessageLog = function() {
                if (!$scope.search.messageType) {
                    plugMessenger.error("请选择转交问题");
                    return;
                }
                $scope.search.messageNumber = $scope.data.messageNumber;
                $scope.search.typeId = $scope.search.messageType.typeID;
                $scope.search.typeName = $scope.search.messageType.typeName;
                faqService.setMessagelog($scope.search, function(data) {
                })
            }






            $scope.btnUpdateStatus = function(status) {
                var _update = function() {
                    faqService.update({
                        "messageNumber": $scope.data.messageNumber,
                        "messageType": $scope.data.messageType,
                        "status": status
                    }, function(result) {
                        if (result.success == true) {
                            plugMessenger.success("处理成功");
                            $scope.btnPrev();
                        }
                    });
                }
                switch (status) {
                    case "Closed":
                        if ($scope.data.status == 0 || $scope.data.status == "Closed") {
                            return;
                        } else {
                            plugMessenger.confirm("确认关闭该问题?", function(isOk) {
                                if (isOk) _update();
                            })
                        }
                        break;
                    case "ForwardWH":
                        if ($scope.data.status == "ForwardWH") {
                            return;
                        } else {
                            plugMessenger.confirm("请确认转交该问题到仓库处理?", function(isOk) {
                                if (isOk) _update();
                            })
                        }
                        break;
                }

            }

            $scope.btnPrev = function() {
                $window.history.back();
            }
        }
    ]);