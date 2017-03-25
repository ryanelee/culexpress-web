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

                if (!!$scope.searchBar.countryCode) {
                    _options["countryCode"] = $scope.searchBar.countryCode;
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
                console.log("options"+JSON.stringify(_options));
                return angular.copy(_options);
            }

            //   $scope.dataList = [];
            $scope.getData = function () {
                warehouseService.getWarehouse(_filterOptions(), function (result) {
                    console.log(result);
                  $scope.dataList = result.data.data;
                    $scope.pagination.totalCount = result.data.pageInfo.totalCount;
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
            $scope.getData();

            // 新建仓库跳转
            $scope.addWarehouse = function () {

                $location.path('/system/editwarehouse').search({});
            }
            // 修改仓库
            $scope.edit = function (item) {
                // console.log(item);
                if (!!item) $location.search({ item: item, flag: "update" });
                $location.path('/system/editwarehouse')
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
            $scope.form = {};

            $scope.data = $location.search().item;

            if ($scope.data) {
                $scope.flag = '1'
                $scope.form.isTaxFree = $scope.data.isTaxFree,
                    $scope.form.status = $scope.data.status,
                    $scope.form.warehouseNumber = $scope.data.warehouseNumber,
                    $scope.form.warehouseShortName = $scope.data.warehouseShortName,
                    $scope.form.contactPhoneNumber = $scope.data.contactPhoneNumber,
                    $scope.form.warehouseName = $scope.data.warehouseName,
                    $scope.form.warehouseType = $scope.data.warehouseType,
                    $scope.form.contactName = $scope.data.contactName,
                    $scope.form.contactPhoneNumber = $scope.data.contactPhoneNumber,
                    $scope.form.address1 = $scope.data.address1,
                    $scope.form.address2 = $scope.data.address2,
                    $scope.form.city = $scope.data.city,
                    $scope.form.zipcode = $scope.data.zipcode,
                    $scope.form.status = $scope.data.status,
                    $scope.form.stateOrProvince = $scope.data.stateOrProvince,
                    $scope.form.countryCode = $scope.data.countryCode,
                    $scope.form.lastEditUserName = $scope.data.lastEditUserName,
                    $scope.form.status = $scope.data.status
            }
            $scope.btnSearch = function () {

                warehouseService.getWarehouse(function (data) {
                    console.log('data')
                    console.log(data)
                })
            }

            // 提交表单的数据
            // $scope.form = {
            //     warehouseShortName: '',
            //     warehouseName: '',
            //     status: '1',
            //     warehouseType: '0',
            //     isTaxFree: '0',
            //     contactName: '',
            //     contactPhoneNumber: '',
            //     address1: '',
            //     address2: '',
            //     city: '',
            //     zipCode: '',
            //     stateOrProvince: '',
            //     countryCode: ''
            // }
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


                warehouseService.createWarehouse($scope.form, function (res) {
                    if (!res.message) {
                        plugMessenger.success("保存成功");
                        $location.path('/system/warehouselist')
                        // $window.history.back();
                    }
                })






            }
            //更新仓库
            $scope.update = function () {
                warehouseService.updateWarehouse($scope.form, function (res) {
                    console.log(res);
                    if (res.code == '000') {
                        plugMessenger.success("更新成功");
                        $location.path('/system/warehouselist')
                        // $window.history.back();
                    }else{
                       plugMessenger.success("更新失败"+req.msg); 
                    }
                })
            }

        }]);

