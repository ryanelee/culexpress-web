﻿'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseInventoryLogListCtrl
 * @description
 * # WarehouseInventoryLogListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseInventoryLogListCtrl', ['$scope', '$location', '$window', 'warehouseService', 'inventoryService','storage',
      function ($scope, $location, $window, warehouseService, inventoryService,storage) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.dataList = [];

          /*search bar*/
          $scope.searchBar = {
              keywordType: "itemNumber",
              keywords: $location.search().itemNumber || "",
              warehouseNumber: "",
              inventoryCondition: "",
              inventoryConditionValue: "0",
              categoryId: "",
              categorySubId: "",

              dateRange: "",
              startDate: "",
              endDate: "",
              opened: {
                  startDate: false,
                  endDate: false
              }
          }
           $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }
            //  storage.session.setObject("searchBar", $scope.searchBar);

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

          inventoryService.getCategoryList(function (result) {
              if (!!result) {
                  $scope.searchBar.categoryList = [{ cateid: "", name: "全部" }].concat(result);
                  $scope.searchBar.categorySubList = [{ cateid: "", name: "全部" }];
              }
          });

          $scope.changeCategory = function () {
              $scope.searchBar.categorySubId = "";
              $scope.searchBar.categorySubList = [{ cateid: "", name: "全部" }];
              var currentCategory = _.findWhere($scope.searchBar.categoryList, { cateid: $scope.searchBar.categoryId });
              if (!!currentCategory) {
                  $scope.searchBar.categorySubList = $scope.searchBar.categorySubList.concat(currentCategory.sub || []);
              }
          }

          var _filterOptions = function () {
              var _options = {
                  "pageInfo": $scope.pagination,
                  "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate : "",
                  "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate: "",
              }
              if (!!$scope.searchBar.categoryId) {
                  _options["itemCategory"] = $scope.searchBar.categoryId;
              }
              if (!!$scope.searchBar.categorySubId) {
                  _options["itemSubCategory"] = $scope.searchBar.categorySubId;
              }

              switch ($scope.searchBar.inventoryCondition) {
                  case ">":
                      _options["inventoryFrom"] = $scope.searchBar.inventoryConditionValue;
                      break;
                  case "<":
                      _options["inventoryTo"] = $scope.searchBar.inventoryConditionValue;
                      break;
                  case "=":
                      _options["inventory"] = $scope.searchBar.inventoryConditionValue;
                      break;
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
              storage.session.setObject("searchBar", $scope.searchBar);
              inventoryService.getLogList(_filterOptions(), function (result) {
                  $scope.dataList = result.data;
                  $scope.pagination.totalCount = result.pageInfo.totalCount;
              });
          }
        //   $scope.getData();

          $scope.btnSearch = function () {
              $scope.selectedListCache = [];
              $scope.dataList = [];
              $scope.pagination.pageIndex = 1;
              $scope.pagination.totalCount = 0;
              $scope.getData();
          }

          $scope.btnPrev = function () {
              $window.sessionStorage.setItem("historyFlag", 1);                 $window.history.back();
          }

          if(!!$scope.searchBar.keywords && $scope.searchBar.keywords.length > 0){
              $scope.btnSearch();
          }
      }]);

