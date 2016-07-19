'use strict';

angular
    .module('culwebApp')
    .controller('ShippingNoticeController', ['$scope', '$rootScope', '$filter', '$stateParams', 'OrderSvr', '$state', 'SweetAlert',
        function ($scope, $rootScope, $filter, $stateParams, orderSvr, $state, SweetAlert) {
            $scope.$root.orderOptions = {};
            $scope.$root.wizardOptions = {};
            $scope.warehouses = [];
            orderSvr
                .getWarehouses()
                .then(function (result) {
                    if (!window.sessionStorage.getItem('cache_warehouse')) {
                        window.sessionStorage.setItem('cache_warehouse', JSON.stringify(result.data));
                    }
                    //暂时只支持OR仓库
                    $scope.warehouses = $filter('filter')(result.data, function (item) { return item.stateOrProvince === 'OR'; });

                    //$scope.warehouses = result.data;
                    if ($scope.warehouses) {
                        $scope.retrieveWarehouseNumber = $scope.warehouses[0].warehouseNumber;
                    }
                });

            $scope.shippingCarriers = orderSvr.shippingCarriers
            $scope.selectedshippingCarrier = orderSvr.shippingCarriers[0];



            $scope.shippingNotice = {};

            $scope.submitToFastOrder = function (packageNumber) {
                $scope.shippingNotice.warehouseNumber = $scope.retrieveWarehouseNumber;
                $scope.shippingNotice.transactionNumber = packageNumber;
                $scope.shippingNotice.inboundDate=new Date().toISOString();
                $scope.shippingNotice.warehouseName=$scope.warehouses[0].warehouseName;
                orderSvr.selectedShippingItems = [$scope.shippingNotice];
                $state.go('customer.submitorder');
            }



            $scope.addShippingNotice = function () {

                if (!$scope.shippingNotice.trackingNumber) { SweetAlert.swal('提醒', '请输入运单号.', 'warning'); return false; }
                if (!$scope.shippingNotice.packageDescription) { SweetAlert.swal('提醒', '请输入运单内容.', 'warning'); return false; }
                if (!!$scope.shippingNotice.isFastOrder) {
                    if (!$scope.shippingNotice.packageWeight) { SweetAlert.swal('提醒', '极速原箱订单必须输入包裹重量.', 'warning'); return false; }
                }

                orderSvr
                    .addShippingNotice({
                        customerNumber: $rootScope.currentUser.customerNumber,
                        carrierName: $scope.selectedshippingCarrier.name,
                        trackingNumber: $scope.shippingNotice.trackingNumber,
                        warehouseNumber: $scope.retrieveWarehouseNumber,
                        packageDescription: $scope.shippingNotice.packageDescription,
                        packageNote: $scope.shippingNotice.packageNote,
                        packageWeight:$scope.shippingNotice.packageWeight
                    })
                    .then(function (result) {
                        if (!!result.data.transactionNumber) {
                            if (!!$scope.shippingNotice.isFastOrder) {
                                return $scope.submitToFastOrder(result.data.transactionNumber);
                            } else {
                                $state.go('customer.shippingnoticelist');
                            }
                        }
                    },
                    function (result) {
                        if (result.data && result.data.message) {
                            SweetAlert.swal('错误', result.data.message, 'error');
                        }
                        else {
                            SweetAlert.swal('错误', '添加失败.', 'error');
                        }
                    });
            };


            $scope.reset = function () {
                if (orderSvr.warehouses && orderSvr.warehouses.length)
                    $scope.retrieveWarehouseNumber = orderSvr.warehouses[0].warehouseNumber;

                $scope.selectedshippingCarrier = orderSvr.shippingCarriers[0];
                $scope.shippingNotice.trackingNumber = '';
                $scope.shippingNotice.packageDescription = '';
                $scope.shippingNotice.packageNote = '';
                $scope.shippingNotice.packageWeight = '';
                $scope.shippingNotice.isFastOrder = false;
            };

            $scope.pagedOptions = {
                total: 0,
                size: 10
            }


            $scope.searchKeyItems = [
                {
                    key: 'trackingNumber',
                    text: '预报快递单号'
                }
            ];

            var queryPara = $scope.queryPara = {
                searchKeyName: 'trackingNumber',
                status: $stateParams.status || '',
            };

            $scope.shippingNoticeList = [];
            $scope.initShippingNoticeList = function (index, para) {
                if ($scope.$root.currentUser.userName === undefined) return;
                var status = $scope.queryPara.status,
                    customerNumber = $rootScope.currentUser.customerNumber;

                $scope.pagedOptions.index = index;
                orderSvr
                    .retrieveShippingNoticeList(index, $.extend({ status: status, customerNumber: customerNumber }, para))
                    .then(function (result) {
                        $scope.pagedOptions.total = result.data.pageInfo.totalCount;
                        $scope.shippingNoticeList = result.data.data;
                    },
                    function (err) {

                    });
            };
            $scope.initShippingNoticeList();

            $scope.onPaged = function (pageIndex) {
                $scope.initShippingNoticeList(pageIndex);
            }

            $scope.rangSearch = function (rangeItem) {

                $scope.queryPara = {
                    searchKeyName: 'trackingNumber',
                    status: ''
                };

                $scope.initShippingNoticeList(1, angular.extend($scope.queryPara, {
                    dateFrom: rangeItem.begin,
                    dateTo: rangeItem.end
                }));
            }

            $scope.searchList = function () {
                $scope.initShippingNoticeList(1, $scope.queryPara);
            }

            $scope.changeQueryStaus = function (status) {
                $scope.queryPara.status = status || '';
                $scope.initShippingNoticeList(1, $scope.queryPara);
            }


            $scope.selectedAll = false;
            $scope.selectAll = function () {
                for (var i = 0, ii = $scope.shippingNoticeList.length; i < ii; i++) {
                    var shippingItem = $scope.shippingNoticeList[i];
                    //if (shippingItem.status === 'Inbound') {
                    shippingItem.checked = $scope.selectedAll;
                    //}
                }
            }
            var isSafeSelected = function () {
                var canSelectItems = $filter('filter')($scope.shippingNoticeList, function (item) { return item.status === 'Inbound'; }),
                    selectedItems = $filter('filter')(canSelectItems, function (item) { return item.checked === true; }),
                    checkedWarehouseNumber;

                if (!selectedItems[0]) return true;
                if (selectedItems.length <= 0) return 0;
                checkedWarehouseNumber = selectedItems[0].warehouseNumber;

                for (var i = 0, ii = selectedItems.length; i < ii; i++) {
                    if (selectedItems[i].warehouseNumber != checkedWarehouseNumber) {
                        return false;
                    }
                }
                return true;
            }

            var checkSelected = function () {
                var result = isSafeSelected();
                if (result === 0) {
                    SweetAlert.swal('提醒', '请至少选择一条数据。', 'warning');
                    return false;
                }
                else if (result === false) {
                    SweetAlert.swal('提醒', '您选择的包裹不在同一个仓库，无法提交订单。不同仓库的包裹请分别提交订单。', 'warning');
                    return false;
                }
                return true;
            }

            $scope.selectItem = function (shippingNoticeItem) {
                if (!!shippingNoticeItem.checked) {
                    shippingNoticeItem.checked = checkSelected();
                }

                var canSelectItems = $filter('filter')($scope.shippingNoticeList, function (item) { return item.status === 'Inbound'; }),
                    selectedItems = $filter('filter')(canSelectItems, function (item) { return item.checked === true; });
                $scope.selectedAll = canSelectItems.length === selectedItems.length;
            }


            $scope.deleteShippingNotice = function (item) {
                SweetAlert.swal({
                    title: "请确认是否要删除该记录?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                }, function (isConfirm) {
                    if (isConfirm) {
                        orderSvr
                            .deleteShippingNotice(item.trackingNumber)
                            .then(function (result) {
                                if (!!result.data.success) {
                                    var index = $scope.shippingNoticeList.indexOf(item);
                                    $scope.shippingNoticeList.splice(index, 1);
                                }

                                SweetAlert.swal('提示', '删除成功.', 'success');
                            },
                            function (result) {
                                if (result.data.message) {
                                    SweetAlert.swal('错误', result.data.message, 'error');
                                }
                            });
                    }
                });

            };


            var checkAndGetSelect = function (isFastOrder) {
                var shippingList = $scope.shippingNoticeList, selectedItems = [];
                if (!shippingList.length) return false;
                for (var i = 0, ii = shippingList.length; i < ii; i++) {
                    var shippItemData = shippingList[i];
                    shippItemData.orderItems = [{ goodsCategory: '' }];
                    if (shippItemData.checked) {
                        if (!isFastOrder) {
                            if (shippItemData.status !== 'Inbound') {
                                SweetAlert.swal('提醒', '普通订单只能提交已入库的货物信息.', 'warning');
                                return false;
                            }
                        }
                        selectedItems.push(shippItemData);
                    }
                }

                if (!selectedItems.length) {
                    SweetAlert.swal('提醒', '请选择需要提交的货物信息.', 'warning');
                    return false;
                }
                return selectedItems;
            }
            //暂留未用
            var getSelectedItemsId = function (selectedArr) {
                var idArrr = [];
                for (var i = 0, ii = (selectedArr || []).length; i < ii; i++) {
                    idArrr.push(selectedArr[i].transactionNumber);
                }
                return idArrr.join(',');
            }
            orderSvr.selectedShippingItems = [];
            $scope.redirectToSubmitOrder = function () {
                if (!checkSelected()) return false;

                var selected = checkAndGetSelect();
                if (selected && selected.length) {
                    orderSvr.selectedShippingItems = selected;


                    $state.go('customer.submitorder');
                }
            }

            $scope.redirectToFastOrder = function () {
                if (!checkSelected()) return false;
                var selected = checkAndGetSelect(true);
                if (selected.length > 1) {
                    SweetAlert.swal('提醒', '极速原单只能选择一个货物信息.', 'warning');
                    return false;
                }
                if (selected && selected.length) {
                    selected[0].isFastOrder = true;
                    orderSvr.selectedShippingItems = selected;
                    $state.go('customer.submitorder');
                }
            }

        }]);