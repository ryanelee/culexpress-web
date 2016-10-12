'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:Receipt2Ctrl
 * @description
 * # Receipt2Ctrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('Receipt2Ctrl', ['$scope', '$location', "$filter", '$window', 'warehouseService', 'shelfService', 'receiptService', 'plugMessenger',
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
              keywords: $location.search().receiptNumber || "",
              warehouseNumber: "",
              sendType: "",
              inboundStatus: "",
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
                  "inboundDateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                  "inboundDateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : ""
              }
              if (!!$scope.searchBar.sendType) {
                  _options["sendType"] = $scope.searchBar.sendType;
              }
              if (!!$scope.searchBar.inboundStatus) {
                  _options["inboundStatus"] = $scope.searchBar.inboundStatus;
              }
              //if (!!$scope.searchBar.shelfStatus) {
              //    _options["shelfStatus"] = $scope.searchBar.shelfStatus;
              //}
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
              }
          }

          $scope.btnAction = function (type, item) {
              switch (type) {
                  case "exception":
                      $location.path('/warehouse/receiptexception');
                      break;
                  case "inbound":
                      if (!!item) $location.search({ receiptNumber: item.receiptNumber });
                      $location.path('/warehouse/receiptedit2');
                      break;
                  case "check":
                      if (!!item) $location.search({ receiptNumber: item.receiptNumber });
                      $location.path('/warehouse/receiptcheck2');
                      break;
                  case "delete":
                      plugMessenger.confirm("请确认是否删除该记录？", function (isOK) {
                          if (isOK) {
                              receiptService.delete({
                                  "receiptNumber": [item.receiptNumber]
                              }, function (result) {
                                  if (result.success == true) {
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
