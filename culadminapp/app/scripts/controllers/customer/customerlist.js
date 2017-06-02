'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:CustomerListCtrl
 * @description
 * # CustomerListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('CustomerListCtrl', ["$scope", "$rootScope", "$location", "$filter", "customerService", "warehouseService", "plugMessenger", "$compile", "$http", '$window', 'storage',
        function ($scope, $rootScope, $location, $filter, customerService, warehouseService, plugMessenger, $compile, $http, $window, storage) {
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
                keywordType: "customerNumber",
                countryCode: "",
                accountBalance: "",
                startDate: "",
                endDate: "",
                opened: {
                    startDate: false,
                    endDate: false
                }
            }

            $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }
            
            //   storage.session.setObject("searchBar", $scope.searchBar);

            $scope.getData = function () {
                storage.session.setObject("searchBar", $scope.searchBar);
                var _options = {
                    "pageInfo": $scope.pagination,
                    "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                    "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : "",
                    "active": 1
                }
                if (!!$scope.searchBar.countryCode) {
                    _options["countryCode"] = $scope.searchBar.countryCode;
                }
                if (!!$scope.searchBar.accountBalance) {
                    _options["accountBalance"] = $scope.searchBar.accountBalance;
                }
                _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                customerService.getList(_options, function (result) {
                    console.log(result)
                    $scope.dataList = result.data;
                    $scope.pagination.totalCount = result.pageInfo.totalCount;
                    $rootScope.$emit('changeMenu');
                });
            }

            $scope.btnSearch = function () {
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }
            //去掉默認全部查詢
            // $scope.btnSearch()

            $scope.btnOpenDetail = function (customer) {
                $location.search({ customerNumber: customer.customerNumber });
                $location.path("/customer/customerdetail");
            }
            //删除用户
            $scope.btnDelete = function (customer) {
                plugMessenger.confirm("确认删除该用户吗?", function (isOk) {
                    if (isOk) {
                        customerService.delete(customer.customerNumber, function (result) {
                            if (result.success == true) {
                                plugMessenger.success("删除成功");
                                $scope.getData();
                            }
                        })
                    }
                });
            }


            $scope.vipCustomer = {
                customer: null,
                vipStatus: "",
                memo: "",
                warehouseNumber: ""
            }



            $scope.btnDeleteVIP = function (item) {
                plugMessenger.confirm("确认删除该用户吗?", function (isOk) {
                    if (isOk) {
                        customerService.vipApprove({
                            customerNumber: $scope.vipCustomer.customer.customerNumber,
                            vipStatus: "Cancelled",
                            memo: $scope.vipCustomer.memo,
                            warehouseNumber: $scope.vipCustomer.warehouseNumber || ""
                        }, function (result) {
                            if (!!result && result.success) {
                                plugMessenger.success("审核通过");
                                $(event.currentTarget).parents("#confirm-modal").modal("hide");
                            }
                        });

                    }
                })



            }


            $scope.btnApproveVIP = function (customer) {
                console.log(customer);
                $scope.vipCustomer.customer = customer;
                $scope.vipCustomer.vipStatus = "Approved";
                $scope.vipCustomer.memo = ""; //customer.vipAuditMemo;
                $scope.vipCustomer.warehouseNumber = customer.warehouseNumber || "";
                plugMessenger.template($compile($("#tplVip_approval_form").html())($scope));
            }

            $scope.warehouse = {
                list: []
            }
            warehouseService.getWarehouse(function (result) {
                if (result.length == 1) {
                    $scope.warehouse.list = result;
                    $scope.vipCustomer.warehouseNumber = $scope.warehouse.list[0].warehouseNumber;
                } else {
                    $scope.warehouse.list = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
                }
            });
            $scope.btnApprove = function (event) {
                customerService.vipApprove({
                    customerNumber: $scope.vipCustomer.customer.customerNumber,
                    vipStatus: $scope.vipCustomer.vipStatus,
                    memo: $scope.vipCustomer.memo,
                    warehouseNumber: $scope.vipCustomer.warehouseNumber || ""
                }, function (result) {
                    if (!!result && result.success) {
                        plugMessenger.success("审核通过");
                        $(event.currentTarget).parents("#confirm-modal").modal("hide");
                    }
                });
            }
            $scope.btnCancel = function (event) {
                $(event.currentTarget).parents("#confirm-modal").modal("hide");
            }
        }]);
