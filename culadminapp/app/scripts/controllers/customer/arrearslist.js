'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ArrearslistCtrl
 * @description
 * # ArrearslistCtrl
 * Controller of the culAdminApp
 */
var culAdminApp = angular.module('culAdminApp');
culAdminApp.controller('ArrearslistCtrl', ["$scope", "$rootScope", "$location", "$filter", "customerService", "warehouseService", "plugMessenger", "$compile", "$http",
    function ($scope, $rootScope, $location, $filter, customerService, warehouseService, plugMessenger, $compile, $http) {
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

        $scope.getData = function () {
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
            customerService.getArrearsList(_options, function (result) {
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

        $scope.btnOpenDetail = function (payMessage) {
            console.log(payMessage);
            $location.search({ payMessage: JSON.stringify(payMessage) });
            $location.path("/customer/paydetail");
        }
        //删除用户
        // $scope.btnDelete = function (customer) {
        //     plugMessenger.confirm("确认删除该用户吗?", function (isOk) {
        //         if (isOk) {
        //             customerService.delete(customer.customerNumber, function (result) {
        //                 if (result.success == true) {
        //                     plugMessenger.success("删除成功");
        //                     $scope.getData();
        //                 }
        //             })
        //         }
        //     });
        // }


        $scope.vipCustomer = {
            customer: null,
            vipStatus: "",
            memo: "",
            warehouseNumber: ""
        }
        $scope.btnApproveVIP = function (customer) {
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


culAdminApp.controller('PayDetailCtrl', ["$scope", "$rootScope", "$location", "$filter", "customerService", "warehouseService", "plugMessenger", "$compile", "$http", "orderService",
    function ($scope, $rootScope, $location, $filter, customerService, warehouseService, plugMessenger, $compile, $http, orderService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.data = JSON.parse($location.search().payMessage)
        console.log($scope.data);
        $scope.data.balance = $scope.data.shippingFee + $scope.data.tip

        //    $rootScope.getUser
        console.log($rootScope.userInfo)
        // 订单编号: AB69901000001 扣款人: cz001 备注: 获得客户批准扣款。
        $scope.back = function () {
            window.history.back()
        }
        $scope.pay = function () {

            $scope.data.memo = "订单编号: " + $scope.data.orderNumber + " 扣款人: " + $rootScope.userInfo.userName + " 备注: "
            // if (!$scope.data.remark) {
            //     plugMessenger.success("审核通过");
            // }
            if ($scope.data.remark) {
                $scope.data.memo = $scope.data.memo + $scope.data.remark
            }
            orderService.adminPaymentOrder($scope.data).then(function (data) {
                if (data.status == 200) {
                    plugMessenger.success("扣款成功");
                    $location.path('/customer/arrearslist')
                }
            })

        }






    }]);