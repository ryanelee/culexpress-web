'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:SysRoleEditCtrl
 * @description
 * # SysRoleEditCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseListCtrl', ['$scope', '$location', '$window', 'sysroleService', 'customerService', 'warehouseService', 'plugMessenger',
      function ($scope, $location, $window, sysroleService, customerService, warehouseService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];         

          $scope.dataList = [];
          /*search bar*/
          $scope.searchBar = {
              country: "",
              status: "",
              keywordType: ""            
          }
          $scope.pagination = {
              pageSize: "20",
              pageIndex: 1,
              totalCount: 0
          }

          var _filterOptions = function () {
            var _options = {
                "pageInfo": $scope.pagination
            }

            if (!!$scope.searchBar.warehouseType) {
                _options["country"] = $scope.searchBar.country;
            }
            if (!!$scope.searchBar.status) {
                _options["status"] = $scope.searchBar.status;
            }
            if (!!$scope.searchBar.keywords) {
                // if ($scope.searchBar.keywordType == "customerNumber"
                //     && $scope.customer_ids != undefined
                //     && parseInt($scope.customer_ids) !== 0
                //     && !$scope.customer_ids.split(",").includes($scope.searchBar.keywords)) {
                //     $scope.searchBar.keywords = "没有查看该客户的权限,请联系统管理员";
                // }

                _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
            }
            return angular.copy(_options);
          }

        //   $scope.dataList = [];
          $scope.getData = function () {
              warehouseService.getWarehouse(_filterOptions(), function (result) {
                  console.log(result);
                  $scope.dataList = result;
                  console.log("********************************");
                  console.log($scope.dataList);
                  $scope.pagination.totalCount = 3;
                  //result.data.pageInfo.totalCount;
                //   $rootScope.$emit("changeMenu");
              });
          }
          $scope.btnSearch = function () {
            //   $scope.selectedListCache = [];
              $scope.dataList = [];
              $scope.pagination.pageIndex = 1;
              $scope.pagination.totalCount = 0;
              $scope.getData();
          }

          // 新建仓库跳转
          $scope.addWarehouse = function () {
              $location.path('/system/editwarehouse').search({});
          }
          // 修改仓库
          $scope.edit = function (id) {
              $location.path('/system/editwarehouse').search({ groupId: id });
          }
          // 返回列表
          $scope.back = function () {
              //$location.path('/system/rolelist');
              $window.history.back();
          }
      }]);

angular.module('culAdminApp')
  .controller('EditWarehouseCtrl', ['$scope', '$location', '$window', 'sysroleService', 'customerService', 'warehouseService', 'plugMessenger',
      function ($scope, $location, $window, sysroleService, customerService, warehouseService, plugMessenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          $scope.btnSearch = function () {

               warehouseService.getWarehouse(function(data){
                  console.log('data')
                  console.log(data)
              })
          }
          
          // 提交表单的数据
          $scope.form = {
              status: '1',
              warehouseType:'0',
              isTaxFree: '0'
          }
          // 返回列表
          $scope.back = function () {
              $location.path('/system/warehouselist').search({});
          }

          /**
           * 保存仓库数据
           * @return {[type]}      [description]
           */
          $scope.saveWarehouse = function () {
              if (!$scope.form.warehouseShortName) {
                  plugMessenger.info("请输入仓库简称!");
                  return;
              }
              
              if (!$scope.form.warehouseName) {
                  plugMessenger.info("请输入仓库名!");
                  return;
              }
              if (!$scope.form.contactName) {
                  plugMessenger.info("请输入联系人!");
                  return;
              }
              if (!$scope.form.contactPhoneNumber) {
                  plugMessenger.info("请输入联系电话!");
                  return;
              }
              if (!$scope.form.address1) {
                  plugMessenger.info("请输入地址1!");
                  return;
              }
              if (!$scope.form.city) {
                  plugMessenger.info("请输入城市!");
                  return;
              }
              if (!$scope.form.zipCode) {
                  plugMessenger.info("请输入邮箱!");
                  return;
              }
              if (!$scope.form.stateOrProvince) {
                  plugMessenger.info("请省/州!");
                  return;
              }            

              warehouseService.createWarehouse($scope.form, function(res) {
                  if (!res.message) {
                      plugMessenger.success("保存成功");
                      $window.history.back();
                  }
              })
         }   
      }]);

