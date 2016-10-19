﻿'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseOnShelfCtrl
 * @description
 * # WarehouseOnShelfCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseOnShelfCtrl', ['$scope', '$location', 'warehouseService', 'shelfService',
      function ($scope, $location, warehouseService, shelfService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.dataList = [];
          $scope.warehouseList = [];
          $scope.getWarehouseName = function (warehouseNumber) {
              var warehouse = _.findWhere($scope.warehouseList, { warehouseNumber: warehouseNumber });
              return !!warehouse ? warehouse.warehouseName : "";
          }

          /*search bar*/
          $scope.searchBar = {
              keywordType: "receiptNumber",
              warehouseNumber: "",
              sendType: "",
              shelfStatus: "",


              dateRange: "",
              startDate: "",
              endDate: "",
              opened: {
                  startDate: false,
                  endDate: false
              }
          }

          $scope.pagination = {
              pageSize: "20",
              pageIndex: 1,
              totalCount: 0
          }

          warehouseService.getWarehouse(function (result) {
              if (result.length == 1) {
                  $scope.searchBar.warehouseList = result;
                  $scope.searchBar.warehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
              } else {
                  $scope.searchBar.warehouseList = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
              }
              $scope.warehouseList = result;
          });

          var _filterOptions = function () {
              var _options = {
                  "pageInfo": $scope.pagination,
                  "inboundDateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                  "inboundDateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : "",
              }

              if (!!$scope.searchBar.sendType) {
                  _options["sendType"] = $scope.searchBar.sendType;
              }
              if (!!$scope.searchBar.shelfStatus) {
                  _options["shelfStatus"] = $scope.searchBar.shelfStatus;
              }
              if (!!$scope.searchBar.warehouseNumber) {
                  _options["warehouseNumber"] = $scope.searchBar.warehouseNumber;
              }
              if (!!$scope.searchBar.keywords) {
                  _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
              }
              return angular.copy(_options);
          }

          $scope.getData = function () {
              shelfService.getTransportList(_filterOptions(), function (result) {
                  $scope.dataList = result.data;
                  $scope.pagination.totalCount = result.pageInfo.totalCount;
              });
          }
          $scope.getData();

          $scope.btnSearch = function () {
              $scope.selectedListCache = [];
              $scope.dataList = [];
              $scope.pagination.pageIndex = 1;
              $scope.pagination.totalCount = 0;
              $scope.getData();
          }

          $scope.btnAction = function (type, item) {
              switch (type) {
                  case "receipt":
                      if (!!item) $location.search({ receiptNumber: item.receiptNumber });
                      $location.path("/warehouse/receipt2");
                      break;
                  case "shelf":
                      if (!!item) $location.search({ receiptNumber: item.receiptNumber });
                      $location.path("/warehouse/shelf");
                      break;
                  case "onshelf":
                      //if (!!item) $location.search({ receiptNumber: item.receiptNumber });
                      $location.path("/warehouse/onshelfdetail");
                      break;
              }
          }

          $scope.btnPrint = function (warehouseNumber) {
              $scope.$broadcast("print-unshelf.action", warehouseNumber);
          }
      }]);
