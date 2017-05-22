'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:SysUserGroupListCtrl
 * @description
 * # SysUserGroupListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('SysUserGroupListCtrl', ["$scope", "$location", "sysusergroupService", "plugMessenger",
      function ($scope, $location, ugService, plugMessenger) {
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
              name: ""
          }

          $scope.getData = function () {
              var _options = {
                  "pageInfo": $scope.pagination,
                  'status': $scope.searchBar.status,
                  'name': $scope.searchBar.name
              }
              ugService.getList(_options, function (result) {
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
              $location.path('/system/editusergroup').search({});
          }

          $scope.edit = function (id) {
              $location.path('/system/editusergroup').search({ groupId: id });
          }

          $scope.show = function (id) {
              $location.search({ groupId: id });
              $location.path('/system/uglist');
          }

          // 删除用户
          $scope.del = function(id) {
            plugMessenger.confirm("确认删除该部门吗?", function (isOk) {
                if (isOk) {
                  ugService.delete(id, function(res) {
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
