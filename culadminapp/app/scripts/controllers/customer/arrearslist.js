'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:ArrearslistCtrl
 * @description
 * # ArrearslistCtrl
 * Controller of the culAdminApp
 */
var culAdminApp = angular.module('culAdminApp');
culAdminApp.controller('ArrearslistCtrl', ["$scope", "$rootScope", "$location", "$filter", "customerService", "warehouseService", "plugMessenger", "$compile", "$http","storage",
    function ($scope, $rootScope, $location, $filter, customerService, warehouseService, plugMessenger, $compile, $http,storage) {
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
            customerService.getArrearsList(_options, function (result) {

                $scope.dataList = result.data;
                //console.log($scope.dataList)
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
        // $scope.btnSearch()

        $scope.btnOpenDetail = function (payMessage, location) {
            if (location === 'customerdetail') {
                $location.search({ customerNumber: payMessage.customerNumber });
                $location.path("/customer/customerdetail");
            } else if (location === 'orderdetail') {
                $location.search({ orderNumber: payMessage.orderNumber });
                $location.path("/order/orderdetail");
            } else {
                $location.search({ payMessage: JSON.stringify(payMessage) });
                $location.path("/customer/paydetail");
            }
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
    }
]);


culAdminApp.controller('PayDetailCtrl', ["$scope", "$rootScope", "$location", "$filter", "customerService", "warehouseService", "plugMessenger", "$compile", "$http", "orderService", "$window",
    function ($scope, $rootScope, $location, $filter, customerService, warehouseService, plugMessenger, $compile, $http, orderService, $window) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.data = JSON.parse($location.search().payMessage)
        $scope.data.balance = $scope.data.shippingFee + $scope.data.tip - $scope.data.usedPoint;
        //    $rootScope.getUser
        // 订单编号: AB69901000001 扣款人: cz001 备注: 获得客户批准扣款。
        $scope.back = function () {
            $window.sessionStorage.setItem("historyFlag", 1);
            window.history.back()
        }
        //console.log($scope.data);
        $scope.pay = function () {

            $scope.data.memo = "订单编号: " + $scope.data.orderNumber + " 扣款人: " + $rootScope.userInfo.userName + " 备注: "
            if ($scope.data.orderStatus == 'Arrears') {
                $scope.data.memo += "运费不足"
            }
            // if (!$scope.data.remark) {
            //     plugMessenger.success("审核通过");
            // }
            if ($scope.data.remark) {
                $scope.data.memo = $scope.data.memo + $scope.data.remark
            }

            plugMessenger.confirm("确认扣款吗？", function (isOK) {
                if (isOK) {
                    orderService.adminPaymentOrder($scope.data).then(function (data) {
                        if (data.status == 200) {
                            plugMessenger.success("扣款成功");
                            $location.path('/customer/arrearslist')
                        }
                    })
                }
            })
        }
    }
]);