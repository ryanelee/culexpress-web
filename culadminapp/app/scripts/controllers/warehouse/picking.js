'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehousePickingCtrl
 * @description
 * # WarehousePickingCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehousePickingCtrl', ['$scope', '$location', 'receiptSvr',
      function ($scope, $location, receiptSvr) {
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
              var dataResult = receiptSvr.getReceiptList({}, $scope.pagination.pageIndex, $scope.pagination.pageSize);
              $scope.dataList = dataResult.list;
              $scope.pagination.total = dataResult.total;
          }
          $scope.getData();

          /*search bar*/
          $scope.searchBar = {
              startDate: new Date(),
              endDate: new Date(),
              opened: {
                  startDate: false,
                  endDate: false
              }
          }

          $scope.addPicking = function () {
              $location.path('/warehouse/editpicking');
          }

      }]);
