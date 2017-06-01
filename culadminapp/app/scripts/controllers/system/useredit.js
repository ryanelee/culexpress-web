'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:UserEditCtrl
 * @description
 * # UserEditCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('UserEditCtrl', ['$scope', '$location', '$window', '$timeout', 'userService', 'sysusergroupService','sysroleService', 'plugMessenger',
      function ($scope, $location, $window, $timeout, userService, ugService, roleService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          // 提交表单的数据
          $scope.form = {
              userName: '',
              password: '',
              emailAddress: '',
              countryCode: '',
              groupId: '',
              roleId: ''
          }
          $scope.groups = []
          ugService.getList({status: 1}, function (result) {
              $scope.groups = result.data;
              if (result.data.length > 0 && !$scope.userId) {
                  $scope.form.groupId = result.data[0].group_id
              }
          });


          $scope.roles = [];
          roleService.getList({ status: 1 }, function (result) {
              $scope.roles = result.data;
          });

          // 如果是编辑
          $scope.userId = $location.search().userId;
          if ($scope.userId) {
              userService.getDetail($scope.userId, function (result) {
                  if (!result.message) {
                      $scope.form.userName = result.userName;
                      $scope.form.password = result.password;
                      $scope.form.emailAddress = result.emailAddress;
                      $scope.form.countryCode = result.countryCode;
                      $scope.form.groupId = result.groupId;
                      $scope.form.roleId = result.role_id;
                      $scope.form.gender = result.gender;
                      $scope.form.active = result.active;
                      $scope.form.selectedRoles = result.roles;

                  };
              });
          } else {
            $scope.form.gender = 'M';
            $scope.form.active = 1;
          };

          /**
           * 保存员工数据
           * @return {[type]}      [description]
           */
          $scope.saveUser = function () {
              if (!$scope.form.userName) {
                  plugMessenger.info("请输入员工名称!");
                  return;
              }
              if (!$scope.form.emailAddress) {
                  $scope.form.emailAddress = $scope.form.userName.trim() + "@culexpress.com";
              }
              else if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test($scope.form.emailAddress)) {
                  plugMessenger.info("邮箱格式不正确!");
                  return;
              }
            //   if (!$scope.form.emailAddress) {
            //       plugMessenger.info("请输入邮箱!");
            //       return;
            //   } else if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test($scope.form.emailAddress)) {
            //       plugMessenger.info("邮箱格式不正确!");
            //       return;
            //   }
              if (!$scope.form.password && !$scope.userId) {
                  plugMessenger.info("请输入密码!");
                  return;
              } else if (!$scope.userId && $scope.form.password.toString().length < 6) {
                  plugMessenger.info("密码至少6位数!");
                  return;
              }
              if (!$scope.form.groupId) {
                  plugMessenger.info("请选择部门!");
                  return;
              }
              if (!$scope.form.selectedRoles || $scope.form.selectedRoles.length < 1) {
                  plugMessenger.info("请选择至少一个岗位!");
                  return;
              }

              $scope.form.roleId = null;
              if($scope.form.selectedRoles && $scope.form.selectedRoles.length > 0){
                  $scope.form.selectedRoles.forEach(function(item){
                        $scope.form.roleId = $.grep([$scope.form.roleId,item.role_id],Boolean).join(",");
                  });
              }

              if ($scope.userId) {
                  $scope.form.userId = $scope.userId;
                  userService.update($scope.form, function(res) {
                      if (res.changedRows) {
                          plugMessenger.success("保存成功");
                          $window.sessionStorage.setItem("historyFlag", 1);                 $window.history.back();
                      }
                  })
              } else {
                  userService.addUser($scope.form, function(res) {
                      if (!res.message) {
                          plugMessenger.success("保存成功");
                          $window.sessionStorage.setItem("historyFlag", 1);                 $window.history.back();
                      }
                  })
              }
          }

          // 返回列表
          $scope.back = function () {
              $location.path('/system/userlist').search({});
          }
      }]);
