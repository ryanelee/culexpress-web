'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseBucketCtrl
 * @description
 * # WarehouseBucketCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseBucketCtrl', ['$scope', '$location', '$window', 'warehouseService', 'bucketService',"storage",
        function($scope, $location, $window, warehouseService, bucketService,storage) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.dataList = [];

            //新导出逻辑
            var _token = sessionStorage.getItem("token");
            _token = !!_token ? encodeURIComponent(_token) : null
            $("#form_export_order").attr("action", cul.apiPath + "/outboundorderlist/list/export?Token=" + _token);
            $("#form_exportHT").attr("action", cul.apiPath + "/order/list/export/ht?Token=" + _token);

            /*search bar*/
            $scope.searchBar = {
                keywordType: "bucketNumber", 
                keywords: $location.search().bucketNumber || "",           
                warehouseNumber: "",
                status: "",
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
            //  storage.session.setObject("searchBar", $scope.searchBar);

            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }

            warehouseService.getWarehouse(function(result) {
                if (result.length == 1) {
                    $scope.searchBar.warehouseList = result;
                    $scope.searchBar.warehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
                } else {
                    $scope.searchBar.warehouseList = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
                }
            });

            var _filterOptions = function() {
                var _options = {
                    "pageInfo": $scope.pagination,
                    "indateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                    "indateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : "",
                }  

                if (!!$scope.searchBar.warehouseNumber) {
                    _options["warehouseNumber"] = $scope.searchBar.warehouseNumber;
                }
                if (!!$scope.searchBar.status) {
                    _options["status"] = $scope.searchBar.status;
                }
                if (!!$scope.searchBar.keywords) {
                    _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                }
                return angular.copy(_options);
            }

            $scope.getData = function () {  
                var _options = _filterOptions();  
                storage.session.setObject("searchBar", $scope.searchBar);         
                bucketService.getList(_filterOptions(), function (result) {
                    $scope.dataList = result.data;
                    $scope.pagination.totalCount = result.pageInfo.totalCount;
                    var _trackingNumbers = [];
                    $.each($scope.dataList, function (i, item) {
                        item.totalWeight = 0;
                        item.detail.forEach(function (e) {
                            e.totalWeight = 0;
                            if (e.boxes && e.boxes[0]) {
                                e.boxes.forEach(function (e1) {
                                    if (e1.bags && e1.bags[0]) {
                                        e1.bags.forEach(function (e2) {
                                            e2.totalWeight = 0;
                                            if (e2.packages && e2.packages[0]) {
                                                e2.packages.forEach(function (e3) {
                                                    item.totalWeight += e3.weight;   
                                                    _trackingNumbers.push(e3.trackingNumber);                                           
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                if (e.bags && e.bags[0]) {
                                    e.bags.forEach(function (e2) {
                                        e2.totalWeight = 0;
                                        if (e2.packages && e2.packages[0]) {
                                            e2.packages.forEach(function (e3) {
                                                item.totalWeight += e3.weight;
                                                _trackingNumbers.push(e3.trackingNumber);                                    
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    });
                    if (_trackingNumbers.length > 0) {
                        _options.trackingNumber = _trackingNumbers.join(",");
                        _options.outBoundTrackingNumber = _trackingNumbers.join("\r\n");
                    }
                    //新导出逻辑
                    $scope.exportOptions = $.extend({ token: _token }, _options);
                });
            }

            $scope.btnSearch = function () {
                $scope.selectedListCache = [];
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }
           
            $scope.btnAction = function (type, item) {
                switch (type) {
                    case "create":
                        $location.search({ createBucket: 1});
                        $location.path("/warehouse/bucketedit");
                        break;
                    case "edit":
                        if (!!item) $location.search({ bucketNumber: item.bucketNumber, editBucket: 1});
                        $location.path("/warehouse/bucketedit");
                        break;
                    case "detail":
                        if (!!item) $location.search({ bucketNumber: item.bucketNumber, readonly: 1 });
                        $location.path("/warehouse/bucketedit");
                        break;
                    case "editFlightNo":
                        if (!!item) $location.search({ bucketNumber: item.bucketNumber, editFlightNo: 1 });
                        $location.path("/warehouse/bucketedit");
                        break;
                }
            }

            $scope.btnPrev = function () {
                $window.sessionStorage.setItem("historyFlag", 1);                 
                $window.history.back();
            }
      }]);
