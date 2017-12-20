'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseOnShelfDetailBatchCtrl
 * @description
 * # WarehouseOnShelfDetailBatchCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseOnShelfDetailBatchCtrl', ['$scope', '$location', '$window', 'shelfService', 'inventoryService', 'plugMessenger', '$timeout',
        function ($scope, $location, $window, shelfService, inventoryService, plugMessenger, $timeout) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.data = null;
            $scope.receiptNumber = null;
            // $scope.tempReceiptNumber = $scope.tempItemNumber = $location.search().itemNumber || $location.search().receiptNumber || "";
            // $scope.isUnusual = $location.search().isUnusual;
            $scope.isModifyShelf = false;
            $scope.originShelfNumber = null;
            $scope.shelfInput = true;
            $scope.tempShelfNumber = "";
            $scope.tempItemNumber = ""

            // 校验架位
            $scope.isExpecial = function () {
                if ($scope.isUnusual == 1) {
                    var staffFlag = $scope.data.shelfNumber.substring(0, 1);
                    //console.log(staffFlag);
                    if (staffFlag != 'D') {
                        $scope.data.shelfNumber = "";
                        plugMessenger.error("员工包裹必须以D开头");
                        return false;
                    }
                }
                if ($scope.isUnusual == 2) {
                    var staffFlag = $scope.data.shelfNumber.substring(0, 1);
                    //console.log(staffFlag);
                    if (staffFlag != 'C') {
                        $scope.data.shelfNumber = "";
                        plugMessenger.error("异常包裹必须以C开头");
                        return false;
                    }
                }

                return true;
            }

            // 录入架位编号并enter
            $scope.keydownShelfNumber = function (event) {
                debugger;
                if (!!$scope.tempShelfNumber) {
                    $scope.shelfInput = false;
                    $("#tempItemNumber").focus();
                }
                // switch (event.keyCode) {
                //     case 13:  //enter
                //         $scope.checkItemNumber();
                //         break;
                // }
            }

            // 录入入库单号并enter
            $scope.keydownReceiptNumber = function (event) {
                switch (event.keyCode) {
                    case 13:  //enter
                        $scope.checkItemNumber();
                        break;
                }
            }

            // 入库单号enter直接提交
            $scope.keydownBtnSave = function (event) {
                switch (event.keyCode) {
                    case 13:  //enter
                        $scope.btnSave();
                        break;
                }
            }

            $scope.checkItemNumber = function () {
                $scope.isModifyShelf = false;
                if ($scope.tempItemNumber == $location.search().receiptNumber) {
                    inventoryService.getInfoByReceiptNumber($scope.tempItemNumber, function (result) {
                        $scope.data = null;
                        console.log("23", result);

                        if (!result.message) {
                            $scope.data = result;
                            $scope.receiptNumber = $location.search().receiptNumber;
                            $scope._itemType = $scope.data.itemNumber.substr(0, 2);
                            $scope.data.itemCount = $scope._itemType == "S1" ? 1 : "";
                        }

                        $scope.tempItemNumber = "";
                        // $("#shelfNumber").focus();
                    });
                    return;
                }

                if (!!$scope.tempItemNumber) {
                    $scope.receiptNumber = $scope.tempItemNumber;
                    $scope.tempReceiptNumber = $scope.tempItemNumber
                    inventoryService.getInfoByReceiptNumber($scope.tempItemNumber, function (result) {
                        $scope.data = null;

                        if (!result.message) {
                            $scope.data = result;

                            $scope._itemType = $scope.data.itemNumber.substr(0, 2);
                            $scope.data.itemCount = $scope._itemType == "S1" ? 1 : "";
                            //display shelf # if have been on shelf.
                            if (result && result.inventoryList && result.inventoryList.length > 0 && result.inventoryList[0].shelfNumber && $scope._itemType == "S1") {
                                $scope.data.shelfNumber = result.inventoryList[0].shelfNumber;
                                $scope.isModifyShelf = true;
                                $scope.originShelfNumber = result.inventoryList[0].shelfNumber;
                            }
                        }
                        $scope.tempItemNumber = "";
                    });

                    // $("#shelfNumber").focus();
                    return;
                } else {
                    $scope.tempItemNumber = "";
                }
            }

            // $scope.checkItemNumber();

            $scope.btnSave = function (type) {
                if (!$scope.data.shelfNumber) {
                    plugMessenger.error("架位号不能为空");
                    return;
                }

                if ($scope.isExpecial() == false)
                    return;
                // 修改架位
                if ($scope.isModifyShelf) {
                    if ($scope.originShelfNumber == $scope.data.shelfNumber) {
                        return;
                    }

                    var modifyData = {
                        itemNumber: $scope.data.itemNumber,
                        originShelfNumber: $scope.originShelfNumber,
                        targetShelfNumber: $scope.data.shelfNumber,
                        moveItemCount: $scope.data.itemCount
                    }

                    shelfService.onshelfForMove(modifyData, function (result) {
                        if (result.success) {
                            plugMessenger.success("修改架位成功");
                            $scope.data = null;
                            $scope.isModifyShelf = false;
                            $scope.originShelfNumber = null;

                            $timeout(function () {
                                $window.document.getElementById('tempItemNumber').focus();
                            }, 1000);
                        } else {
                            $window.document.getElementById('shelfNumber').select();
                            $window.document.getElementById('shelfNumber').focus();
                        }
                    });

                    return;
                }

                var data = {
                    itemNumber: $scope.data.itemNumber,
                    customerNumber: $scope.data.customerNumber,
                    receiveIdentity: $scope.data.receiveIdentity,
                    weight: $scope.data.weight,
                    shelfNumber: $scope.data.shelfNumber,
                    receiptNumber: $scope.receiptNumber,
                    itemCount: $scope.data.itemCount,
                    emailAddress: $scope.data.emailAddress
                }

                 //  商品上架
                shelfService.onshelfForInbound(data, function (result) {
                    if (result.success) {
                        // $("#myAlert").alert();
                        plugMessenger.success("上架成功");
                        $scope.data = null;
                        $timeout(function () {
                            $window.document.getElementById('tempItemNumber').focus();
                        }, 1000);
                    } else {
                        // 上架失败则停留在录入单号界面，并将错误信息反馈给操作员，操作员点击确认后进入架位录入页面。
                        plugMessenger.confirm("单号【 " + data.itemNumber + " 】上架失败，是否继续批量上架？", function (isOK) {
                            if (isOK) {
                                $window.document.getElementById('tempShelfNumber').focus();
                            } else {
                                $window.document.getElementById('tempItemNumber').focus();
                            }
                        });
                    }
                });

            }

            $scope.btnPrev = function () {
                $window.sessionStorage.setItem("historyFlag", 1); $window.history.back();
            }

            $('#tip_itemNumber').popover({
                container: 'body',
                placement: 'top',
                html: true,
                trigger: 'hover',
                title: '',
                content: "请扫描商品编号<br/>S1开头为海淘包裹<br/>S2开头为VIP客户寄送库存商品"
            });
        }
    ]);