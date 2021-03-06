﻿'use strict';

/**
 * @ngdoc directive
 * @name culwebApp.directive:printOrder
 * @description
 * # printOrder 
 */
angular.module('culwebApp')
    .directive('printOrder', ["$timeout", "OrderSvr", "customerMessageService", function ($timeout, orderSvr, customerMessageService) {
        return {
            templateUrl: "views/templates/common/print-order_tpl.html",
            restrict: 'E',
            replace: true,
            scope: true,
            link: function postLink($scope, $element, attrs) {
                var barCodeSettings = {
                    addQuietZone: "1",
                    barHeight: "25",
                    barWidth: "1",
                    bgColor: "#FFFFFF",
                    color: "#000000",
                    moduleSize: "5",
                    output: "css",
                    posX: "10",
                    posY: "20"
                }

                $scope.$on("print-order.action", function(e, orderNumbers) {
                    if (!angular.isArray(orderNumbers)) $scope.orderNumbers = [orderNumbers];
                    else $scope.orderNumbers = orderNumbers;
                    $scope.printDate = new Date();
                    $scope.dataList = [];
                    $scope.packagesList = [];
                    
                    var pageIndex = 1;
                    var pageSize = 9999;

                    orderSvr.getOrderList(pageIndex, angular.extend({
                        customerNumber: $scope.$root.currentUser.customerNumber,
                        orderNumber: orderNumbers
                    }, {}), pageSize)
                    .then(function (result) {
                        if (result.data) {
                            $scope.dataList = result.data.data;
                            $.each($scope.dataList, function(i, _data) {
                                _data._shippingFeeTotal = 0;
                            
                                $.each(_data.outboundPackages, function(i, outboundPackage) {
                                    _data._shippingFeeTotal += outboundPackage.shippingFee;
                                });
                                _data._shippingFeeTotal = _data._shippingFeeTotal.toFixed(2);
                            });
                            console.log(result);
                            var shelf = { flag: "shelf", data: [] }
                            var j = 0;
                            for (var i = 0; i < $scope.dataList.length; i++) {
                                j++;
                                if($scope.dataList[i].inboundPackages && $scope.dataList[i].inboundPackages.length > 0){
                                    $scope.dataList[i].inboundPackages.forEach(function(e) {
                                        var detail = {
                                            customerNumber: $scope.dataList[i].customerNumber,
                                            orderNumber: $scope.dataList[i].orderNumber,
                                            cartonCount: $scope.dataList[i].cartonCount,
                                            payDate: $scope.dataList[i].payDate,
                                            tip: $scope.dataList[i].tip,
                                        }
                                        if (e.shelfNumber) {
                                            detail.sort = e.shelfNumber
                                        } else {
                                            detail.sort = 'H'
                                        }
                                        detail.trackingNumber = e.trackingNumber;
                                        detail.shelfNumber = e.shelfNumber;
                                        detail.packageWeight = e.packageWeight;
                                        shelf.data.push(detail);
                                    }) 
                                } 
                                
                                if (j % 10 == 0 || i == $scope.dataList.length - 1) {
                                    var tempshelf = _.sortBy(shelf.data, function(item) {
                                        return item.sort;
                                    });
                                    shelf.data = tempshelf;
                                    $scope.dataList.splice(i + 1, 0, shelf);
                                    shelf = { flag: "shelf", data: [] }
                                    i++;

                                }                         
                            } 
                            $.each($scope.dataList, function(i, _data) {
                                console.log("_data",$scope.dataList)
                                customerMessageService.getDetail(_data.orderMessageNumber, function(result) {
                                    if (result.data) {;
                                        if(result.data.messageLogs) {                              
                                            _data._orderMessage = result.data.messageLogs[0].message                                                          
                                        }
                                    }
                                    if (i == ($scope.dataList.length - 1)){
                                        _render()
                                    }
                                });
                            }); 
                        }
                    });
                    //$.each($scope.orderNumbers, function (index, ordeNumber) {
                    //    orderService.getDetail(ordeNumber, function (result) {
                    //        $scope.dataList.push(result);
                    //        _render();
                    //    });
                    //});
                });
                var _render = function() {
                    if ($scope.dataList.length == $scope.dataList.length) {
                        $timeout(function() {
                            $.each($element.find("div[orderNumber]"), function(index, el) {
                                $(el).barcode($(el).attr("orderNumber"), "code128", barCodeSettings);
                            });

                            $.each($element.find("div[trackingNumber]"), function(index, el) {
                                $(el).barcode($(el).attr("trackingNumber"), "code128", barCodeSettings);
                            });

                            $element.children().jqprint();
                        }, 500);
                    }
                }
            }
        };
    }]);