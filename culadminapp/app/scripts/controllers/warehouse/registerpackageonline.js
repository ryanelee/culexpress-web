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
        function ($scope, $location, $window, orderService, warehouseService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.data = null;

            $scope.tempInboundPackageNumber = $location.search().trackingNumber || "";
            $scope.isPrint = false;
            $scope.isSplit = false;
            $scope.isDel = false;
            var _timeout = null;

            $scope.getCompatibleInboundTrackingNumber = function (trackingNumber) {
                //USPS: 420+5 zip code + 21/22 #s
                if (typeof trackingNumber == "string" && /^420\d{5}\d{21,22}$/.test(trackingNumber)) {
                    trackingNumber = trackingNumber.substr(8);
                }

                return trackingNumber;
            };

            $scope.keyDown = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.data = null;
                    $scope.checkInboundPackageNumber();
                }
            }

            $scope.checkInboundPackageNumber = function () {
                $scope.tempData = $scope.tempInboundPackageNumber
                $scope.getData();
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

            
            $scope.btnPrint = function (item) {
                if ($scope.data && $scope.data.shipServiceName && $scope.data.shipServiceName.toUpperCase().indexOf("USPS") > -1) {
                    $("USPS<div></div>").barcode(item.trackingNumber, "code128", {
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
                else {
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
            }

            $scope.btnEditAddPackage = function () {
                orderService.generatePackageNumber(function (result) {
                    $scope.data.outboundPackages.push({
                        trackingNumber: result[0].trackingNumber,
                        actualWeight: null,
                    });
                });
            }

            $scope.btnSplitPackage = function (item) {
                warehouseService.outboundPackageSplit({
                    "trackingNumber": item.trackingNumber,
                }, function (result) {
                    result.checked = true;
                    result.actualWeight = item.actualWeight;
                    $scope.data.outboundPackages.push(result);
                });
            }
            $scope.btnDelPackage = function (item) {
                if ($scope.data.outboundPackages.length <= 1) {
                    return plugMessenger.info("只有一个包裹，不允许删除");
                }
                if(item.status === "Packaged"){
                                 plugMessenger.confirm("该包裹已打包，是否删除？", function (isOk) {
                                    if (isOk) {
                                        orderService.deleteOutboundPackage({
                                            "number": item.trackingNumber,
                                        }, function (result) {
                                            $scope.tempInboundPackageNumber = $scope.tempData;
                                            console.log("2323",result);
                                            $scope.getData();
                                        });
                                    }
                                 })
                }else{
                   plugMessenger.confirm("确认删除转运包裹“" + item.trackingNumber + "”吗？", function (isOk) {
                    if (isOk) {
                        orderService.deleteOutboundPackage({
                            "number": item.trackingNumber,
                        }, function (result) {
                            $scope.tempInboundPackageNumber = $scope.tempData;
                            $scope.getData();
                        });
                    }
                });
                }
            
            }

            //pads left
            $scope.lpad = function(str, padString, length) {
                var val = str.substring(str.length - length, str.length);

                var count = 1;
                while (count < str.length - length){
                    val = padString + val;
                    count += 1;
                }
                    
                return val;
            }
            
            //pads right
            $scope.rpad = function(str, padString, length) {
                var val = str.substring(0, length);

                var count = 1;
                while (count < str.length - length){
                    val = val + padString;
                    count += 1;
                }

                return str;
            }

            $scope.getData = function () {
                if (!!$scope.tempInboundPackageNumber) {
                    orderService.getList({
                        receiveTrackingNumber: $scope.tempInboundPackageNumber
                    }, function (result) {
                        if (!!result && !!result.data && result.data.length > 0) {
                            if (!$scope.data) {
                                $scope.data = result.data[0];
                            }

                            if($scope.data.printStatus !== "Printed"){
                                $scope.tempInboundPackageNumber = "";
                                $scope.data = null;
                                return plugMessenger.error("订单未打印不能打包,请在订单打印页面打印.");
                            }

                            if ($scope.data.orderStatus !== "Processing" && $scope.data.orderStatus !== "Paid" && $scope.data.orderStatus !== "PartialShipped") {
                                $scope.tempInboundPackageNumber = "";
                                var orderStatus = $scope.data._orderStatus;
                                $scope.data = null;
                                return plugMessenger.error("无效订单状态,当前订单状态为["+ orderStatus +"]");
                            }

                            var _checked = false;
                            $.each($scope.data.inboundPackages, function (index, item) {
                                item._trackingNumber = $scope.lpad(item.trackingNumber,"*",6);

                                if (!item.checked) {
                                    if(0 === $scope.getCompatibleInboundTrackingNumber(item.trackingNumber.trim()).toLowerCase().localeCompare($scope.getCompatibleInboundTrackingNumber($scope.tempInboundPackageNumber.trim()).toLowerCase()))
                                        item.checked = true;
                                    // item.checked = $scope.getCompatibleInboundTrackingNumber(item.trackingNumber.trim()).toLowerCase() === $scope.getCompatibleInboundTrackingNumber($scope.tempInboundPackageNumber.trim()).toLowerCase();

                                    _checked = true;
                                }
                            });
                            $scope.data._quantityCount = 0;
                            $.each($scope.data.orderItems, function (index, item) {
                                $scope.data._quantityCount += item.quantity
                            });

                            //todo: 根据 _checked 调用提示音
                            if ($.grep($scope.data.inboundPackages, function (n) { return n.checked == true }).length == $scope.data.inboundPackages.length) {
                                //success
                            } else if (_checked == true) {
                                //match 
                            } else {
                                //no match
                            }
                        }
                        $scope.tempInboundPackageNumber = "";
                        console.log(result);
                    }); 
                } else {
                    $scope.tempInboundPackageNumber = "";
                }
            }

            $scope.checkInboundPackageNumber();
            
            $scope.checkNum = function (item) {
                if (item.subGoodNumber && item.subGoodNumber < 1) {
                    item.subGoodNumber = "";
                    plugMessenger.info("填写的数字不能小于1");
                }
            }
            

            $scope.dealUpdate = function (orderStatus) {
                var _count = 0;
                var checkedPackages = $scope.data.outboundPackages;
                var _callback = function () { 
                    plugMessenger.success("保存成功");
                    //   $window.sessionStorage.setItem("historyFlag", 1);                 $window.history.back();
                    // $location.path('/warehouse/package');
                    //打包完成后停留在到打包界面继续打包操作 
                    //  $location.path('/warehouse/registerpackageonline');
                    var element = $window.document.getElementById('tempInboundPackageNumber');
                    if (element) element.focus()
                    _reset();
                }
                //记录当前已扫描包裹的重量，并新增轨迹信息：完成称重,已计算出运费
                $.each(checkedPackages, function (i, pkg) {
                    pkg.status = 'Packaged';
                    orderService.updateOutboundPackage(pkg, function (result) {
                        if (!result.message) {
                            _count++;
                            if (_count == checkedPackages.length) {
                                _callback();
                            }
                        }
                    })
                });
            }
            // 打包
            $scope.btnSave = function () {
                if (!!$scope.data && $scope.data.inboundPackages.length > 0) {
                    if ($scope.data.outboundPackages[0].actualWeight <= 0) {
                        plugMessenger.error("请填写实际包裹重量！");
                        return;
                    }
                    var flag = 1;
                    if ($scope.data.orderStatus == "Paid" && $scope.data.printStatus == "UnPrinted") {
                        plugMessenger.confirm("该订单[" + $scope.data.orderNumber + "]未打印,确认打包处理?", function (isOk) {
                            if (isOk) {
                                if ($.grep($scope.data.inboundPackages, function (n) { return n.checked == true }).length == $scope.data.inboundPackages.length) {
                                    $scope.dealUpdate("WaybillUpdated");
                                } else {
                                    $scope.dealUpdate("PartialShipped");
                                    // plugMessenger.info("订单包裹尚未完成扫描");
                                }
                            }
                        })
                    } else {
                        if ($.grep($scope.data.inboundPackages, function (n) { return n.checked == true }).length == $scope.data.inboundPackages.length) {
                            $scope.dealUpdate("WaybillUpdated");
                        } else {
                            // $scope.dealUpdate("PartialShipped");
                            plugMessenger.info("订单包裹尚未完成扫描");
                        }
                    }
                }
            }

            $scope.btnPrev = function () {
                $window.sessionStorage.setItem("historyFlag", 1); $window.history.back();
            }

            var _reset = function () {
                $scope.data = null;
                $scope.tempInboundPackageNumber = "";
            }
        }
    ]);