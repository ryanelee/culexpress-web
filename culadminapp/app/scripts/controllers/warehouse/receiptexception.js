'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ReceiptExceptionCtrl
 * @description
 * # ReceiptExceptionCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('ReceiptExceptionCtrl', ['$scope', '$location', "$filter", '$window', 'warehouseService', 'shelfService', 'receiptService', 'plugMessenger',
      function ($scope, $location, $filter, $window, warehouseService, shelfService, receiptService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.dataList = [];
          $scope.pagination = {
              pageSize: "20",
              pageIndex: 1,
              totalCount: 0
          }
          /*search bar*/
          $scope.searchBar = {
              keywordType: "receiptNumber",
              warehouseNumber: "",
              sendType: "",
              status: "",
              startDate: "",
              endDate: "",
              opened: {
                  startDate: false,
                  endDate: false
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
                  "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : ""
              }
              if (!!$scope.searchBar.sendType) {
                  _options["sendType"] = $scope.searchBar.sendType;
              }
              if (!!$scope.searchBar.status) {
                  _options["status"] = $scope.searchBar.status;
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
              receiptService.getExceptionList(_filterOptions(), function (result) {
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

          $scope.btnOpenDetail = function (type, item) {
              switch (type) {
                  case "receiptDetail":
                      $location.search({ receiptNumber: item.receiptNumber });
                      $location.path("/warehouse/receiptdetail2");
                      break;
                  case "customerDetail":
                      $location.search({ customerNumber: item.customerNumber });
                      $location.path("/customer/customerdetail");
                      break;
                  case "exceptionDetail":
                      $location.search({ exceptionNumber: item.exceptionNumber });
                      $location.path("/warehouse/receiptexceptiondetail");
                      break;
              }
          }

          $scope.btnAction = function (type, item) {
              switch (type) {
                  case "exceptionRegister":
                      if (!!item) $location.search({ receiptNumber: item.receiptNumber });
                      $location.path('/warehouse/receiptexceptionedit');
                      break;
                  case "close":
                      plugMessenger.confirm("请确认是否关闭异常？", function (isOK) {
                          if (isOK) {
                              receiptService.exceptionEdit({
                                  customerNumber: item.customerNumber,
                                  warehouseNumber: item.warehouseNumber,
                                  exceptionNumber: item.exceptionNumber,
                                  status: 2
                              }, function (result) {
                                  if (result.success) {
                                      plugMessenger.success("关闭成功");
                                      $scope.getData();
                                  }
                              });
                          }
                      });
                      break;
                  case "delete":
                      plugMessenger.confirm("请确认是否删除该记录？", function (isOK) {
                          if (isOK) {
                              receiptService.exceptionEdit({
                                  customerNumber: item.customerNumber,
                                  warehouseNumber: item.warehouseNumber,
                                  exceptionNumber: item.exceptionNumber,
                                  status: -1
                              }, function (result) {
                                  if (result.success) {
                                      plugMessenger.success("删除成功");
                                      $scope.getData();
                                  }
                              });
                          }
                      });
                      break;
              }
          }

          $scope.getData();
      }]);
