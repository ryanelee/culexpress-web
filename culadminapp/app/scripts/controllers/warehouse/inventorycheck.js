'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseInventoryAdjustCtrl
 * @description
 * # WarehouseInventoryAdjustCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseInventoryCheckCtrl', ['$scope', '$location', '$window', 'inventoryService', 'plugMessenger',
        function ($scope, $location, $window, inventoryService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.data = null;

            $scope.tempTrackingNumber = $location.search().trackingNumber || "";

            $scope.checkTrackingNumber = function () {
                if (!!$scope.tempTrackingNumber) {
                    inventoryService.check({ trackingNumber: $scope.tempTrackingNumber }, function (result) {
                        console.log(":result", result);
                        // if (result.length > 0) {
                        //     $scope.data = {
                        //         itemNumber: result[0].itemNumber,
                        //         warehouseNumber: result[0].warehouseNumber,
                        //         // inventory: result[0].inventory,
                        //         inventory: 0,
                        //         weight: result[0].weight,
                        //         reason: ""
                        //     }
                        // }  





                        if (result.code == '000') {
                            $scope.data = result.data
                            if ($scope.data.sendType == 2) {
                                $scope.data._sendType = "海淘包裹"
                            }
                            if ($scope.data.sendType == 1) {
                                $scope.data._sendType = "寄送库存"
                            }
                            if ($scope.data.sendType == 2 && $scope.data.isUnusual == 1) {
                                $scope.data._sendType = "员工包裹"
                            }
                            if ($scope.data.sendType == 2 && $scope.data.isUnusual == 2) {
                                $scope.data._sendType = "异常包裹"
                            }

                            if ($scope.data.shelfNumber) {
                                $scope.shelfs = $scope.data.shelfNumber.split('-');
                                console.log("2323", $scope.data._sendType, "w23", $scope.data.sendType);
                                $scope.shelfs[0] = $scope.shelfs[0] + "-" + $scope.data._sendType;
                                console.log("::::=>", $scope.shelfs);
                            }
                        } else {
                            plugMessenger.error(result.msg);
                        }
                        $scope.tempItemNumber = "";
                    });
                } else {
                    $scope.tempTrackingNumber = "";
                }
            }

            $scope.keyDown = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.checkTrackingNumber();
                }
            }




            $scope.checkTrackingNumber();

            $scope.btnSave = function (type) {
                if (!$scope.data.inventory) {
                    plugMessenger.info("请填写正确的数量");
                    return;
                }
                inventoryService.adjust($scope.data, function (result) {
                    if (result.success) {
                        plugMessenger.success("操作成功");
                        $scope.btnPrev();
                    }
                });
            }

            $scope.btnPrint = function (item) {
                console.log(item)
                switch (item.sendType) {
                  case 1:   //寄送库存
                      $scope.$broadcast("print-helper.action", "receipt-tag-check-tag", { receiptNumber: item.receiptNumber });
                      break;
                  case 2:   //海淘包裹
                    //   $scope.$root.$broadcast("print-helper.action", "receipt-tag-inbound-tag", { receiptNumber: item.receiptNumber, number: 1 });
                    $scope.$broadcast("print-inboundPackage.action", item.receiptNumber);
                      break;
                }
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
        }]);
