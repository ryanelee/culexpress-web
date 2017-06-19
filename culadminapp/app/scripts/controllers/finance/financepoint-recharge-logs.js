﻿'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:FinanceRecordRechargeLogsCtrl
 * @description
 * # FinanceDetailRechargeLogsCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('FinancePointRechargeLogsCtrl', ["$scope", "$location", "$filter", "customerService", "settlementService", "plugMessenger",
        function ($scope, $location, $filter, customerService, settlementService, plugMessenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma' 
            ];
            
            $scope.tpl_status = {
                "rechargeType": [
                    { "title": "全部", "value": "3,4" },
                    { "title": "赠送", "value": "3" },
                    { "title": "退款", "value": "4" },
                ]
            }

            $scope.dataList = [];

            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }
            /*search bar*/
            $scope.searchBar = {

                customerNumber: $location.search().customerNumber,
                selectedAll: false,
                rechargeType: "3,4",
                keywordType: "customerNumber",
                dateRange: "",
                startDate: "",
                endDate: "",
                opened: {
                    startDate: false,
                    endDate: false
                }
            }

            $scope.changeDate = function () {
                var day = 24 * 60 * 60 * 1000;
                switch ($scope.searchBar.dateRange) {
                    case "3":
                        $scope.searchBar.startDate = new Date(new Date() - day * 3);
                        $scope.searchBar.startDate.setHours(0);
                        $scope.searchBar.startDate.setMinutes(0);
                        $scope.searchBar.startDate.setSeconds(0);
                        $scope.searchBar.startDate.setMilliseconds(0);

                        $scope.searchBar.endDate = new Date();
                        break;
                    case "7":
                        $scope.searchBar.startDate = new Date(new Date() - day * 7);
                        $scope.searchBar.startDate.setHours(0);
                        $scope.searchBar.startDate.setMinutes(0);
                        $scope.searchBar.startDate.setSeconds(0);
                        $scope.searchBar.startDate.setMilliseconds(0);

                        $scope.searchBar.endDate = new Date();
                        break;
                    default:
                        $scope.searchBar.startDate = "";
                        $scope.searchBar.endDate = "";
                        break;
                }
            }

            var _filterOptions = function () {
                var _options = {
                    "pageInfo": $scope.pagination,
                    "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                    "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : "",
                }
                if (!!$scope.searchBar.rechargeType) {
                    _options["operationTypeList"] = $scope.searchBar.rechargeType.split(",");
                }
                if (!!$scope.searchBar.customerNumber) {
                    _options["customerNumber"] = $scope.searchBar.customerNumber;
                }
                if (!!$scope.searchBar.keywords) {
                    _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                }
                return angular.copy(_options);
            }

            $scope.getData = function () {
                console.log("这里有一个bug")
                var _options = _filterOptions();
                customerService.financeLogList(angular.copy(_options), function (result) {
                    $scope.allTotal = result.allTotal;
                    $scope.dataList = result.data;
                    $scope.pageInfo = result.pageInfo;
                    $scope.pagination.totalCount = $scope.pageInfo.totalCount;
                    console.log(result)
                    // $scope.pagination.totalCount = result.pageInfo.totalCount;
                });
            }

            $scope.btnSearch = function () {
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }

            // $scope.getData();
        }]);
