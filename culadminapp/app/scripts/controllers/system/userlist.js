'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:UserListCtrl
 * @description
 * # UserListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('UserListCtrl', ["$scope", "$location", "userService", "plugMessenger",
      function ($scope, $location, userService, plugMessenger) {
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

          $scope.getData = function () {
              var _options = {
                  "pageInfo": $scope.pagination,
                  'active': $scope.searchBar.active,
                  'userName': $scope.searchBar.userName
              }
              userService.getList(_options, function (result) {
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
              $location.path('/system/edituser');
          }

          $scope.edit = function (id) {
              $location.search({ userId: id });
              $location.path('/system/edituser');
          }

          // 删除用户
          $scope.del = function(id) {
            plugMessenger.confirm("确认删除该用户吗?", function (isOk) {
                if (isOk) {
                  userService.delete(id, function(res) {
                      if (res.success) {
                          plugMessenger.success("删除成功");
                          $scope.getData();
                      }
                  })
                }
            });
          }

          $scope.getData();
      }]).filter('activeStr',function(){
        return function(active){
            var str = '已激活';
            if (active == 0) {
              str = '未激活';
            } else if (active == '-1') {
              str = '已禁用'
            }
            return str;
        }
    });
