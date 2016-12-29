'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseShelfManagementCreateCtrl
 * @description
 * # WarehouseShelfManagementCreateCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseShelfManagementCreateCtrl', ['$scope', '$location', '$window', 'warehouseService', 'shelfService', 'plugMessenger',
        function($scope, $location, $window, warehouseService, shelfService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.data = {
                area: "A",
                row: "01",
                layer: "1",
                position: "001"
            };

            $scope.shelfOptions = {
                area: [{
                    title: "A-海淘客户",
                    value: "A"
                }, {
                    title: "B-大客户",
                    value: "B"
                }, {
                    title: "C-异常客户",
                    value: "C"
                }, {
                    title: "D-员工客户",
                    value: "D"
                }, ],
                row: [],
                layer: [],
                position: []
            }
            for (var i = 1; i < 1000; i++) {
                if (i < 10) {
                    $scope.shelfOptions.layer.push({
                        title: i.toString(),
                        value: i.toString()
                    });
                }
                if (i < 100) {
                    var val = i.toString().length < 2 ? "0" + i.toString() : i.toString();
                    $scope.shelfOptions.row.push({
                        title: val,
                        value: val
                    });
                }
                if (i < 1000) {
                    var val = "";
                    if (i.toString().length == 1) {
                        val = "00" + i.toString();
                    } else if (i.toString().length == 2) {
                        val = "0" + i.toString();
                    } else {
                        val = i.toString();
                    }
                    $scope.shelfOptions.position.push({
                        title: val,
                        value: val
                    });
                }
            }

            $scope.warehouseList = [];
            warehouseService.getWarehouse(function(result) {
                $scope.warehouseList = result;
                $scope.data.warehouseNumber = $scope.warehouseList[0].warehouseNumber;
            });

            var _formatShelfNumber = function() {
                return "{area}-{row}-{layer}-{position}".replace("{area}", $scope.data.area)
                    .replace("{row}", $scope.data.row)
                    .replace("{layer}", $scope.data.layer)
                    .replace("{position}", $scope.data.position);
            }

            $scope.btnSave = function() {
                shelfService.update({
                    shelfNumber: _formatShelfNumber(),
                    type: $scope.data.area,
                    warehouseNumber: $scope.data.warehouseNumber
                }, function(result) {
                    if (!result.message) {
                        plugMessenger.success("创建成功");
                        $scope.btnPrev();
                    }
                });
            }

            $scope.btnPrev = function() {
                $window.history.back();
            }

            $scope.btnPrint = function() {
                $scope.$broadcast("print-helper.action", "shelf-management-tag", {
                    shelfNumber: _formatShelfNumber()
                });
            }
        }
    ]);