'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:FinanceListCtrl
 * @description
 * # FinanceListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('FinanceListCtrl', ["$window","$scope","$rootScope","$location", "$filter", "customerService", "warehouseService", "plugMessenger",
      function ($window,$scope,$rootScope,$location, $filter, customerService, warehouseService, plugMessenger) {
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
          $scope.customer_ids = JSON.parse($window.sessionStorage.getItem("role")).customer_ids;

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
                  if ($scope.searchBar.keywordType == "customerNumber"
                      && parseInt($scope.customer_ids) !== 0
                      && !$scope.customer_ids.split(",").includes($scope.searchBar.keywords)) {
                      $scope.searchBar.keywords = "没有查看该客户的权限,请联系统管理员";
                  }

                  _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
              }
              return angular.copy(_options);
          }

          $scope.getData = function () {
              var _options = _filterOptions();
              customerService.statisticsList(angular.copy(_options), function (result) {
                  var _data = result.data;
                  if (parseInt($scope.customer_ids) !== 0) {
                      _data = _data.filter(function(x){
                          $scope.customer_ids.split(",").includes(x.customerNumber)
                      });
                  }

                  $scope.dataList = _data;

                  $scope.pagination.totalCount = result.pageInfo.totalCount;

                  $rootScope.$emit("changeMenu");
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

          $scope.getData();
      }]);
