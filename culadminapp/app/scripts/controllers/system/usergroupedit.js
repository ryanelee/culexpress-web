'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:SysUserGroupEditCtrl
 * @description
 * # SysUserGroupEditCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('SysUserGroupEditCtrl', ['$scope', '$location', '$window', 'sysroleService', 'sysusergroupService', 'plugMessenger',
      function ($scope, $location, $window, sysroleService, ugService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          // 提交表单的数据
          $scope.form = {
              name: '',
              describe: '',
              status: '1',
              role_id: 0
          }
          $scope.roles = []

          // 获取权限列表
          sysroleService.getList({}, function(result) {
              $scope.roles = result.data;
              if (result.data.length > 0 && !$scope.groupId) {
                  $scope.form.role_id = result.data[0].role_id;
              }
          })

          // 如果是编辑
          $scope.groupId = $location.search().groupId;
          if ($scope.groupId) {
              ugService.getDetail($scope.groupId, function (result) {
                  if (!result.message) {
                      $scope.form.name = result.name;
                      $scope.form.describe = result.describe;
                      $scope.form.status = result.status;
                      $scope.form.role_id = result.role_id;
                  }
              });
          }

          /**
           * 保存角色数据
           * @return {[type]}      [description]
           */
          $scope.saveRole = function () {
              if (!$scope.form.name) {
                  plugMessenger.info("请输入名称!");
                  return;
              }
              if (!$scope.form.describe) {
                  plugMessenger.info("请输入描述!");
                  return;
              }
              if (!$scope.form.role_id) {
                  plugMessenger.info("请选择角色!");
                  return;
              }
              if ($scope.groupId) {
                  $scope.form.group_id = groupId;
                  ugService.update($scope.form, function(res) {
                      if (!res.message) {
                          plugMessenger.success("保存成功");
                          $window.history.back();
                      } else {
                        plugMessenger.success(result.message);
                      }
                  })
              } else {
                  ugService.create($scope.form, function(res) {
                      if (!res.message) {
                          plugMessenger.success("保存成功");
                          $window.history.back();
                      } else {
                        plugMessenger.success(result.message);
                      }
                  })
              }
          }

          // 返回列表
          $scope.back = function () {
              $location.path('/system/rolelist');
          }

      }]);
