'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:RegisterPackageOnlineCtrl
 * @description
 * # RegisterPackageOnlineCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('RegisterPackageOnlineCtrl', ['$scope', '$location', '$window', 'orderService', 'warehouseService', 'plugMessenger',
        function($scope, $location, $window, orderService, warehouseService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.data = null;

            $scope.tempOutboundPackageNumber = $location.search().trackingNumber || "";
            $scope.isPrint = false;
            $scope.isSplit = false;
            $scope.isDel = false;
            var _timeout = null;
            $scope.checkInboundPackageNumber = function() {
                $scope.tempData = $scope.tempInboundPackageNumber

                if (!!_timeout) clearTimeout(_timeout);
                _timeout = setTimeout(function() {
                    $scope.$apply(function() {
                        if (!!$scope.tempInboundPackageNumber) {
                            orderService.getList({
                                receiveTrackingNumber: $scope.tempInboundPackageNumber
                            }, function(result) {

                                if (!!result && !!result.data && result.data.length > 0) {
                                    if (!$scope.data) {
                                        $scope.data = result.data[0];
                                        console.log($scope.data);
                                    }
                                    var _checked = false;
                                    $.each($scope.data.inboundPackages, function(index, item) {
                                        if (!item.checked) {
                                            item.checked = item.trackingNumber == $scope.tempInboundPackageNumber;
                                            _checked = true;
                                            // $each($scope.data.outboundPackages, function(i, t) {
                                            //     t.actualWeight = item.packageWeight
                                            // })
                                        }
                                         $scope.data.outboundPackages[0].actualWeight = 0;
                                        if (item.checked) {
                                            $scope.data.outboundPackages[0].actualWeight += item.packageWeight;
                                        }
                                    });

                                    //todo: 根据 _checked 调用提示音
                                    if ($.grep($scope.data.inboundPackages, function(n) { return n.checked == true }).length == $scope.data.inboundPackages.length) {
                                        //success
                                    } else if (_checked == true) {
                                        //match
                                    } else {
                                        //no match
                                    }
                                }
                                $scope.tempInboundPackageNumber = "";
                            });
                        } else {
                            $scope.tempInboundPackageNumber = "";
                        }
                    })
                }, 1000);
            }

        //   $scope.btnSplitPackage = function (item) {
        //       warehouseService.outboundPackageSplit({
        //           "trackingNumber": item.trackingNumber,
        //       }, function (result) {
        //           result.checked = true
        //           $scope.data.outboundPackages.push(result);
        //       });
        //   }
        //    $scope.btnDelPackage = function (item) {
        //        plugMessenger.confirm("确认删除转运包裹" + item.trackingNumber + "吗？", function (isOk) {
        //             if (isOk) {
        //                orderService.deleteOutboundPackage({
        //                     "number": item.trackingNumber,
        //                 }, function (result) {
        //                     console.log(result)
        //                     if (result.code == '000') {
        //                         plugMessenger.success("删除成功");
        //                     }
        //                 })
        //             }
        //         });       
        //   }

            $scope.checkInboundPackageNumber();

            $scope.btnPrint = function(item) {
                $("<div></div>").barcode(item.trackingNumber, "code128", {
                    addQuietZone: "1",
                    barHeight: "50",
                    barWidth: "1",
                    bgColor: "#FFFFFF",
                    color: "#000000",
                    moduleSize: "5",
                    output: "css",
                    posX: "10",
                    posY: "20"
                }).jqprint();
            }

            $scope.btnEditAddPackage = function() {
                orderService.generatePackageNumber(function(result) {
                    $scope.data.outboundPackages.push({
                        trackingNumber: result[0].trackingNumber,
                        actualWeight: null,
                    });
                });
            }

            $scope.btnSplitPackage = function(item) {
                warehouseService.outboundPackageSplit({
                    "trackingNumber": item.trackingNumber,
                }, function(result) {
                    result.checked = true
                    $scope.data.outboundPackages.push(result);
                });
            }
            $scope.btnDelPackage = function(item) {
                if ($scope.data.outboundPackages.length <= 1) {
                    return plugMessenger.info("只有一个包裹，不允许删除");
                }
                plugMessenger.confirm("确认删除转运包裹“" + item.trackingNumber + "”吗？", function (isOk) {
                    if (isOk) {
                       orderService.deleteOutboundPackage({
                            "number": item.trackingNumber,
                        }, function(result) {
                            // console.log($scope.tempData);
                            $scope.tempInboundPackageNumber = $scope.tempData;
                            $scope.getData();

                        });
                    }
                });       
            }

            $scope.getData = function() {
                if (!!$scope.tempInboundPackageNumber) {
                    orderService.getList({
                        receiveTrackingNumber: $scope.tempInboundPackageNumber
                    }, function(result) {
                        // console.log(result);
                        if (!!result && !!result.data && result.data.length > 0) {
                            $scope.data = result.data[0];
                            var _checked = false;
                            $.each($scope.data.inboundPackages, function(index, item) {
                                if (!item.checked) {
                                    item.checked = item.trackingNumber == $scope.tempInboundPackageNumber;
                                    _checked = true;
                                }
                            });
                            $scope.data.outboundPackages
                        }
                        $scope.tempInboundPackageNumber = "";
                    });
                } else {
                    $scope.tempInboundPackageNumber = "";
                }
            }

            $scope.btnSave = function() {
                if (!!$scope.data && $scope.data.inboundPackages.length > 0) {
                    if ($.grep($scope.data.inboundPackages, function(n) { return n.checked == true }).length == $scope.data.inboundPackages.length) {
                        var _count = 0;
                        var checkedPackages = $scope.data.outboundPackages;
                        var _callback = function() {
                                plugMessenger.success("保存成功");
                                //   $window.history.back();
                                // $location.path('/warehouse/package');
                                //打包完成后继续跳转到打包界面继续打包操作 
                                 $location.path('/warehouse/registerpackageonline');
                                _reset();
                            }
                            //记录当前已扫描包裹的重量，并新增轨迹信息：完成称重,已计算出运费
                        $.each(checkedPackages, function(i, pkg) {
                            orderService.updateOutboundPackage(pkg, function(result) {
                                if (!result.message) {
                                    _count++;
                                    if (_count == checkedPackages.length) {
                                        _callback();
                                    }
                                }
                            })
                        });
                    } else {
                        plugMessenger.info("订单包裹尚未完成扫描");
                    }
                }
            }

            $scope.btnPrev = function() {
                $window.history.back();
            }

            var _reset = function() {
                $scope.data = null;
                $scope.tempOutboundPackageNumber = "";
            }
        }
    ]);