'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ReceiptExceptionEditCtrl
 * @description
 * # ReceiptExceptionEditCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('ReceiptStaffCtrl', ['$scope', '$location', '$window', 'receiptService', 'warehouseService', 'plugMessenger', '$timeout',
        function ($scope, $location, $window, receiptService, warehouseService, plugMessenger, $timeout) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.data = null;

            $scope.tempReceiptNumber = $location.search().receiptNumber || "";
            $scope.staff = $location.search().staff;

            warehouseService.getWarehouse(function (result) {
                $scope.warehouseList = result;
            });


            $scope.checkReceiptNumber = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    receiptService.getDetail($scope.tempReceiptNumber, function (result) {
                        if (!result.message) {
                            $location.search({ "trackingNumber": $scope.tempReceiptNumber, "inboundStatus": $scope.tempInboundStatus, isUnusual: 1 });
                            $location.path("/warehouse/receiptNoASN");
                        }
                    })
                }
            }


            $scope.keyDown = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.checkReceiptNumber();
                }
            }

            $scope.checkReceiptNumber = function () {
                if (!!$scope.tempReceiptNumber) {
                    receiptService.getDetail($scope.tempReceiptNumber, function (result) {
                        $scope.data = null;
                        if (!result.message) {
                            $location.search({ "trackingNumber": $scope.tempReceiptNumber, "inboundStatus": $scope.tempInboundStatus, "isUnusual": 1 });
                            $location.path("/warehouse/receiptNoASN");

                            //     $scope.data = {
                            //         receiptNumber: result.receiptNumber,
                            //         sendType: result.sendType,
                            //         customerNumber: result.customerNumber,
                            //         warehouseNumber: result.warehouseNumber != null ? result.warehouseNumber : $scope.warehouseList[0].warehouseNumber
                            //     }
                            //     switch ($scope.data.sendType) {
                            //         case 1: //寄送包裹
                            //             $scope.data.type = "3";
                            //             break;
                            //         case 2: //海淘包裹
                            //             $scope.data.type = "1";
                            //             break;
                            //     }
                        }
                        $scope.tempReceiptNumber = "";
                    });
                } else {
                    $scope.tempReceiptNumber = "";
                }
            }

            $scope.checkReceiptNumber();

            $scope.btnSave = function () {
                receiptService.exceptionSave({
                    customerNumber: $scope.data.customerNumber,
                    receiptNumber: $scope.data.receiptNumber,
                    warehouseNumber: $scope.data.warehouseNumber,
                    type: $scope.data.type,
                    sendtype: $scope.data.sendType,
                    memo: $scope.data.memo
                }, function (result) {
                    plugMessenger.success("操作成功");
                    $scope.data.exceptionNumber = result.data[0].exceptionNumber
                    $scope.btnPrint();
                    // $scope.data = null;
                });
            }

            $scope.btnPrev = function () {
                $window.history.back();
            }

            //$scope.btnPrint = function () {
            //    switch ($scope.data.sendType) {
            //        case 1:   //寄送库存
            //            $scope.$broadcast("print-helper.action", "receipt-tag-exception-tag", { exceptionNumber: $scope.data.exceptionNumber });
            //            break;
            //        case 2:   //海淘包裹
            //            $scope.$broadcast("print-helper.action", "receipt-tag-exception-tag", { exceptionNumber: $scope.data.exceptionNumber });
            //            break;
            //    }
            //}


            $scope.btnPrint = function (item) {
                //console.log($scope.data.sendType);
                switch ($scope.data.sendType) {
                    case 1: //寄送库存
                        $scope.$broadcast("print-helper.action", "receipt-tag-exception-tag", { exceptionNumber: $scope.data.exceptionNumber });
                        break;
                    case 2: //海淘包裹
                        $scope.$broadcast("print-helper.action", "receipt-tag-exception-tag", { exceptionNumber: $scope.data.exceptionNumber });
                        break;
                }
            }


            $('#tip_receiptNumber_staff').popover({
                container: 'body',
                placement: 'top',
                html: true,
                trigger: 'hover',
                title: '',
                content: "请扫描收货单据编号。<br/>海淘包裹请扫描包裹上面的快递跟踪编号，<br/>比如UPS是1z开头的14-18位条码。<br/>VIP客户寄送库存单据请扫描ASN开头的条码。"
            });
        }
    ]);