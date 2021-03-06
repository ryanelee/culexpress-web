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
              status: '1'
          }
          //$scope.roles = []

          // 获取权限列表
        //   sysroleService.getList({}, function(result) {
        //       $scope.roles = result.data;
        //       if (result.data.length > 0 && !$scope.groupId) {
        //           $scope.form.role_id = result.data[0].role_id;
        //       }
        //   })

          // 如果是编辑
          $scope.groupId = $location.search().groupId;
          if ($scope.groupId) {
              ugService.getDetail($scope.groupId, function (result) {
                  if (!result.message) {
                      $scope.form.name = result.gname;
                      $scope.form.describe = result.gdescribe;
                      $scope.form.status = result.gstatus;
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
                //   plugMessenger.info("请输入描述!");
                //   return;
                $scope.form.describe = $scope.form.name;
              }
            //   if (!$scope.form.role_id) {
            //       plugMessenger.info("请选择角色!");
            //       return;
            //   }
              if ($scope.groupId) {
                  $scope.form.group_id = $scope.groupId;
                  ugService.update($scope.form, function(res) {
                      if (res.changedRows) {
                          plugMessenger.success("保存成功");
                          $window.sessionStorage.setItem("historyFlag", 1);                 $window.history.back();
                      }
                  })
              } else {
                  ugService.create($scope.form, function(res) {
                      if (!res.message) {
                          plugMessenger.success("保存成功");
                          $window.sessionStorage.setItem("historyFlag", 1);                 $window.history.back();
                      }
                  })
              }
          }

          // 返回列表
          $scope.back = function () {
              $location.path('/system/usergrouplist');
          }

      }]);
