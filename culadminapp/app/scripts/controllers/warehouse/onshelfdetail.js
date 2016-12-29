'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseOnShelfDetailCtrl
 * @description
 * # WarehouseOnShelfDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseOnShelfDetailCtrl', ['$scope', '$location', '$window', 'shelfService', 'inventoryService', 'plugMessenger', '$timeout',
        function($scope, $location, $window, shelfService, inventoryService, plugMessenger, $timeout) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.data = null;
            $scope.receiptNumber = null;
            $scope.tempItemNumber = $location.search().itemNumber || $location.search().receiptNumber || "";
            $scope.isUnusual = $location.search().isUnusual;
            console.log("is" + $scope.isUnusual);


            $scope.isExpecial = function() {
                if ($scope.isUnusual == 1) {
                    var staffFlag = $scope.data.shelfNumber.substring(0, 1);
                    console.log(staffFlag);
                    if (staffFlag != 'C') {
                        $scope.data.shelfNumber = "";
                        plugMessenger.error("员工包裹必须以C开头");
                    }
                }
            }




            var _timeout = null;
            $scope.checkItemNumber = function() {
                if (!!_timeout) clearTimeout(_timeout);
                _timeout = setTimeout(function() {
                    $scope.$apply(function() {
                        if ($scope.tempItemNumber == $location.search().receiptNumber) {
                            inventoryService.getInfoByReceiptNumber($scope.tempItemNumber, function(result) {
                                $scope.data = null;
                                console.log(result);

                                if (!result.message) {
                                    $scope.data = result;
                                    $scope.receiptNumber = $location.search().receiptNumber;
                                    $scope._itemType = $scope.data.itemNumber.substr(0, 2);
                                    $scope.data.itemCount = $scope._itemType == "S1" ? 1 : "";

                                    $timeout(function() {
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

                            return;
                        }

                        if (!!$scope.tempItemNumber) {
                            inventoryService.getInfo($scope.tempItemNumber, function(result) {
                                $scope.data = null;
                                if (!result.message) {
                                    $scope.data = result;
                                    $scope._itemType = $scope.data.itemNumber.substr(0, 2);
                                    $scope.data.itemCount = $scope._itemType == "S1" ? 1 : "";

                                    $timeout(function() {
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
                        } else {
                            $scope.tempItemNumber = "";
                        }
                    })
                }, 1000);
            }

            $scope.checkItemNumber();

            $scope.btnSave = function(type) {
                //if (!$scope.data.inventory_frozen) {
                //    plugMessenger.info("请填写正确的数量");
                //    return;
                //}
                var data = {
                    itemNumber: $scope.data.itemNumber,
                    shelfNumber: $scope.data.shelfNumber,
                    receiptNumber: $scope.receiptNumber,
                    itemCount: $scope.data.itemCount
                }
                if ($scope._itemType == "S2") {
                    data.receiptNumber = $scope.data.receiptNumber;
                }
                shelfService.onshelfForInbound(data, function(result) {
                    if (result.success) {
                        plugMessenger.success("操作成功");
                        $scope.data = null;
                    }
                });
            }

            $scope.btnPrev = function() {
                $window.history.back();
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