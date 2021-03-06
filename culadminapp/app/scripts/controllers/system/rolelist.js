'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:SysRoleListCtrl
 * @description
 * # SysRoleListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('SysRoleListCtrl', ["$scope", "$location", "sysroleService", "plugMessenger","storage",
      function ($scope, $location, sysroleService, plugMessenger,storage) {
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
                $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }
            //  storage.session.setObject("searchBar", $scope.searchBar);


          $scope.getData = function () {
              storage.session.setObject("searchBar", $scope.searchBar);
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
              $location.path('/system/editrole').search({});
          }

          $scope.edit = function (id) {
              $location.path('/system/editrole').search({ roleId: id });
          }

          // 删除用户
          $scope.del = function(id) {
            plugMessenger.confirm("确认删除该岗位吗?", function (isOk) {
                if (isOk) {
                  sysroleService.delete(id, function(res) {
                      if (res.success) {
                          plugMessenger.success("删除成功");
                          $scope.getData();
                      }
                  })
                }
            });
          }
          $scope.getData();
      }]);
