'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseRegistrationCtrl
 * @description
 * # WarehouseRegistrationCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('ReceiptCtrl', ['$scope', '$location', "$filter", '$window', 'warehouseService', "plugMessenger",
      function ($scope, $location, $filter, $window, warehouseService, plugMessenger) {
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
              keywordType: "trackingNumber",
              startDate: "",
              endDate: "",
              opened: {
                  startDate: false,
                  endDate: false
              }
          }

          $scope.getData = function () {
              var _options = {
                  "pageInfo": $scope.pagination,
                  "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                  "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : ""
              }
              if (!!$scope.searchBar.keywords) {
                  _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
              }
              warehouseService.getInboundPackageList(_options, function (result) {
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
                  case "trackingDetail":
                      $location.search({ trackingNumber: item.trackingNumber });
                      $location.path("/warehouse/editreceipt");
                      break;
                  case "customerDetail":
                      $location.search({ customerNumber: item.customerNumber });
                      $location.path("/customer/customerdetail");
                      break;
              }
          }

          $scope.btnActions = function (item, type) {
              switch (type) {
                  case "void":
                      break;
                  case "delete":
                      plugMessenger.confirm("确定要删除吗？", function (isOK) {
                          warehouseService.deleteInboundPackageDetail(item.trackingNumber, function (result) {
                              if (result.success == true) {
                                  plugMessenger.success("删除成功");
                                  $scope.btnSearch();
                              }
                          });
                      });
                      break;
              }
          }

          $scope.btnPrint = function (item) {
              $scope.$broadcast("print-inboundPackage.action", item.trackingNumber);
          }

          $scope.addReceipt = function () {
              $location.path('/warehouse/editreceipt');
          }

          $scope.getData();
      }]);
