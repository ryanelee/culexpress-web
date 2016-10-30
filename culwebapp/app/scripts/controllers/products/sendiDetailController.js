'use strict';

angular
    .module('culwebApp')
    .controller('SendiDetailCtrl', ['$scope', '$compile', '$timeout', '$state', '$stateParams', '$filter', 'OrderSvr',
        function ($scope, $compile, $timeout, $state, $stateParams, $filter, orderSvr) {
            var source = $scope.source = {
                warehouses: []
            };


            var model = $scope.model = {};


            function loadSourceData() {
                orderSvr
                    .getWarehouses()
                    .then(function (result) {
                        if (!window.sessionStorage.getItem('cache_warehouse')) {
                            window.sessionStorage.setItem('cache_warehouse', JSON.stringify(result.data));
                        }
                        source.warehouses = $filter('filter')(result.data, function (dataItem) { return dataItem.warehouseShortName === 'OR' });
                    });
            }

            loadSourceData();

            function loadDetailData() {
                orderSvr.getTransportItem($stateParams.id)
                    .then(function (result) {
                        switch (result.data.sendType) {
                            case 1: result.data._sendType = "寄送库存"; break;
                            case 2: result.data._sendType = "海淘包裹"; break;
                        }
                        switch (result.data.inboundStatus) {
                            case 0: result.data._inboundStatus = "等待登记"; break;
                            case 1: result.data._inboundStatus = "等待清点"; break;
                            case 2: result.data._inboundStatus = "部分收货"; break;
                            case 3: result.data._inboundStatus = "已收货"; break;
                            default: result.data._inboundStatus = "所有"; break;
                        }
                        switch (result.data.shelfStatus) {
                            case 0: result.data._shelfStatus = "未上架"; break;
                            case 1: result.data._shelfStatus = "部分上架"; break;
                            case 2: result.data._shelfStatus = "已上架"; break;
                        }
                        $scope.model = result.data;
                    });
            }
            loadDetailData();


            $scope.redirectToList = function () {
                $state.go('customer.sendinventory');
            }

            $scope.btnPrint = function (item) {

            }
        }
    ]);