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

          $scope.addReceipt = function () {
              $location.path('/system/editrole');
          }

          $scope.edit = function (id) {
              $location.search({ roleId: id });
              $location.path('/system/editrole');
          }

          // 删除用户
          $scope.del = function(id) {
            sysroleService.delete(id, function(res) {
                if (res.success) {
                    plugMessenger.success("删除成功");
                    $scope.getData();
                }
            })
          }
          $scope.getData();
      }]);
