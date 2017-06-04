'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:Receipt2Ctrl
 * @description
 * # Receipt2Ctrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('OrderCommentsCtrl', ['$rootScope', '$scope', '$location', "$filter", '$window', 'warehouseService', 'shelfService', 'receiptService', 'plugMessenger', 'storage',
        function ($rootScope, $scope, $location, $filter, $window, warehouseService, shelfService, receiptService, plugMessenger, storage) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.dataList = [];
            $scope.customer_ids = JSON.parse($window.sessionStorage.getItem("role")).customer_ids;

            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }
            /*search bar*/
            $scope.searchBar = {
                keywordType: "orderNumber",
                keywords: $location.search().orderNumber || "",
                questionStatus: "",
                warehouseNumber: "",          
                startDate: "",
                endDate: ""
            }

            $scope.questionStatusList = [
                { key: "", value: "全部" },
                { key: "1", value: "已处理" },
                { key: "2", value: "未处理" }
            ]
            /**
             * 收货仓库
             */
            warehouseService.getWarehouse(function (result) {
                if (result.length == 1) {
                    $scope.searchBar.warehouseList = result;
                    $scope.searchBar.warehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
                } else {
                    $scope.searchBar.warehouseList = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
                }
            });
            /**
             * 查看详情
             */
            $scope.btnOpenDetail = function (type, item) {
                switch (type) {
                    case "receiptDetail":
                        $location.search({ receiptNumber: item.receiptNumber });
                        $location.path("/warehouse/receiptdetail2");
                        break;
                    case "customerDetail":
                        $location.search({ customerNumber: item.customerNumber });
                        $location.path("/customer/customerdetail");
                        break;
                }
            }

            $scope.btnAction = function (type, item) {
            switch (type) {
                case "exception":
                    $location.path('/warehouse/receiptexception');
                    break;
                case "inbound":
                    if (!!item) $location.search({ receiptNumber: item.receiptNumber, inboundStatus: item.inboundStatus });
                    $location.path('/warehouse/receiptedit2');
                    break;
                case "check":
                    if (!!item) $location.search({ receiptNumber: item.receiptNumber });
                    $location.path('/warehouse/receiptcheck2');
                    break;
                case "delete":
                    plugMessenger.confirm("请确认是否删除该记录？", function (isOK) {
                        if (isOK) {
                            // receiptService.delete({
                            //     "receiptNumber": [item.receiptNumber]
                            // }, function (result) {
                            //     if (result.success == true) {
                            //         plugMessenger.success("删除成功");
                            //         $scope.getData();
                            //     }
                            // });
                        }
                    });
                    break;
                }
            }
        }
    ]);