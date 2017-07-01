'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:OrderListCtrl
 * @description
 * # OrderListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('DeleteReceiptLogCtrl', ["$timeout", "$window", "$scope", "$rootScope", "$location", "$filter", "orderService", "warehouseService", "plugMessenger", "storage",
        function ($timeout, $window, $scope, $rootScope, $location, $filter, orderService, warehouseService, plugMessenger, storage) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.dataList = [];
            $scope.orderNumberList = [];
            //新导出逻辑
            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }
            /*search bar*/
            $scope.searchBar = {
                selectedAll: false,
                keywordType: "customerNumber",
                orderStatus: "",
                printStatus: "",
                warehouseNumber: "",
                shipServiceId: 0,
                isFastOrder: undefined,
                startDate: "",
                startTime_HH: "0",
                startTime_mm: "",
                startTime_ss: "",
                endDate: "",
                endTime_HH: "0",
                endTime_mm: "",
                endTime_ss: "",
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



            var _filterOptions = function () {

                var _options = {
                    "pageInfo": $scope.pagination,
                    "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate : "",
                    "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate : "",
                }
                if (!!$scope.searchBar.keywords) {
                    _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                    if ($scope.searchBar.keywordType == 'orderNumber') {
                        if ($scope.searchBar.keywords.indexOf('\n') >= 0) {
                            _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords.split('\n')
                        }

                    }
                }
                return angular.copy(_options);
            }

            $scope.getData = function () {
                storage.session.setObject("searchBar", $scope.searchBar);

                var _options = _filterOptions();
                //console.log(_options);
                warehouseService.getDeleteReceiptLog(angular.copy(_options), function (result) {
                      $scope.dataList = result.data.data;
                    $scope.pagination.totalCount = result.data.count;

                })
            }

            $scope.btnSearch = function () {

                $scope.selectedListCache = [];
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }



        }
    ]);