'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseInventoryFrozenCtrl
 * @description
 * # WarehouseInventoryFrozenCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseInventoryFrozenCtrl', ['$scope', '$location', '$window', 'inventoryService', 'plugMessenger',
        function($scope, $location, $window, inventoryService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.data = null;

            $scope.tempItemNumber = $location.search().itemNumber || "";

            $scope.tpl_status = {
                btnRelieve: true
            }

            var _timeout = null;
            $scope.checkItemNumber = function() {
                if (!!_timeout) clearTimeout(_timeout);
                _timeout = setTimeout(function() {
                    $scope.$apply(function() {
                        if (!!$scope.tempItemNumber) {
                            inventoryService.getDetail($scope.tempItemNumber, function(result) {
                                $scope.tpl_status.btnRelieve = true;
                                if (result.length > 0) {
                                    $scope.data = {
                                        itemNumber: result[0].itemNumber,
                                        warehouseNumber: result[0].warehouseNumber,
                                        inventory_frozen: result[0].inventory_frozen,
                                        inventory: result[0].inventory,
                                        reason: result[0].frozenReason || ""
                                    }
                                    $scope.inventory = result[0].inventory;
                                    if (result[0].inventory_frozen == 0) {
                                        $scope.data.reason = "";
                                        $scope.tpl_status.btnRelieve = false;
                                    }
                                }
                                $scope.tempItemNumber = "";
                            });
                        } else {
                            $scope.tempItemNumber = "";
                        }
                    })
                }, 1000);
            }

            //   incrementInventory_frozen

            $scope.checkItemNumber();

            $scope.btnSave = function(type) {
                //console.log($scope.data.inventory_frozen);
                //console.log($scope.inventory);
                //console.log($scope.data.incrementInventory_frozen);
                // return;
                //console.log(Number($scope.data.incrementInventory_frozen) + Number($scope.data.inventory_frozen));
                if ((Number($scope.data.incrementInventory_frozen) + Number($scope.data.inventory_frozen)) > Number($scope.inventory)) {
                    plugMessenger.info("冻结库存超过库存,请重新填写");
                    return;
                }
                if (Number($scope.data.incrementInventory_frozen) + Number($scope.data.inventory_frozen) < 0) {
                    plugMessenger.info("解冻库存超过冻结的，不允许解冻");
                    return;
                }

                if (type == 4 && !$scope.data.incrementInventory_frozen) {
                    plugMessenger.info("请填写正确的数量");
                    return;
                }
                var data = angular.copy($scope.data);
                data.type = type;
                $scope.data.inventory_frozen = undefined;
                inventoryService.frozen(data, function(result) {
                    if (result.success) {
                        plugMessenger.success("操作成功");
                        $scope.btnPrev();
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