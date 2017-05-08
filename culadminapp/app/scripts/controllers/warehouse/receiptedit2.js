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
        function($scope, $location, $window, receiptService, plugMessenger, $timeout) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.data = null;


            $scope.checkReceiveIdentity = function(e) {
                //console.log('2345')
                    // $scope.myKeyup = function (e) {
                //console.log(2)
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    //console.log('2345')
                    if (!$scope.data.receiveIdentity) {
                        plugMessenger.error("客户标示不能为空");
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
                            packageDescription.focus()
                            $scope.data.customerNumber = result.data.data[0].customerNumber
                            //console.log($scope.data.tempCustomerNumber);
                        }
                    })
                }
                // };
            };



            $scope.myKeyup = function(e, item) {
                //console.log(item);

                $scope.myKeyup = function(e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    if (keycode == 13) {
                        $scope.btnSave(item);
                    }
                };

                // console.log('2323')
                // var keycode = window.event ? e.keyCode : e.which;
                // if (keycode == 13) {
                //     $scope.myClass = 'green';
                //     $scope.myClick();
                // }
            };
            // $scope.myClick = function () {
            //     $scope.isClick = 'Yes!';
            // };




            $scope.$on('$viewContentLoaded', function() {
                // var element = $window.document.getElementById('weight');
                // if (element)
                //     element.focus();
                //  var weight = document.getElementById("weight").focus();

                //     var weight = document.getElementById("weight");
                //     weight.focus();
            });


            $scope.tempReceiptNumber = $location.search().receiptNumber || "";
            $scope.tempInboundStatus = $location.search().inboundStatus || 1;
            //console.log($scope.tempReceiptNumber);
            //console.log($scope.tempInboundStatus);

            $scope.tempReceipt = $scope.tempReceiptNumber.substring(0, 3);
            //console.log($scope.tempReceipt)

            if ($scope.tempReceiptNumber) {
                if ($scope.tempReceipt == 'ASN') {
                    $scope.checkReceiptNumber();
                } else {
                    $location.search({ "trackingNumber": $scope.tempReceiptNumber, "inboundStatus": $scope.tempInboundStatus });
                    $location.path("/warehouse/receiptNoASN");
                }

            }

            var _timeout = null;


            $scope.checkReceiptNumber = function(e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.tempInboundStatus = -1;
                    if ($scope.tempReceiptNumber && $scope.tempReceipt != 'ASN') {
                        $location.search({ "trackingNumber": $scope.tempReceiptNumber, "inboundStatus": $scope.tempInboundStatus });
                        $location.path("/warehouse/receiptNoASN");
                        return;
                    }
                    if (!!_timeout) clearTimeout(_timeout);
                    _timeout = setTimeout(function() {
                        $scope.$apply(function() {
                            if (!!$scope.tempReceiptNumber) {
                                receiptService.getDetail($scope.tempReceiptNumber, function(result) {
                                    //console.log(result);
                                    $scope.data = null;
                                    if (!result.message) {
                                        $scope.data = result;
                                    }
                                    if ($scope.data.sendType == '2', $scope.data.isTransfer == '1') {
                                        if ($scope.data.packageWeight) {
                                            $scope.data.items[0].weight = $scope.data.packageWeight
                                        }

                                    }
                                    var element = $window.document.getElementById('weight');
                                    if (element)
                                        element.focus();
                                    $scope.tempReceiptNumber = "";
                                });
                            } else {
                                $scope.tempReceiptNumber = "";
                            }
                        })
                    }, 1000);
                }

            }

            $scope.checkReceiptNumber2 = function() {
                $scope.tempInboundStatus = -1;
                if ($scope.tempReceiptNumber && $scope.tempReceipt != 'ASN') {
                    $location.search({ "trackingNumber": $scope.tempReceiptNumber, "inboundStatus": $scope.tempInboundStatus });
                    $location.path("/warehouse/receiptNoASN");
                    return;
                }
                if (!!_timeout) clearTimeout(_timeout);
                _timeout = setTimeout(function() {
                    $scope.$apply(function() {
                        if (!!$scope.tempReceiptNumber) {
                            receiptService.getDetail($scope.tempReceiptNumber, function(result) {
                                //console.log(result);
                                $scope.data = null;
                                if (!result.message) {
                                    $scope.data = result;
                                }
                                if ($scope.data.sendType == '2', $scope.data.isTransfer == '1') {
                                    if ($scope.data.packageWeight) {
                                        $scope.data.items[0].weight = $scope.data.packageWeight
                                    }

                                }
                                var element = $window.document.getElementById('weight');
                                if (element)
                                    element.focus();
                                $scope.tempReceiptNumber = "";
                            });
                        } else {
                            $scope.tempReceiptNumber = "";
                        }
                    })
                }, 1000);
            }



            $scope.btnSave = function(item) {
                $scope.data.isUnusual = 0;
                $("input[name='pro']:checked").each(function(index, e) {
                    $scope.isStaffFlag = $(this).attr("value");
                });
                if ($scope.isStaffFlag == 'true') {
                    $scope.data.isUnusual = 1;
                }
                var _callback = function(result) {
                        if (!result.message) {
                            plugMessenger.success("操作成功");
                            if (item) {
                                $scope.btnPrint(item)
                            } else {
                                $scope.data = null;
                            }


                        }
                    }
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

            $scope.btnException = function() {
                $location.search({ "receiptNumber": $scope.data.receiptNumber });
                $location.path("warehouse/receiptexceptionedit");
            }

            $scope.btnPrev = function() {
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

            $scope.btnOpenDetail = function(item, type) {
                switch (type) {
                    case "customerdetail":
                        $location.search({ customerNumber: item.customerNumber });
                        $location.path("/customer/customerdetail");
                        break;
                }
            }

            $scope.btnPrint = function(item) {
                //console.log(item);
                switch ($scope.data.sendType) {
                    case 1: //寄送库存
                        $scope.$broadcast("print-helper.action", "receipt-tag-check-tag", { receiptNumber: item.receiptNumber });
                        $scope.data = null;
                        break;
                    case 2: //海淘包裹
                        // $scope.$broadcast("print-helper.action", "receipt-tag-inbound-tag", { receiptNumber: item.receiptNumber, number: 1 });
                        // $scope.$broadcast("print-inboundPackage.action", trackingNumber);
                        $scope.$broadcast("print-inboundPackage.action", item.receiptNumber);
                        $scope.data = null;
                        break;
                }
            }

            $scope.btnNoASN = function() {
                $location.path("/warehouse/receiptNoASN");
            }
        }
    ]);