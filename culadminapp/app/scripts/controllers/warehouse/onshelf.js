'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseOnShelfCtrl
 * @description
 * # WarehouseOnShelfCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('WarehouseOnShelfCtrl', ['$window', '$rootScope', '$scope', '$location', 'warehouseService', 'shelfService',
        function ($window, $rootScope, $scope, $location, warehouseService, shelfService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.dataList = [];
            $scope.warehouseList = [];
            $scope.customer_ids = JSON.parse($window.sessionStorage.getItem("role")).customer_ids;

            $scope.isUnusual = $location.search().isUnusual;

            $scope.isExpecial = function () {
                if ($scope.isUnusual == 1) {
                    var staffFlag = $scope.data.shelfNumber.substring(0, 1);
                    if (staffFlag != 'D') {
                        $scope.data.shelfNumber = "";
                        plugMessenger.error("员工包裹必须以D开头");
                    }
                }
                if ($scope.isUnusual == 1) {
                    var staffFlag = $scope.data.shelfNumber.substring(0, 1);
                    if (staffFlag != 'C') {
                        $scope.data.shelfNumber = "";
                        plugMessenger.error("异常包裹必须以C开头");
                    }
                }
            }

            $scope.getWarehouseName = function (warehouseNumber) {
                var warehouse = _.findWhere($scope.warehouseList, { warehouseNumber: warehouseNumber });
                return !!warehouse ? warehouse.warehouseName : "";
            }

            /*search bar*/
            $scope.searchBar = {
                keywordType: "receiptNumber",
                warehouseNumber: "",
                sendType: "",
                shelfStatus: "",


                dateRange: "",
                startDate: "",
                endDate: "",
                opened: {
                    startDate: false,
                    endDate: false
                }
            }

            $scope.pagination = {
                pageSize: "20",
                pageIndex: 1,
                totalCount: 0
            }
             $scope.sendTypes = [
                      { key: "",value:"全部"},
                      { key: "1",value:"寄送库存"},
                      { key: "2",value:"海淘包裹"},
                      { key: "3",value:"异常包裹"},
                      { key: "4",value:"员工包裹"},
                    ]

            warehouseService.getWarehouse(function (result) {
                if (result.length == 1) {
                    $scope.searchBar.warehouseList = result;
                    $scope.searchBar.warehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
                } else {
                    $scope.searchBar.warehouseList = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
                }
                $scope.warehouseList = result;
            });

            var _filterOptions = function () {
                var _options = {
                    "pageInfo": $scope.pagination,
                    "inboundDateFrom": !!$scope.searchBar.startDate ? new Date($scope.searchBar.startDate) : "",
                    "inboundDateTo": !!$scope.searchBar.endDate ? new Date($scope.searchBar.endDate) : "",
                }

                if (!!$scope.searchBar.sendType) {
                    _options["sendType"] = $scope.searchBar.sendType;
                }
                if (!!$scope.searchBar.isUnusual) {
                    _options["isUnusual"] = $scope.searchBar.isUnusual;
                }
                if (!!$scope.searchBar.shelfStatus) {
                    _options["shelfStatus"] = $scope.searchBar.shelfStatus;
                }
                if (!!$scope.searchBar.warehouseNumber) {
                    _options["warehouseNumber"] = $scope.searchBar.warehouseNumber;
                }
                if (!!$scope.searchBar.keywords) {
                    if ($scope.searchBar.keywordType == "customerNumber" 
                        && $scope.customer_ids != undefined
                        && parseInt($scope.customer_ids) !== 0 &&
                        !$scope.customer_ids.split(",").includes($scope.searchBar.keywords)) {
                        $scope.searchBar.keywords = "没有查看该客户的权限,请联系统管理员";
                    }

                    _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
                }
                return angular.copy(_options);
            }

            $scope.getData = function () {
                shelfService.getTransportList(_filterOptions(), function (result) {
                    var __data = result.data;
                    var _data = [];                 

                    if (!$scope.searchBar.isUnusual && $scope.searchBar.sendType == 2) {
                        __data.map(function (e) {
                            if (e.isUnusual != 1 && e.isUnusual != 2) {
                                _data.push(e);
                            }
                        })
                    } else {
                        _data = __data;
                    }
                   
                    _data.forEach(function (e) {
                        if (e.sendType == 2 && e.isUnusual == 1) {
                              e._sendType = "员工包裹"

                        }
                        if (e.sendType == 2 && e.isUnusual == 2) {
                            e._sendType = "异常包裹"
                        }
                    })
                    if ($scope.searchBar.isUnusual == 2) {
                        $scope.searchBar.sendType = $scope.sendTypes[3].key;                       
                    }
                      if ($scope.searchBar.isUnusual == 1) {
                        $scope.searchBar.sendType =  $scope.sendTypes[4].key;
                    }
                    if ($scope.customer_ids != undefined && parseInt($scope.customer_ids) !== 0) {
                        _data = _data.filter(function (x) {
                            return $scope.customer_ids.split(",").includes(x.customerNumber);
                        });
                    }

                    $scope.dataList = _data;

                    $scope.pagination.totalCount = result.pageInfo.totalCount;
                    $rootScope.$emit("changeMenu");
                });
            }
            $scope.getData();

            $scope.btnSearch = function () {  
                $scope.searchBar.isUnusual = 0
                if ($scope.searchBar.sendType == 3) {
                    $scope.searchBar.isUnusual = 2;
                    $scope.searchBar.sendType = 2;
                }
                if ($scope.searchBar.sendType == 4) {
                    $scope.searchBar.isUnusual = 1;
                    $scope.searchBar.sendType = 2;
                }
                $scope.selectedListCache = [];
                $scope.dataList = [];
                $scope.pagination.pageIndex = 1;
                $scope.pagination.totalCount = 0;
                $scope.getData();
            }

            $scope.btnAction = function (type, item) {
                switch (type) {
                    case "receipt":
                        if (!!item) $location.search({ receiptNumber: item.receiptNumber });
                        // $location.path("/warehouse/receipt2");
                        $location.path("/warehouse/receiptedit2");


                        break;
                    case "shelf":
                        if (!!item) $location.search({ receiptNumber: item.receiptNumber });
                        $location.path("/warehouse/shelf");
                        break;
                    case "onshelf":
                        if (!!item && item.sendType == 2) $location.search({ receiptNumber: item.receiptNumber, isUnusual: item.isUnusual });                   
                        $location.path("/warehouse/onshelfdetail");                    
                        break;
                }
            }

            $scope.btnPrint = function (warehouseNumber) {
                $scope.$broadcast("print-unshelf.action", warehouseNumber);
            }
        }
    ]);