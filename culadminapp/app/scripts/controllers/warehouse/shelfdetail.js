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
      function ($scope, $location, $window, shelfService, warehouseService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          $scope.data = {
              itemNumber: $location.search().itemNumber || "",
              originShelfNumber: $location.search().shelfNumber || "",
              targetShelfNumber: "",
              warehouseNumber: "",
              moveItemCount: ""
          };

          $scope.warehouseList = [];
          warehouseService.getWarehouse(function (result) {
              $scope.warehouseList = result;
              $scope.data.warehouseNumber = $scope.warehouseList[0].warehouseNumber;
          });

          $scope.btnSave = function (type) {
              var data = {
                  itemNumber: $scope.data.itemNumber,
                  originShelfNumber: $scope.data.originShelfNumber,
                  targetShelfNumber: $scope.data.targetShelfNumber,
                  warehouseNumber: $scope.data.warehouseNumber,
                  moveItemCount: $scope.data.moveItemCount
              }
              shelfService.onshelfForMove(data, function (result) {
                  if (!result.message) {
                      plugMessenger.success("操作成功");
                      $scope.btnPrev();
                  }
              });
          }

          $scope.btnPrev = function () {
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
      }]);
