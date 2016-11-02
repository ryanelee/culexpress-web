'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:SysRoleListCtrl
 * @description
 * # SysRoleListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('SysRoleListCtrl', ["$scope", "$location", "sysroleService", "plugMessenger",
      function ($scope, $location, sysroleService, plugMessenger) {
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
              status: "",
              roleName: ""
          }

          $scope.getData = function () {
              var _options = {
                  "pageInfo": $scope.pagination,
                  'status': $scope.searchBar.status,
                  'roleName': $scope.searchBar.roleName
              }
              sysroleService.getList(_options, function (result) {
                  console.log(result);
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
              $location.path('/system/editrole');
          }

          $scope.getData();
      }]);
