'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseRegistrationCtrl
 * @description
 * # WarehouseRegistrationCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('ReceiptCtrl', ['$rootScope','$scope', '$location', "$filter", '$window', 'warehouseService', "plugMessenger","storage",
      function ($rootScope,$scope, $location, $filter, $window, warehouseService, plugMessenger,storage) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.dataList = [];
          $scope.customer_ids = JSON.parse($window.sessionStorage.getItem("role")).customer_ids;

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
             $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }
            //  storage.session.setObject("searchBar", $scope.searchBar);

          $scope.getData = function () {
               storage.session.setObject("searchBar", $scope.searchBar);
              var _options = {
                  "pageInfo": $scope.pagination,
                  "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                  "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : ""
              }
              if (!!$scope.searchBar.keywords) {
                  if ($scope.searchBar.keywordType == "customerNumber"
                      && $scope.customer_ids != undefined
                      && parseInt($scope.customer_ids) !== 0
                      && !$scope.customer_ids.split(",").includes($scope.searchBar.keywords)) {
                      $scope.searchBar.keywords = "没有查看该客户的权限,请联系统管理员";
                  }

                  _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                  
              }
              warehouseService.getInboundPackageList(_options, function (result) {
                  var _data = result.data;
                  if ($scope.customer_ids != undefined && parseInt($scope.customer_ids) !== 0) {
                      _data = _data.filter(function(x){
                          return $scope.customer_ids.split(",").includes(x.customerNumber);
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

        //   $scope.getData();
      }]);
