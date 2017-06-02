'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:UGListCtrl
 * @description
 * # UGListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('UGListCtrl', ["$scope", "$location", "userService","storage",
      function ($scope, $location, userService,storage) {
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
              active: "",
              userName: ""
          }
               $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }
            //  storage.session.setObject("searchBar", $scope.searchBar);
          $scope.groupId = $location.search().groupId;

          $scope.getData = function () {
              storage.session.setObject("searchBar", $scope.searchBar);
              var _options = {
                  "pageInfo": $scope.pagination,
                  'groupId': $scope.groupId
              }
              userService.getList(_options, function (result) {
                  $scope.dataList = result.data;
                  $scope.pagination.totalCount = result.pageInfo.totalCount;
              });
          }

          $scope.back = function () {
            $location.path('/system/usergrouplist').search({});
          }

          if ($scope.groupId) {
            $scope.getData();
          }

          $scope.goToRolePage = function (role) {
              $location.path('/system/editrole').search({ roleId: role.role_id });
          };
      }]);
