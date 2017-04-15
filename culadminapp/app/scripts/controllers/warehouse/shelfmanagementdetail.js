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

          $scope.warehouseName = "";
          $scope.warehouseList = [];
          warehouseService.getWarehouse(function (result) {
              $scope.warehouseList = result;
          });

          shelfService.getDetail({ 
              warehouseNumber: $location.search().warehouseNumber, 
              shelfNumber: $location.search().shelfNumber 
            }, function (result) {
              $scope.data = result;
              var warehouse = _.findWhere($scope.warehouseList,
                  { warehouseNumber: $scope.data.warehouseNumber });
              $scope.warehouseName = warehouse ? warehouse.warehouseName : "";
          });

          $scope.btnAction = function (type, item) {
              switch (type) {
                  case "detail":
                      $location.search({ warehouseNumber: item.warehouseNumber, itemNumber: item.itemNumber });
                      $location.path("/warehouse/inventorydetail");
                      break;
              }
          }

          $scope.btnPrev = function () {
              $window.history.back();
          }
      }]);
