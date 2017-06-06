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
        function($scope, $location, $window, receiptService, warehouseService, plugMessenger, $timeout) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.data = {};
            $scope.warehouseList = [];
            $scope.flag = '0';
            $scope.customerNumberFocus = false;

            $scope.myKeyup_1 = function(e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.getPackageDetail();
                }
            };
            $scope.isUnusual = $location.search().isUnusual;

            $scope.data = {
                trackingNumber: angular.copy($location.search().trackingNumber || ""),
                inboundStatus: angular.copy($location.search().inboundStatus || ""),
            }


            // if ($scope.data.inboundStatus <= 1) {
            //     $window.document.getElementById("txtTrackingNumber").focus();
            // }

            $scope._trackingNumber = "";

            $scope.tpl_status = {
                warehouseList: [],
                isExist: false
            }

            $scope.getPackageDetail = function() {
                if (!!$scope.data.trackingNumber && $scope._trackingNumber != $scope.data.trackingNumber) {
                    warehouseService.getInboundPackageDetail($scope.data.trackingNumber, function(result) {
                        if (result == null) {
                            // trackingNumber.focus();
                            warehouseNumber.focus();
                            //新增
                            //console.log('1234567ui')
                            var _newNumber = angular.copy($scope.data.trackingNumber); 
                            $scope.data = { trackingNumber: _newNumber }
                            $scope.data.warehouseNumber = $scope.warehouseList[0].key || '1';
                            $scope._trackingNumber = "";
                            $scope.tpl_status.isExist = false;
                            $scope.data.inboundStatus = angular.copy($location.search().inboundStatus || "");
                            // $window.document.getElementById("txtTrackingNumber").focus();

                        } else {
                            //修改
                            // console.log("feichang" + JSON.stringify(result));
                            //console.log(result);
                            $scope.data = result;
                            $scope.data.inboundStatus = angular.copy($location.search().inboundStatus || "");
                            $scope._trackingNumber = angular.copy($scope.data.trackingNumber);
                            $scope.tpl_status.isExist = true;
                            $scope.tpl_status.isExist_p = true;
                            // console.log('2345');
                            //console.log($scope.data.packageWeight);
                            if ($scope.data.trackingNumber && $scope.data.inboundStatus < 3) {
                                // $window.document.getElementById("packageWeight").focus();
                                packageWeight.focus();
                                $scope.tpl_status.isExist_p = false;

                            }
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

            warehouseService.getWarehouse(function(result) {
                $scope.tpl_status.warehouseList = result;
            });

            warehouseService.getWarehouse(function(result) {
                for (var i = 0; i < result.length; i++) {
                    var detail = {}
                    $scope.data.warehouseNumber = result[0].warehouseNumber
                    detail['key'] = result[i].warehouseNumber
                    detail['value'] = result[i].warehouseName;
                    $scope.warehouseList.push(detail);

                    $scope.getPackageDetail();

                }
            });

            $scope.getReceiveIdentity = function(){
               if($scope.data.receiveIdentity == undefined || $scope.data.receiveIdentity.trim() == ''){
                   plugMessenger.error("客户标识不能为空");
                   document.getElementById("receiveIdentity").focus()
                   return false;
               }

               $scope.flag = '0'
                    receiptService.checkReceiveIdentity($scope.data).then(function(result) {
                        if (result.data.code == '999') {
                            document.getElementById("receiveIdentity").focus()
                            plugMessenger.error(result.data.msg);
                            return false;
                        }
                        if (result.data.code == '000') {
                            $scope.data.tempCustomerNumber = result.data.data[0].customerNumber;
                            return true;
                        }
                    })     
            }

            $scope.checkReceiveIdentity = function(e) {
                //console.log('2345')
                // $scope.myKeyup = function (e) {
                //console.log(2)
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    //console.log('2345')
                    if (!$scope.data.receiveIdentity) {
                        // plugMessenger.error("客户标示不能为空");
                        return;
                    }
                    $scope.flag = '0'
                    receiptService.checkReceiveIdentity($scope.data).then(function(result) {
                        if (result.data.code == '999') {
                            document.getElementById("receiveIdentity").focus()
                            plugMessenger.error(result.data.msg);
                            return;
                        }
                        if (result.data.code == '000') {
                            customerNumber.focus()
                            $scope.data.tempCustomerNumber = result.data.data[0].customerNumber
                                //console.log($scope.data.tempCustomerNumber);
                        }
                    })
                }
                // };
            };


            $scope.myKeyup = function(e) {
                // $scope.myKeyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.register();
                }
                // };
            };




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
            $scope.checkReceive = function(e) {

                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    if (!$scope.data.customerNumber) {
                        plugMessenger.error("客户编号不能为空");
                        $scope.customerNumberFocus = true;
                        // $window.document.getElementById("customerNumber").focus();
                        return;
                    } else if ($scope.data.tempCustomerNumber != $scope.data.customerNumber) {
                        plugMessenger.error("客户标示和客户编号不匹配，请重新输入");
                        $scope.data.customerNumber = "";
                        $window.document.getElementById("customerNumber").focus();
                        // $scope.customerNumberFocus = true;
                        return;
                    } else {
                        packageDescription.focus();
                    }
                }
            }


            $scope.checkCustomerNumber = function(e) {
                //console.log(e);
                if (!$scope.data.customerNumber) {
                    plugMessenger.error("客户编号不能为空");
                    //$scope.customerNumberFocus = true;
                    $window.document.getElementById("customerNumber").focus();
                    return false;
                } else if ($scope.data.tempCustomerNumber != $scope.data.customerNumber) {
                    plugMessenger.error("客户标示和客户编号不匹配，请重新输入");
                    $scope.data.customerNumber = "";

                    $window.document.getElementById("customerNumber").focus();
                    //$scope.customerNumberFocus = true;
                    return false;
                } else {
                    // $scope.changekey();
                    return true;
                }
            }



            $scope.checkInboundPackage = function() {
                receiptService.checkInboundPackage($scope.data).then(function(result) {
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

            $scope.inboundpackage = function() {
                warehouseService.inboundpackage($scope.data).then(function(result) {
                    if (result.status == 200) {
                        $scope.btnSave($scope.data.trackingNumber);
                    }
                })
            }

            $scope.btnSave = function(trackingNumber) {
                var _callback = function(result) {
                    if (!result.message) {
                        $scope.$broadcast("print-inboundPackage.action", trackingNumber);
                        // $location.path('/warehouse/receiptedit2');
                        // $scope.$broadcast("print-helper.action", "receipt-tag-inbound-tag", { receiptNumber: trackingNumber, number: 1 });
                        $scope.data = null;
                    } else {
                        plugMessenger.success("货物预报成功，入库失败，请到收货仓库入库");

                    }
                }
                receiptService.saveForOnline($scope.data, _callback);
            }

            $scope.register = function() {
                if ($scope.tpl_status.isExist) {
                    $scope.updateSave();
                } else {
                    if ($scope.getReceiveIdentity() == false)
                        return;
                    if ($scope.checkCustomerNumber() == false)
                        return;

                    $scope.btnSaveAndPrint();
                }
            }

            $scope.btnSaveAndPrint = function() {
                    if ($scope.isUnusual) {
                        $scope.data.isUnusual = $scope.isUnusual;
                    }
                    // $scope.data.isUnusual = 0;
                    // $("input[name='pro']:checked").each(function (index, e) {
                    //     $scope.isStaffFlag = $(this).attr("value");
                    // });
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

            $scope.btnPrev = function() {
                 $window.sessionStorage.setItem("historyFlag", 1);
                $location.path('/warehouse/receipt2')
            }
            $scope.print = function() {
                $scope.$broadcast("print-inboundPackage.action", $scope.data.trackingNumber);
            }

            $scope.updateSave = function(item) {
                if (!$scope.data.packageWeight) {
                    plugMessenger.error("必须填写重量");
                    return;
                }
                if ($scope.isUnusual) {
                    $scope.data.isUnusual = $scope.isUnusual;
                }
                // $scope.data.isUnusual = 0;
                // $("input[name='pro']:checked").each(function (index, e) {
                //     $scope.isStaffFlag = $(this).attr("value");
                // });
                // if ($scope.isStaffFlag == 'true') {
                //     $scope.data.isUnusual = 1;
                // }
                var _callback = function(result) {
                    if (!result.message) {
                        plugMessenger.success("操作成功");
                        $scope.$broadcast("print-inboundPackage.action", $scope.data.trackingNumber);
                        $scope.data = null;
                        var element = $window.document.getElementById('txtTrackingNumber');
                        if (element)
                            element.focus();
                        // $location.path('/warehouse/receiptedit2');
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
                    //console.log($scope.options);

                // return;
                receiptService.saveForOnline($scope.options, _callback);
            }

            $scope.btnException = function() {
                $location.search({ "receiptNumber": $scope.data.trackingNumber });
                $location.path("warehouse/receiptexceptionedit");
            }
        }
    ]);