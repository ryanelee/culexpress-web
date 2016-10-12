'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseShelfManagementDetailCtrl
 * @description
 * # WarehouseShelfManagementDetailCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseShelfManagementDetailCtrl', ['$scope', '$location', '$window', 'shelfService', 'warehouseService', 'plugMessenger',
      function ($scope, $location, $window, shelfService, warehouseService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.warehouseList = [];
          warehouseService.getWarehouse(function (result) {
              $scope.warehouseList = result;
              $scope.data.warehouseNumber = $scope.warehouseList[0].warehouseNumber;
          });
          $scope.getWarehouseName = function (warehouseNumber) {
              var warehouse = _.findWhere($scope.warehouseList, { warehouseNumber: warehouseNumber });
              return !!warehouse ? warehouse.warehouseName : "";
          }

          shelfService.getDetail($location.search().shelfNumber, function (result) {
              $scope.data = result;
          });

          $scope.btnAction = function (type, item) {
              switch (type) {
                  case "detail":
                      $location.search({ itemNumber: item.itemNumber });
                      $location.path("/warehouse/inventorydetail");
                      break;
              }
          }

          $scope.btnPrev = function () {
              $window.history.back();
          }
      }]);
