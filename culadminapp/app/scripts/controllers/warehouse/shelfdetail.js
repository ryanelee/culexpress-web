'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseShelfDetailCtrl
 * @description
 * # WarehouseShelfDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseShelfDetailCtrl', ['$scope', '$location', '$window', 'shelfService', 'warehouseService', 'plugMessenger',
        function($scope, $location, $window, shelfService, warehouseService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            console.log($location.search().shelfNumber)
            $scope.data = {
                itemNumber: $location.search().itemNumber || "",
                originShelfNumber: $location.search().shelfNumber || "",
                warehouseName: $location.search().warehouseName || "",
                targetShelfNumber: "",
                warehouseNumber: "",
                moveItemCount: ""
            };


            // $scope.getWarehouseName = function(warehouseNumber) {
            //     var warehouse = _.findWhere($scope.warehouseList, { warehouseNumber: warehouseNumber });
            //     return !!warehouse ? warehouse.warehouseName : "";
            // }

            $scope.warehouseList = [];
            warehouseService.getWarehouse(function(result) {
                $scope.warehouseList = result;
                $scope.data.warehouseNumber = $scope.warehouseList[0].warehouseNumber;
            });

            $scope.btnSave = function(type) {
                if ($scope.data.moveItemCount <= 0) {
                    plugMessenger.error("移动数量不能小于等于0");
                    return;
                }
                if (!$scope.data.targetShelfNumber) {
                    plugMessenger.error("目标价位不能为空");
                    return;
                }
                var data = {
                    itemNumber: $scope.data.itemNumber,
                    originShelfNumber: $scope.data.originShelfNumber,
                    targetShelfNumber: $scope.data.targetShelfNumber,
                    warehouseNumber: $scope.data.warehouseNumber,
                    warehouseName: $scope.data.warehouseName,
                    moveItemCount: $scope.data.moveItemCount
                }
                shelfService.onshelfForMove(data, function(result) {
                    if (!result.message) {
                        plugMessenger.success("操作成功");
                        $scope.btnPrev();
                        
                    }
                });
            }

            $scope.btnPrev = function() {
                $window.history.back();
            }

            $('#tip_originShelfNumber').popover({
                container: 'body',
                placement: 'top',
                html: true,
                trigger: 'hover',
                title: '',
                content: "填000将会只添加商品到目标架位"
            });
        }
    ]);