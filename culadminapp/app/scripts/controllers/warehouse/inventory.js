'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseInventoryCtrl
 * @description
 * # WarehouseInventoryCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseInventoryCtrl', ['$scope', '$location', '$window', 'inventorySvr',
      function ($scope, $location, $window, inventorySvr) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          //$('.switch-demo, .switch-radio-demo').bootstrapSwitch();


          $scope.dataList = [];
          $scope.pagination = {
              pageSize: "20",
              pageIndex: 1,
              total: 0
          }

          $scope.getData = function () {
              var dataResult = inventorySvr.getInventoryList({}, $scope.pagination.pageIndex, $scope.pagination.pageSize);
              $scope.dataList = dataResult.list;
              $scope.pagination.total = dataResult.total;
          }
          $scope.getData();

          $scope.linkToCustomerInfoPage = function (customerNumber) {
              $window.open('http://www.culexpress.com/WMS/ClientInfo.aspx?sysid=' + customerNumber);
          }


          /*search bar*/
          $scope.searchBar = {
              startDate: new Date(),
              endDate: new Date(),
              opened: {
                  startDate: false,
                  endDate: false
              }
          }
      }]);

