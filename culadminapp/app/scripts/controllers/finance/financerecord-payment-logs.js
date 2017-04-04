'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:FinanceDetailPaymentLogsCtrl
 * @description
 * # FinanceDetailPaymentLogsCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('FinanceRecordLogsCtrl', ["$scope", "$location", "$filter", "customerService", "settlementService", "plugMessenger",
      function ($scope, $location, $filter, customerService, settlementService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.tpl_status = {
              "rechargeType": [
                  { "title": "全部", "value": "2,8,9,10,11" },
                  { "title": "订单支付", "value": "2" },
                  { "title": "扣款运费不足", "value": "8" },
                  { "title": "大客户结算扣款", "value": "9" },
                  { "title": "线下订单手动支付", "value": "10" },
                  { "title": "线上订单余额手动支付", "value": "11" }
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
              customerNumber: $location.search().customerNumber,
              selectedAll: false,
              rechargeType: "2,8,9,10,11",
              dateRange: "",
              keywordType: "customerNumber",
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

          var _filterOptions = function () {
              var _options = {
                  "pageInfo": $scope.pagination,
                  "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                  "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : "",
              }
              if (!!$scope.searchBar.rechargeType) {
                  _options["operationTypeList"] = $scope.searchBar.rechargeType.split(",");
              }

              if (!!$scope.searchBar.customerNumber) {
                  _options["customerNumber"] = $scope.searchBar.customerNumber;
              }
                if (!!$scope.searchBar.keywords) {
                    _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                }
              return angular.copy(_options);
          }

          $scope.getData = function () {
              var _options = _filterOptions();
              customerService.financeLogList(angular.copy(_options), function (result) {
                  $scope.allTotal = result.allTotal;
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

          $scope.getData();
      }]);
