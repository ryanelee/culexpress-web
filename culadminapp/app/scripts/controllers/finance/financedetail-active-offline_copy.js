'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:FinanceDetailActiveOfflineCtrl
 * @description
 * # FinanceDetailActiveOfflineCtrl
 * Controller of the culAdminApp
 */ 
angular.module('culAdminApp')
  .controller('FinanceDetailActiveOfflineCtrl', ["$scope", "$location", "$filter", "customerService", "settlementService", "warehouseService", "plugMessenger",
      function ($scope, $location, $filter, customerService, settlementService, warehouseService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.tpl_status = {
              "payType": [
                  { "title": "全部", "value": "" },
                  { "title": "运费", "value": "1" },
                  { "title": "入库费用", "value": "2" },
                  { "title": "出库费用", "value": "3" },
                  { "title": "仓储费用", "value": "4" }
              ]
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
              keywordType: "orderNumber",
              type: "",
              settlementDetailIsPaid: "",
              dateRange: "",
              startDate: "",
              endDate: "",
              opened: {
                  startDate: false,
                  endDate: false
              }
          }

          $scope.changeDate = function () {
              var day = 24 * 60 * 60 * 1000;
              switch ($scope.searchBar.dateRange) {
                  case "3":
                      $scope.searchBar.startDate = new Date(new Date() - day * 3);
                      $scope.searchBar.startDate.setHours(0);
                      $scope.searchBar.startDate.setMinutes(0);
                      $scope.searchBar.startDate.setSeconds(0);
                      $scope.searchBar.startDate.setMilliseconds(0);

                      $scope.searchBar.endDate = new Date();
                      break;
                  case "7":
                      $scope.searchBar.startDate = new Date(new Date() - day * 7);
                      $scope.searchBar.startDate.setHours(0);
                      $scope.searchBar.startDate.setMinutes(0);
                      $scope.searchBar.startDate.setSeconds(0);
                      $scope.searchBar.startDate.setMilliseconds(0);

                      $scope.searchBar.endDate = new Date();
                      break;
                  default:
                      $scope.searchBar.startDate = "";
                      $scope.searchBar.endDate = "";
                      break;
              }
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
                  "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                  "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : "",
                  "customerNumber": $location.search().customerNumber
              }
              if (!!$scope.searchBar.paidstatus) {
                  _options["paidstatus"] = $scope.searchBar.paidstatus;
              }
              if (!!$scope.searchBar.keywords) {
                  _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
              }
              return angular.copy(_options);
          }

          $scope.getData = function () {
              var _options = _filterOptions();
              _options.orderType = '0';
              settlementService.getList(angular.copy(_options), function (result) {
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
                  case "orderdetail":
                      $location.search({ orderNumber: item.orderNumber });
                      $location.path("/order/orderdetail");
                      break;
              }
          }

        //   $scope.getData();

          $scope.btnPay = function (item) {
              if (!!item) {
                  $location.search({ customerNumber: $location.search().customerNumber, orderNumber: item.orderNumber, packageNumber: item.packageNumber, orderType: "offline", paid: item.fee });
                  $location.path("/finance/financedetail/pay");
              }
          }
      }]);
