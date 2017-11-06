'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseInventoryAdjustCtrl
 * @description
 * # WarehouseInventoryAdjustCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseInventoryAdjustWeightCtrl', ['$scope', '$location', '$window', 'inventoryService', 'plugMessenger','warehouseService',"receiptService",
        function ($scope, $location, $window, inventoryService, plugMessenger,warehouseService,receiptService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.data = null;

            $scope.tempItemNumber = $location.search().itemNumber || "";
            $scope.packageWeight = $location.search().packageWeight || 0;
            $scope.data = {
                trackingNumber:  $scope.tempItemNumber,
                packageWeight: $scope.packageWeight,
                reason: ""
            }
            $scope.keyDown = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.checkItemNumber();
                }
            }

            $scope.checkItemNumber = function () {
                if (!!$scope.tempItemNumber) {
                    console.log('2345')
                    receiptService.getInboundPackage($scope.tempItemNumber, function (result) {
                        console.log("result",result)
                        if (result) {
                            $scope.data = {
                                trackingNumber:  $scope.tempItemNumber,
                                packageWeight: result.packageWeight,
                                reason: ""
                            }
                        }
                        $scope.tempItemNumber = "";
                    });
                } else {
                    $scope.tempItemNumber = "";
                }
            }

            $scope.checkItemNumber();

            $scope.btnSave = function (type) {
                    console.log($scope.data);
                if (!$scope.data.packageWeight) {
                    plugMessenger.info("请填写正确的数量");
                    return;
                }
                // trackingNumber
                warehouseService.updateInboundpackageWeight($scope.data, function (result) {
                    if (result.success) {
                        plugMessenger.success("操作成功");
                        $scope.btnPrev();
                    }
                    
                });
            }

            $scope.btnPrev = function () {
                $window.sessionStorage.setItem("historyFlag", 1);                 $window.history.back();
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
