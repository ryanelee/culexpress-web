'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ReceiptNoASNCtrl
 * @description
 * # ReceiptNoASNCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('ReceiptNoASNCtrl', ['$scope', '$location', '$window', 'receiptService', 'warehouseService', 'plugMessenger', '$timeout',
        function ($scope, $location, $window, receiptService, warehouseService, plugMessenger, $timeout) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.data = {};
            $scope.warehouseList = [];
            $scope.flag = '0';
            $scope.customerNumberFocus = false;

            $scope.myKeyup = function (e) {
                $scope.myKeyup = function (e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    if (keycode == 13) {
                        $scope.register();
                    }
                };
            };



            $scope.data = {
                trackingNumber: angular.copy($location.search().trackingNumber || ""),
                inboundStatus: angular.copy($location.search().inboundStatus || "")
            }

            if ($scope.data.inboundStatus <= 1) {
                $window.document.getElementById("txtTrackingNumber").focus();
            }
            if ($scope.data.trackingNumber) {
                //$window.document.getElementById("packageWeight").focus();
            }
            $scope._trackingNumber = "";

            $scope.tpl_status = {
                warehouseList: [],
                isExist: false
            }

            $scope.getPackageDetail = function () {
                if (!!$scope.data.trackingNumber && $scope._trackingNumber != $scope.data.trackingNumber) {
                    warehouseService.getInboundPackageDetail($scope.data.trackingNumber, function (result) {
                        if (result == null) {
                            //新增
                            var _newNumber = angular.copy($scope.data.trackingNumber);
                            $scope.data = { trackingNumber: _newNumber }
                            $scope._trackingNumber = "";
                            $scope.tpl_status.isExist = false;
                            $scope.data.inboundStatus = angular.copy($location.search().inboundStatus || "");
                        } else {
                            //修改
                            console.log("feichang" + JSON.stringify(result));
                            $scope.data = result;
                            $scope.data.inboundStatus = angular.copy($location.search().inboundStatus || "");
                            $scope._trackingNumber = angular.copy($scope.data.trackingNumber);
                            $scope.tpl_status.isExist = true;
                        }
                    });
                }
            }

            // $scope.hotKey = function (event) {
            //     switch (event.keyCode) {
            //         case 13:  //enter
            //             $scope.getPackageDetail();
            //             break;
            //     }
            // }

            // warehouseService.getWarehouse(function (result) {
            //     $scope.tpl_status.warehouseList = result;
            // });

            warehouseService.getWarehouse(function (result) {
                for (var i = 0; i < result.length; i++) {
                    var detail = {}
                    $scope.data.warehouseNumber = result[0].warehouseNumber
                    detail['key'] = result[i].warehouseNumber
                    detail['value'] = result[i].warehouseName;
                    $scope.warehouseList.push(detail);
                    $scope.getPackageDetail();

                }
            });

            $scope.checkReceiveIdentity = function (e) {
                console.log('2345')
                // $scope.myKeyup = function (e) {
                console.log(2)
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    console.log('2345')
                    if (!$scope.data.receiveIdentity) {
                        plugMessenger.error("客户标示不能为空");
                        return;
                    }
                    $scope.flag = '0'
                    receiptService.checkReceiveIdentity($scope.data).then(function (result) {
                        if (result.data.code == '999') {
                            document.getElementById("receiveIdentity").focus()
                            plugMessenger.error(result.data.msg);
                            return;
                        }
                        if (result.data.code == '000') {
                            packageDescription.focus()
                            $scope.data.customerNumber = result.data.data[0].customerNumber
                            console.log($scope.data.tempCustomerNumber);
                        }
                    })
                }
                // };
            };


            //  $scope.myKeyup = function (e) {
            //     $scope.myKeyup = function (e) {
            //         var keycode = window.event ? e.keyCode : e.which;
            //         if (keycode == 13) {
            //             $scope.register();
            //         }
            //     };
            // };




            // $scope.checkReceiveIdentity = function () {
            //     if (!$scope.data.receiveIdentity) {
            //         plugMessenger.error("客户标示不能为空");
            //         return;
            //     }
            // $scope.flag = '0'
            // receiptService.checkReceiveIdentity($scope.data).then(function (result) {
            //     if (result.data.code == '999') {
            //         document.getElementById("receiveIdentity").focus()
            //         plugMessenger.error(result.data.msg);
            //         return;
            //     }
            //     if (result.data.code == '000') {
            //         $scope.data.customerNumber = result.data.data[0].customerNumber
            //         console.log($scope.data.tempCustomerNumber);
            //     }
            // })
            // }


            // $scope.checkCustomerNumber = function () {
            //     if (!$scope.data.customerNumber) {
            //         plugMessenger.error("客户编号不能为空");
            //         // $scope.customerNumberFocus = true;
            //         $window.document.getElementById("customerNumber").focus();  
            //         return;
            //     }
            //     if ($scope.data.tempCustomerNumber != $scope.data.customerNumber) {
            //         plugMessenger.error("客户标识和客户编号对应，请重新输入");
            //         $scope.data.customerNumber = "";
            //         $window.document.getElementById("customerNumber").focus();  
            //         // $scope.customerNumberFocus = true;
            //         return;
            //     }
            // }

            $scope.checkInboundPackage = function () {
                receiptService.checkInboundPackage($scope.data).then(function (result) {
                    $scope.flag = '0'
                    if (result.data.code == '999') {
                        plugMessenger.error(result.data.msg);
                        return;
                    }
                    if (result.data.code == '000') {
                        if ($scope.data.customerNumber) {
                            $scope.flag = '1'
                        }
                    }
                })
            }

            $scope.inboundpackage = function () {
                warehouseService.inboundpackage($scope.data).then(function (result) {
                    if (result.status == 200) {
                        $scope.btnSave($scope.data.trackingNumber);
                    }
                })
            }

            $scope.btnSave = function (trackingNumber) {
                var _callback = function (result) {
                    if (!result.message) {
                        $scope.$broadcast("print-inboundPackage.action", trackingNumber);

                        // $scope.$broadcast("print-helper.action", "receipt-tag-inbound-tag", { receiptNumber: trackingNumber, number: 1 });
                        $scope.data = null;
                    } else {
                        plugMessenger.success("货物预报成功，入库失败，请到收货仓库入库");
                    }
                }
                receiptService.saveForOnline($scope.data, _callback);
            }

            $scope.register = function () {
                if ($scope.tpl_status.isExist) {
                    $scope.updateSave();
                } else {
                    $scope.btnSaveAndPrint();
                }
            }

            $scope.btnSaveAndPrint = function () {
                $scope.data.isUnusual = 0;
                $("input[name='pro']:checked").each(function (index, e) {
                    $scope.isStaffFlag = $(this).attr("value");
                });
                if ($scope.isStaffFlag == 'true') {
                    $scope.data.isUnusual = 1;
                }
                if (!$scope.data.receiveIdentity ||
                    !$scope.data.customerNumber ||
                    !$scope.data.trackingNumber ||
                    !$scope.data.warehouseNumber ||
                    !$scope.data.packageWeight
                ) {
                    plugMessenger.error("请填写所有必填项");
                    return;
                } else {
                    $scope.data.weight = $scope.data.packageWeight
                    $scope.data.receiptNumber = $scope.data.trackingNumber
                    $scope.inboundpackage()
                }
            }
            // $scope.btnPrint = function (item) {
            //     $scope.$broadcast("print-helper.action", "receipt-tag-check-tag", { receiptNumber: item });
            // }

            $scope.btnPrev = function () {
                $location.path('/warehouse/receipt2')
            }
            $scope.print = function () {
                console
                $scope.$broadcast("print-inboundPackage.action", $scope.data.trackingNumber);
            }

            $scope.updateSave = function (item) {
                if (!$scope.data.packageWeight) {
                    plugMessenger.error("必须填写重量");
                    return;
                }
                $scope.data.isUnusual = 0;
                $("input[name='pro']:checked").each(function (index, e) {
                    $scope.isStaffFlag = $(this).attr("value");
                });
                if ($scope.isStaffFlag == 'true') {
                    $scope.data.isUnusual = 1;
                }
                var _callback = function (result) {
                    if (!result.message) {
                        plugMessenger.success("操作成功");
                        $scope.$broadcast("print-inboundPackage.action", $scope.data.trackingNumber);
                        $scope.data = null;
                        // if (item) {
                        // } else {
                        //     // $scope.data = null;
                        // }
                    }
                }
                $scope.options = {
                    "receiptNumber": $scope.data.trackingNumber,
                    "customerNumber": $scope.data.customerNumber,
                    "isUnusual": $scope.data.isUnusual,
                    "weight": $scope.data.packageWeight,
                    "warehouseNote": $scope.data.warehouseNote
                }
                console.log($scope.options);

                // return;
                receiptService.saveForOnline($scope.options, _callback);
            }

            $scope.btnException = function () {
                $location.search({ "receiptNumber": $scope.data.trackingNumber });
                $location.path("warehouse/receiptexceptionedit");
            }
        }
    ]);