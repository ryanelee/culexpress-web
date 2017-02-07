'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ReceiptEdit2Ctrl
 * @description
 * # ReceiptEdit2Ctrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('ReceiptEdit2Ctrl', ['$scope', '$location', '$window', 'receiptService', 'plugMessenger', '$timeout',
        function ($scope, $location, $window, receiptService, plugMessenger, $timeout) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.data = null;

            $scope.tempReceiptNumber = $location.search().receiptNumber || "";
            console.log($scope.tempReceiptNumber);
            var _timeout = null;
            $scope.checkReceiptNumber = function () {
                if (!!_timeout) clearTimeout(_timeout);
                _timeout = setTimeout(function () {
                    $scope.$apply(function () {
                        if (!!$scope.tempReceiptNumber) {
                            receiptService.getDetail($scope.tempReceiptNumber, function (result) {
                                $scope.data = null;
                                console.log(result);


                                if (!result.message) {
                                    $scope.data = result;
                                }
                                if ($scope.data.sendType == '2') {
                                    if ($scope.data.packageWeight) {
                                    $scope.data.items[0].weight = $scope.data.packageWeight
                                    }

                                }
                                $scope.tempReceiptNumber = "";
                            });
                        } else {
                            $scope.tempReceiptNumber = "";
                        }
                    })
                }, 1000);
            }

            $scope.checkReceiptNumber();

            $scope.btnSave = function () {
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
                        $scope.data = null;
                    }
                }

                console.log($scope.data.customerNumber);
                // return;
                switch ($scope.data.sendType) {
                    case 1: //寄送库存
                        receiptService.saveForOffline({
                            "receiptNumber": $scope.data.receiptNumber,
                            "customerNumber": $scope.data.customerNumber
                        }, _callback);
                        break;
                    case 2: //海淘包裹
                        receiptService.saveForOnline({
                            "receiptNumber": $scope.data.receiptNumber,
                            "customerNumber": $scope.data.customerNumber,
                            "isUnusual": $scope.data.isUnusual,
                            "weight": $scope.data.items[0].weight
                        }, _callback);
                        break;
                }
            }

            $scope.btnException = function () {
                $location.search({ "receiptNumber": $scope.data.receiptNumber });
                $location.path("warehouse/receiptexceptionedit");
            }

            $scope.btnPrev = function () {
                $window.history.back();
            }

            $('#tip_receiptNumber').popover({
                container: 'body',
                placement: 'top',
                html: true,
                trigger: 'hover',
                title: '',
                content: "请扫描收货单据编号。<br/>海淘包裹请扫描包裹上面的快递跟踪编号，<br/>比如UPS是1z开头的14-18位条码。<br/>VIP客户寄送库存单据请扫描ASN开头的条码。"
            });

            $scope.btnOpenDetail = function (item, type) {
                switch (type) {
                    case "customerdetail":
                        $location.search({ customerNumber: item.customerNumber });
                        $location.path("/customer/customerdetail");
                        break;
                }
            }

            $scope.btnPrint = function (item) {
                switch ($scope.data.sendType) {
                    case 1: //寄送库存
                        $scope.$broadcast("print-helper.action", "receipt-tag-check-tag", { receiptNumber: item.receiptNumber });
                        break;
                    case 2: //海淘包裹
                        console.log("海淘包裹" + item.receiptNumber);

                        // $scope.$broadcast("print-helper.action", "receipt-tag-inbound-tag", { receiptNumber: item.receiptNumber, number: 1 });
                        // $scope.$broadcast("print-inboundPackage.action", trackingNumber);
                        $scope.$broadcast("print-inboundPackage.action", item.receiptNumber);

                        break;
                }
            }

            $scope.btnNoASN = function () {
                $location.path("/warehouse/receiptNoASN");
            }
        }
    ]);