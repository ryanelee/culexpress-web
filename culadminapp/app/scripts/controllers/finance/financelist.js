'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:FinanceListCtrl
 * @description
 * # FinanceListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('FinanceListCtrl', ["$timeout", "$window","$scope","$rootScope","$location", "$filter", "customerService", "warehouseService", "plugMessenger","storage",
      function ($timeout, $window,$scope,$rootScope,$location, $filter, customerService, warehouseService, plugMessenger,storage) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.tpl_status = {
              customerType: {
                  "normal_customer": "普通客户",
                  "vip_customer": "VIP客户"
              }
          }

          $scope.dataList = [];

          $scope.pagination = {
              pageSize: "20",
              pageIndex: 1,
              totalCount: 0
          }
          /*search bar*/
          $scope.searchBar = {
              selectedAll: false,
              keywordType: "customerNumber",
              warehouseNumber: ""
          }
              $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }
            //   storage.session.setObject("searchBar", $scope.searchBar);


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
              var _options = _filterOptions();
              customerService.statisticsList(angular.copy(_options), function (result) {
                  $scope.dataList = result.data;

                  $scope.pagination.totalCount = result.pageInfo.totalCount;
              });
          }

          $scope.btnSearch = function () {
              $scope.dataList = [];
              $scope.pagination.pageIndex = 1;
              $scope.pagination.totalCount = 0;
              $scope.getData();
          }

          $scope.btnOpenDetail = function (item, type) {
              switch (type) {
                  case "customerdetail":
                      $location.search({ customerNumber: item.customerNumber });
                      $location.path("/customer/customerdetail");
                      break;
                  case "financedetail":
                      $location.search({ customerNumber: item.customerNumber });
                      $location.path("/finance/financedetail");
                      break;
              }
          }

          $timeout(function(){
            // $scope.getData();
          },500);
          
      }]);
