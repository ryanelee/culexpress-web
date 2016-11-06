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
              $location.path('/system/editusergroup');
          }

          $scope.edit = function (id) {
              $location.search({ groupId: id });
              $location.path('/system/editusergroup');
          }

          $scope.getData();
      }]);
