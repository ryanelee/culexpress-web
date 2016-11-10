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

          let funcs = null
          if (sessionStorage.getItem('functions')) {
              funcs = JSON.parse(sessionStorage.getItem('functions'))
          }

          // 初始化菜单
          let initFunc = function(userFn) {
              var functions = [];
              var funcObj = {};
              funcs.forEach(function(item) {
                  // 根据保存的权限来匹配
                  if (userFn) {
                      item.status = userFn[item.functionID]
                  } else {
                    // 默认启用
                    item.status = 1;
                  }

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
          }

          // 如果是编辑
          $scope.roleId = $location.search().roleId;
          if ($scope.roleId) {
              sysroleService.getDetail($scope.roleId, function (result) {
                  if (!result.message) {
                      $scope.form.roleName = result.role_name;
                      $scope.form.roleDescribe = result.role_describe;
                      $scope.form.status = result.status;
                      $scope.warehouseIds = result.warehouse_ids.split(',').map(function(item) {return parseInt(item)});
                      $scope.form.customerIds = result.role_name;
                      if (result.customer_ids != 0) {
                          $scope.selCNumbers = result.customer_ids.split(',');
                      } else {
                          $scope.selCNumbers = [];
                      }
                      $scope.customers = result.customer_ids != 0 ? 1 : 0;
                      let userFunctions = JSON.parse(result.functions);
                      initFunc(userFunctions)
                  }
              });
          } else {
              // 定义参数
              $scope.warehouseIds = [];
              $scope.customers = '0';
              $scope.customerNumber = '';
              $scope.selCNumbers = [];
              initFunc()
          }

          // 获取仓库列表
          warehouseService.getWarehouse(function (result) {
              $scope.warehouseList = result;
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

          // 移除客户编号
          $scope.removeCNumber = function(idx) {
              $scope.selCNumbers.splice(idx, 1)
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

          /**
           * 保存角色数据
           * @return {[type]}      [description]
           */
          $scope.saveRole = function () {
              if (!$scope.form.roleName) {
                  plugMessenger.info("请输入角色名称!");
                  return;
              }
              if (!$scope.form.roleDescribe) {
                  plugMessenger.info("请输入角色描述!");
                  return;
              }
              //仓库
              $scope.form.warehouseIds = $scope.warehouseIds.join(',');
              // 客户
              $scope.form.customerIds = $scope.customers == 0 ? 0 : $scope.selCNumbers.join(',');
              // 菜单角色
              var funcs = {};
              $scope.functions.forEach(function(item) {
                  funcs[item.functionID] = item.status
                  getFuncStatus(item, funcs)
              })
              $scope.form.functions = JSON.stringify(funcs)
              if ($scope.roleId) {
                  $scope.form.role_id = $scope.roleId;
                  sysroleService.update($scope.form, function(res) {
                      if (res.changedRows) {
                          plugMessenger.success("保存成功");
                          $window.history.back();
                      }
                  })
              } else {
                  sysroleService.create($scope.form, function(res) {
                      if (!res.message) {
                          plugMessenger.success("保存成功");
                          $window.history.back();
                      }
                  })
              }
          }

          // 返回列表
          $scope.back = function () {
              $location.path('/system/rolelist');
          }

      }]);
