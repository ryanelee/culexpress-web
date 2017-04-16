'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:printOrder
 * @description
 * # printOrder
 */
angular.module('culAdminApp')
    .directive('printOrder', ["$timeout", "orderService", function($timeout, orderService) {
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
                    var _options = {
                        pageInfo: {
                            pageSize: 99999,
                            pageIndex: 1
                        },
                        orderNumber: orderNumbers
                    }
                    orderService.getList(_options, function(result) {
                        $scope.dataList = result.data;
                        //console.log(result.data);
                        $.each($scope.dataList, function(i, _data) {
                            _data._shippingFeeTotal = 0;
                            $.each(_data.outboundPackages, function(i, outboundPackage) {
                                _data._shippingFeeTotal += outboundPackage.shippingFee;
                            });
                            _data._shippingFeeTotal = _data._shippingFeeTotal.toFixed(2);
                        });


                        var shelf = { flag: "shelf", data: [] }
                        var j = 0;
                        for (var i = 0; i < $scope.dataList.length; i++) {
                            j++;
                            $scope.dataList[i].inboundPackages.forEach(function(e) {
                                var detail = {
                                    customerNumber: $scope.dataList[i].customerNumber,
                                    orderNumber: $scope.dataList[i].orderNumber,
                                    cartonCount: $scope.dataList[i].cartonCount,
                                    payDate: $scope.dataList[i].payDate,
                                    tip: $scope.dataList[i].tip,
                                }
                                if (e.shelfNumber) {
                                    detail.sort = e.shelfNumber.substr(0, 1);
                                } else {
                                    detail.sort = 'H'
                                }
                                detail.trackingNumber = e.trackingNumber;
                                detail.shelfNumber = e.shelfNumber;
                                detail.packageWeight = e.packageWeight;
                                shelf.data.push(detail);
                            })

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
                        _render();
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