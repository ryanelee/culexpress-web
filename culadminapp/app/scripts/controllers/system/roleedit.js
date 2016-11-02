'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:SysRoleEditCtrl
 * @description
 * # SysRoleEditCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('SysRoleEditCtrl', ['$scope', '$location', '$window', 'sysroleService', 'customerService', 'warehouseService', 'plugMessenger',
      function ($scope, $location, $window, sysroleService, customerService, warehouseService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          // 提交表单的数据
          $scope.form = {
              roleName: '',
              roleDescribe: '',
              status: '1',
              warehouseIds: '',
              customerIds: '',
              functions: '',
              updater: 'test'
          }

          // 定义参数
          $scope.warehouseIds = [];
          $scope.customers = '0';
          $scope.customerNumber = '';

          $scope.selCNumbers = [];

          $scope.data = {
              detail: [],
              packageList: []
          };

          $scope.tpl_status = {
              actionType: "bucket", //bucket; package;
              bucketNumber: $location.search().bucketNumber || "",
              readonly: $location.search().readonly || ""
          }

          if (!!$scope.tpl_status.bucketNumber) {
              bucketService.getDetail($scope.tpl_status.bucketNumber, function (result) {
                  $scope.data = result;
              });
              $("#bucket-title").text("编辑" + $scope.tpl_status.bucketNumber);
          }

          // 获取功能菜单列表
          sysroleService.getFunctionList({}, function(result) {
              var functions = [];
              var funcObj = {};
              result.forEach(function(item) {
                  // 默认启用
                  item.status = 1;
                  // 菜单收起
                  if (item.type == 1) {
                      item.close = true;
                  }
                  if (!item.parentFunctionID) {
                      funcObj[item.functionID] = item
                      functions.push(item)
                  } else {
                      funcObj[item.functionID] = item
                      if (!funcObj[item.parentFunctionID].childs) {
                          funcObj[item.parentFunctionID].childs = []
                      }
                      funcObj[item.parentFunctionID].childs.push(item)
                  }
              })
              $scope.functions = functions;
          })

          // 获取仓库列表
          warehouseService.getWarehouse(function (result) {
              $scope.warehouseList = result;
              $scope.data.warehouseNumber = $scope.warehouseList[0].warehouseNumber;
          });

          // 选择仓库
          $scope.toggleSelection = function (id) {
              var idx = $scope.warehouseIds.indexOf(id);
              // is currently selected
              if (idx > -1) {
                  $scope.warehouseIds.splice(idx, 1);
              }
              else {
                  $scope.warehouseIds.push(id);
              }
          }

          // 添加客户编号
          $scope.addCustomer = function () {
              if (!$scope.customerNumber) {
                  plugMessenger.info("请输入客户编号!");
                  return;
              }
              var idx = $scope.selCNumbers.indexOf($scope.customerNumber);
              // is currently selected
              if (idx >= 0) {
                  plugMessenger.info("客户已经存在!");
                  return;
              }

              customerService.getDetail($scope.customerNumber, function(res) {
                  if (res && res.customerNumber) {
                      $scope.selCNumbers.push(res.customerNumber);
                      $scope.customerNumber = '';
                  } else {
                      plugMessenger.info("客户不存在!");
                  }
              });
          }

          var getFuncStatus = function(item, obj) {
              obj[item.functionID] = item.status;
              if (item.childs) {
                  item.childs.forEach(function(row) {
                      getFuncStatus(row, obj);
                  })
              }
          }

          $scope.saveRole = function (type) {
              if (!$scope.form.roleName) {
                  plugMessenger.info("请输入角色名称!");
                  return;
              }
              if (!$scope.form.roleDescribe) {
                  plugMessenger.info("请输入角色描述!");
                  return;
              }
              $scope.form.warehouseIds = $scope.warehouseIds.join(',');
              $scope.form.customerIds = $scope.selCNumbers.join(',');
              var funcs = {};
              $scope.functions.forEach(function(item) {
                  funcs[item.functionID] = item.status
                  getFuncStatus(item, funcs)
              })
              $scope.form.functions = JSON.stringify(funcs)
              sysroleService.create($scope.form, function(res) {
                  if (!result.message) {
                      plugMessenger.success("保存成功");
                      $window.history.back();
                  }
              })
          }

          $scope.back = function () {
              $location.path('/system/rolelist');
          }

      }]);
