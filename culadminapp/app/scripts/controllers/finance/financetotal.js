'use strict'; 

/**
 * @ngdoc function
 * @name culAdminApp.controller:CustomerListCtrl
 * @description
 * # CustomerListCtrl
 * Controller of the culAdminApp 
 */
angular.module('culAdminApp')
    .controller('FinanceTotalCtrl', ['$rootScope', '$scope', '$location', "$filter", '$window', 'warehouseService', 'shelfService', 'receiptService', 'plugMessenger','orderService',
        function ($rootScope, $scope, $location, $filter, $window, warehouseService, shelfService, receiptService, plugMessenger,orderService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma' 
            ];
            $scope.path = cul.apiPath;

            $scope.compareDate = function (start) {
                var end = new Date();
                start = new Date(start);
                var starttimes = start.getTime();
                var endtimes = end.getTime();

                var intervalTime = endtimes - starttimes;//两个日期相差的毫秒数 一天86400000毫秒 
                var Inter_Days = ((intervalTime).toFixed(2) / 86400000) + 1;//加1，是让同一天的两个日期返回一天 

                return Math.floor(Inter_Days);
            }

            $scope.dataList = [];
            $scope.customer_ids = JSON.parse($window.sessionStorage.getItem("role")).customer_ids;

            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }
            /*search bar*/
            $scope.searchBar = {
                keywordType: "receiptNumber",
                keywords: $location.search().receiptNumber || "",
                warehouseNumber: "",
                sendType: "",
                inboundStatus: "",
                startDate: "",
                endDate: "",
                opened: {
                    startDate: false,
                    endDate: false
                }
            }

            $scope.searchBar.startDate = new Date();
            $scope.searchBar.endDate = new Date();

            warehouseService.getWarehouse(function (result) {
                if (result.length == 1) {
                    $scope.searchBar.warehouseList = result;
                    $scope.searchBar.warehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
                } else {
                    $scope.searchBar.warehouseList = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
                }
            });

            var _filterOptions = function () {

                var _options = {
                    "pageInfo": $scope.pagination,
                    "dateFrom": !!$scope.searchBar.startDate ? new Date($scope.searchBar.startDate) : "",
                    "dateTo": !!$scope.searchBar.endDate ? new Date($scope.searchBar.endDate) : ""
                }
                // $scope.searchBar.inboundStatus = 3
                if (!!$scope.searchBar.sendType) {
                    _options["sendType"] = $scope.searchBar.sendType;
                }
                 if (!!$scope.searchBar.orderStatus) {
                    _options["orderStatus"] = $scope.searchBar.orderStatus;
                }
                if (!!$scope.searchBar.inboundStatus) {
                    _options["inboundStatus"] = $scope.searchBar.inboundStatus;
                }
                //if (!!$scope.searchBar.shelfStatus) {
                //    _options["shelfStatus"] = $scope.searchBar.shelfStatus;
                //}
                if (!!$scope.searchBar.warehouseNumber) {
                    _options["warehouseNumber"] = $scope.searchBar.warehouseNumber;
                }
                if (!!$scope.searchBar.keywords) {
                    if ($scope.searchBar.keywordType == "customerNumber"
                        && $scope.customer_ids != undefined
                        && parseInt($scope.customer_ids) !== 0
                        && !$scope.customer_ids.split(",").includes($scope.searchBar.keywords)) {
                        $scope.searchBar.keywords = "没有查看该客户的权限,请联系统管理员";
                    }
                    _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                }
                return angular.copy(_options);
            }

            $scope.getData = function () {
                orderService.financeTotal(_filterOptions(), function (result) {
                    if(result.code == '999'){
                        plugMessenger.error(result.msg)
                    }
                    $scope.dataList = result.data;

                    $scope.totalOrderCount = 0;
                    $scope.totalOrderAmount = 0.00;
                    $scope.totalPaidAmount = 0.00;
                    if($scope.dataList && $scope.dataList.length > 0){
                        $scope.dataList.forEach(function (row) {
                            $scope.totalOrderCount += row.Count;
                            $scope.totalOrderAmount += row.tShippingFee;
                            $scope.totalPaidAmount += row.tTotalCount;
                        })
                    };

                    // console.log('///////////////////////')
                    // $scope.allTotal = result.allTotal;
                    // console.log(JSON.stringify(result))
                    // var _data = result.data;
                    // if ($scope.customer_ids != undefined && parseInt($scope.customer_ids) !== 0) {
                    //     _data = _data.filter(function (x) {
                    //         return $scope.customer_ids.toString().split(",").indexof(x.customerNumber) >= 0;
                    //     });
                    // }
                    // _data.forEach(function (e) {
                    //     console.log(e.indate);
                    //     e.day = $scope.compareDate(e.indate);
                    //     if (e.packageDescription && e.packageDescription.length > 20) {
                    //         e.packageDescriptionFlag = 1;
                    //     }
                    //     if (e.packageDescription) {

                    //         e.packageDescription1 = e.packageDescription.substring(0, 20);
                    //     }
                    //     if (e.packageNoteFlag && e.packageNote.length > 20) {
                    //         e.packageNoteFlag = 1;
                    //     }
                    //     if (e.packageNote) {
                    //         e.packageNote1 = e.packageNote.substring(0, 20);
                    //     }
                    // })

                    // $scope.dataList = _data;
                    // $scope.pagination.totalCount = result.pageInfo.totalCount;
                    // $rootScope.$emit("changeMenu");
                });
            }

            $scope.btnSearch = function () {
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }

       
       
            $scope.getData();
        }]);
