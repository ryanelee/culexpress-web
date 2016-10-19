﻿'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseBucketCtrl
 * @description
 * # WarehouseBucketCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseBucketCtrl', ['$scope', '$location', '$window', 'warehouseService', 'bucketService',
      function ($scope, $location, $window, warehouseService, bucketService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.dataList = [];

          /*search bar*/
          $scope.searchBar = {
              keywordType: "itemNumber",
              warehouseNumber: "",

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
          });

          var _filterOptions = function () {
              var _options = {
                  "pageInfo": $scope.pagination,
                  "indateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                  "indateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : "",
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
              bucketService.getList(_filterOptions(), function (result) {
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
                  case "create":
                      $location.path("/warehouse/bucketedit");
                      break;
                  case "edit":
                      if (!!item) $location.search({ bucketNumber: item.bucketNumber });
                      $location.path("/warehouse/bucketedit");
                      break;
                  case "detail":
                      if (!!item) $location.search({ bucketNumber: item.bucketNumber, readonly: 1 });
                      $location.path("/warehouse/bucketedit");
                      break;
              }
          }
      }]);

