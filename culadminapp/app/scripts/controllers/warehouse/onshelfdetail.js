﻿'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseOnShelfDetailCtrl
 * @description
 * # WarehouseOnShelfDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseOnShelfDetailCtrl', ['$scope', '$location', '$window', 'shelfService', 'inventoryService', 'plugMessenger', '$timeout',
        function ($scope, $location, $window, shelfService, inventoryService, plugMessenger, $timeout) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.data = null;
            $scope.receiptNumber = null;
            $scope.tempReceiptNumber = $scope.tempItemNumber = $location.search().itemNumber || $location.search().receiptNumber || "";
            $scope.isUnusual = $location.search().isUnusual;
            $scope.isModifyShelf = false;
            $scope.originShelfNumber = null;

            //console.log($scope.tempItemNumber) 

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

            $scope.hotKey = function (event) {
                switch (event.keyCode) {
                    case 13:  //enter
                        $scope.isExpecial();
                        break;
                }
            }

            $scope.keydownReceiptNumber = function (event) {
                switch (event.keyCode) {
                    case 13:  //enter
                        $scope.checkItemNumber();
                        break;
                }
            }
            $scope.keydownBtnSave = function (event) {
                switch (event.keyCode) {
                    case 13:  //enter
                        $scope.btnSave();
                        break;
                }
            }



            // var _timeout = null;
            $scope.checkItemNumber = function () {
                // if (!!_timeout) clearTimeout(_timeout);
                // _timeout = setTimeout(function() {
                //     $scope.$apply(function() {
                $scope.isModifyShelf = false;
                if ($scope.tempItemNumber == $location.search().receiptNumber) {
                    inventoryService.getInfoByReceiptNumber($scope.tempItemNumber, function (result) {
                        $scope.data = null;
                    
                        console.log("23",result);
                        if (!result.message) {
                            $scope.data = result;
                            $scope.receiptNumber = $location.search().receiptNumber;
                            $scope._itemType = $scope.data.itemNumber.substr(0, 2);
                            $scope.data.itemCount = $scope._itemType == "S1" ? 1 : "";
 
                            $timeout(function () {
                                $('#tip_ASNNumber').popover({
                                    container: 'body',
                                    placement: 'top',
                                    html: true,
                                    trigger: 'hover',
                                    title: '',
                                    content: "请扫描ASN开头寄送库存单据编号。"
                                });
                            });
                        }

                        $scope.tempItemNumber = "";
                        $("#shelfNumber").focus();
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

                            // $scope.receiptNumber = $location.search().receiptNumber;
                            $scope._itemType = $scope.data.itemNumber.substr(0, 2);
                            $scope.data.itemCount = $scope._itemType == "S1" ? 1 : "";
                            //display shelf # if have been on shelf.
                            if (result && result.inventoryList && result.inventoryList.length > 0 && result.inventoryList[0].shelfNumber && $scope._itemType == "S1") {
                                $scope.data.shelfNumber = result.inventoryList[0].shelfNumber;
                                $scope.isModifyShelf = true;
                                $scope.originShelfNumber = result.inventoryList[0].shelfNumber;
                            }

                            $timeout(function () {
                                $('#tip_ASNNumber').popover({
                                    container: 'body',
                                    placement: 'top',
                                    html: true,
                                    trigger: 'hover',
                                    title: '',
                                    content: "请扫描ASN开头寄送库存单据编号。"
                                });
                            });
                        }
                        $scope.tempItemNumber = "";
                    });

                    $("#shelfNumber").focus();
                    return;

                    // inventoryService.getInfo($scope.tempItemNumber, function (result) {
                    //     $scope.data = null;
                    //     if (!result.message) {
                    //         $scope.data = result;
                    //         $scope._itemType = $scope.data.itemNumber.substr(0, 2);
                    //         $scope.data.itemCount = $scope._itemType == "S1" ? 1 : "";

                    //         $timeout(function () {
                    //             $('#tip_ASNNumber').popover({
                    //                 container: 'body',
                    //                 placement: 'top',
                    //                 html: true,
                    //                 trigger: 'hover',
                    //                 title: '',
                    //                 content: "请扫描ASN开头寄送库存单据编号。"
                    //             });
                    //         });
                    //     }
                    //     $scope.tempItemNumber = "";
                    // });



                } else {
                    $scope.tempItemNumber = "";
                }
                // $window.document.getElementById("shelfNumber").focus();
                //     })
                // }, 1000);
            }

            $scope.checkItemNumber();

            $scope.btnSave = function (type) {
                if (!$scope.data.shelfNumber) {
                    plugMessenger.error("架位号不能为空");
                    return;
                }

                if ($scope.isExpecial() == false)
                    return;

                if ($scope.isModifyShelf) {
                    if($scope.originShelfNumber == $scope.data.shelfNumber){                        
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
                    emailAddress:$scope.data.emailAddress
                }
                if ($scope._itemType == "S2") {
                    data.receiptNumber = $scope.data.receiptNumber;
                }
 
                // return; 
                shelfService.onshelfForInbound(data, function (result) {
                    if (result.success) {
                        // $("#myAlert").alert();
                        plugMessenger.success("操作成功");
                        $scope.data = null;
                        //$window.sessionStorage.setItem("historyFlag", 1);                 $window.history.back();
                        // 上架成功后停留在上架登记界面继续上架操作
                        //  $location.path("/warehouse/onshelfdetail"); 

                        $timeout(function () {
                            $window.document.getElementById('tempItemNumber').focus();
                        }, 1000);
                    } else {
                        // plugMessenger.error("操作失败");
                        $window.document.getElementById('shelfNumber').select();
                        $window.document.getElementById('shelfNumber').focus();
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