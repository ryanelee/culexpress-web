'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseShelfCtrl
 * @description
 * # WarehouseShelfCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseShelfCtrl', ['$scope', '$location', 'receiptSvr',
      function ($scope, $location, receiptSvr) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.dataList = [];
          $scope.pagination = {
              pageSize: "20",
              pageIndex: 1,
              total: 0
          }

          $scope.getData = function () {
              var dataReault = receiptSvr.getReceiptList({}, $scope.pagination.pageIndex, $scope.pagination.pageSize);
              $scope.dataList = dataReault.list;
              $scope.pagination.total = dataReault.total;
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

          $scope.addShelf = function () {
              $location.path('/warehouse/editshelf');
          }
      }]);
