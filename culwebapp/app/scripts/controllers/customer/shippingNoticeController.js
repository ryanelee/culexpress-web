'use strict';

var app = angular
    .module('culwebApp')
    .controller('ShippingNoticeController', ['$scope', '$rootScope', '$filter', '$stateParams', 'OrderSvr', '$state', '$window',
        function($scope, $rootScope, $filter, $stateParams, orderSvr, $state, $window) {
            $scope.$root.orderOptions = {};
            $scope.$root.wizardOptions = {};
            $scope.warehouses = [];
            orderSvr
            .getWarehouses()
            .then(function(result) {
                if (!window.sessionStorage.getItem('cache_warehouse')) {
                    window.sessionStorage.setItem('cache_warehouse', JSON.stringify(result.data));
                }
                //暂时只支持OR仓库
                //$scope.warehouses = $filter('filter')(result.data, function (item) { return item.stateOrProvince !== 'OR'; });

                $scope.warehouses = result.data;
                if ($scope.warehouses) {
                    //  仓库默认为空
                    // $scope.retrieveWarehouseNumber = $scope.warehouses[0].warehouseNumber;
                    $scope.retrieveWarehouseNumber = "";
                }
            });

            $scope.shippingCarriers = orderSvr.shippingCarriers
            $scope.selectedshippingCarrier = orderSvr.shippingCarriers[0];



            $scope.shippingNotice = {};

            $scope.submitToFastOrder = function(packageNumber) {
                $scope.shippingNotice.warehouseNumber = $scope.retrieveWarehouseNumber;
                $scope.shippingNotice.transactionNumber = packageNumber;
                $scope.shippingNotice.inboundDate = new Date().toISOString();
                $scope.shippingNotice.warehouseName = $scope.warehouses[0].warehouseName;
                orderSvr.selectedShippingItems = [$scope.shippingNotice];
                $state.go('customer.submitorder');
            }

            $scope.addShippingNotice = function() {
                if (!$scope.retrieveWarehouseNumber) { alertify.alert('提醒', '请选择收货仓库!'); return false; }
                if (!$scope.shippingNotice.trackingNumber) { alertify.alert('提醒', '请输入运单号!'); return false; }    
                if (!$scope.shippingNotice.packageDescription) { alertify.alert('提醒', '请输入运单内容!'); return false; }
                if (!!$scope.shippingNotice.isFastOrder) {
                    if (!$scope.shippingNotice.packageWeight) { alertify.alert('提醒', '极速原箱订单必须输入包裹重量!'); return false; }
                }

                orderSvr
                    .addShippingNotice({
                        customerNumber: $rootScope.currentUser.customerNumber,
                        carrierName: $scope.selectedshippingCarrier.name,
                        trackingNumber: $scope.shippingNotice.trackingNumber,
                        warehouseNumber: $scope.retrieveWarehouseNumber,
                        packageDescription: $scope.shippingNotice.packageDescription,
                        packageNote: $scope.shippingNotice.packageNote,
                        packageWeight: $scope.shippingNotice.packageWeight,
                        isFastOrder: $scope.shippingNotice.isFastOrder
                    })
                    .then(function(result) {
                     
                            if (!!result.data.transactionNumber) {
                                if (!!$scope.shippingNotice.isFastOrder) {
                                    return $scope.submitToFastOrder(result.data.transactionNumber);
                                } else {
                                    $state.go('customer.shippingnoticelist');
                                }
                            }
                        },
                        function(result) {
                            if (result.data && result.data.message) {
                                //SweetAlert.swal('错误', result.data.message, 'error');
                                alertify.alert('错误', result.data.message);
                            } else {
                                //SweetAlert.swal('错误', '添加失败.', 'error');
                                alertify.alert('错误', '添加失败!');
                            }
                        });
            };


            $scope.reset = function() {
                if (orderSvr.warehouses && orderSvr.warehouses.length)
                    $scope.retrieveWarehouseNumber = orderSvr.warehouses[0].warehouseNumber;

                $scope.selectedshippingCarrier = orderSvr.shippingCarriers[0];
                $scope.shippingNotice.trackingNumber = '';
                $scope.shippingNotice.packageDescription = '';
                $scope.shippingNotice.packageNote = '';
                $scope.shippingNotice.packageWeight = '';
                $scope.shippingNotice.isFastOrder = false;
            };

            $scope.pageSize = 10;
            $scope.pagedOptions = {
                total: 0,
                size: 10
            }

            $scope.searchKeyItems = [{
                key: 'trackingNumber',
                text: '预报快递单号'
            }];

            var queryPara = $scope.queryPara = {
                searchKeyName: 'trackingNumber',
                status: $stateParams.status || '',
            };

            $scope.shippingNoticeList = [];
            $scope.initShippingNoticeList = function(index, para) {
                if ($scope.$root.currentUser.userName === undefined) return;
                var status = $scope.queryPara.status,
                    customerNumber = $rootScope.currentUser.customerNumber;

                var pageSize = $scope.pageSize;
                $scope.pagedOptions.index = index;
                $scope.pagedOptions.size = pageSize;
                orderSvr
                    .retrieveShippingNoticeList(index, pageSize, $.extend({ status: status, customerNumber: customerNumber }, para))
                    .then(function(result) {
                            $scope.pagedOptions.total = result.data.pageInfo.totalPageCount;
                            $scope.shippingNoticeList = result.data.data;  
                            console.log($scope.shippingNoticeList)
                            //  if(status === "Onshelf") {
                            //     var shippingNoticeListOnshelf = [];
                            //     $scope.shippingNoticeList.forEach(function(item) {
                            //         if (item.status === "Onshelf"){
                            //             shippingNoticeListOnshelf.push(item)
                            //         } 
                            //     })
                            //     $scope.shippingNoticeList = shippingNoticeListOnshelf;
                            //     // console.log(shippingNoticeListOnshelf)
                            // }                        
                        },
                        function(err) {

                        });
               
                
            };
            // $scope.initShippingNoticeList();

            $scope.onPaged = function(pageIndex) {
                $scope.initShippingNoticeList(pageIndex);
            }
            
            $scope.rangSearch = function(rangeItem) {

                $scope.queryPara = {
                    searchKeyName: 'trackingNumber',
                    status: ''
                };

                $scope.initShippingNoticeList(1, angular.extend($scope.queryPara, {
                    dateFrom: rangeItem.begin,
                    dateTo: rangeItem.end
                }));
            }

            $scope.searchList = function() {
                $scope.initShippingNoticeList(1, $scope.queryPara);
            }

            $scope.changeQueryStaus = function(status) {
                $scope.queryPara.status = status || '';
                $scope.initShippingNoticeList(1, $scope.queryPara);
            }


            $scope.selectedAll = false;
            $scope.selectAll = function() {
                for (var i = 0, ii = $scope.shippingNoticeList.length; i < ii; i++) {
                    var shippingItem = $scope.shippingNoticeList[i];
                    if (shippingItem.status !== 'InOrder' && shippingItem.status !== 'Intransit') {
                        shippingItem.checked = $scope.selectedAll;
                    }
                }
            }
            var isSafeSelected = function() {
                // var canSelectItems = $filter('filter')($scope.shippingNoticeList, function(item) { return item.status === 'Inbound'; }),
                var canSelectItems = $filter('filter')($scope.shippingNoticeList, function(item) { return item.status === 'Onshelf' || item.status === 'Intransit'; }),
                    selectedItems = $filter('filter')(canSelectItems, function(item) { return item.checked === true; }),
                    checkedWarehouseNumber;
                // console.log(selectedItems)
                if (!selectedItems[0]) return true;
                if (selectedItems.length <= 0) return 0;
                if (selectedItems.length > 10) return 1;
                checkedWarehouseNumber = selectedItems[0].warehouseNumber;

                for (var i = 0, ii = selectedItems.length; i < ii; i++) {
                    if (selectedItems[i].warehouseNumber != checkedWarehouseNumber) {
                        return false;
                    }
                }
                return true;
            }

            var checkSelected = function() {
                var result = isSafeSelected();
                if (result === 0) {
                    //SweetAlert.swal('提醒', '请至少选择一条数据。', 'warning');
                    alertify.alert('提醒', '请至少选择一条数据!');
                    return false;
                } else if (result === 1) {
                    alertify.alert('提醒', '一个订单最多允许选择10个包裹!');
                    return false;
                } else if (result === false) {
                    //SweetAlert.swal('提醒', '您选择的包裹不在同一个仓库，无法提交订单。不同仓库的包裹请分别提交订单。', 'warning');
                    alertify.alert('提醒', '您选择的包裹不在同一个仓库，无法提交订单。不同仓库的包裹请分别提交订单!');
                    return false;
                }
                return true;
            }

            $scope.selectItem = function(shippingNoticeItem) {
                if (!!shippingNoticeItem.checked) {
                    shippingNoticeItem.checked = checkSelected();
                }

                // var canSelectItems = $filter('filter')($scope.shippingNoticeList, function(item) { return item.status === 'Inbound'; }),
                var canSelectItems = $filter('filter')($scope.shippingNoticeList, function(item) { return item.status === 'Onshelf' || item.status === 'Intransit'; }),
                    selectedItems = $filter('filter')(canSelectItems, function(item) { return item.checked === true; });
                $scope.selectedAll = canSelectItems.length === selectedItems.length;
            }


            $scope.deleteShippingNotice = function(item) {
                alertify.confirm('确认', '请确认是否要删除该记录?',
                    function() {
                        orderSvr
                            .deleteShippingNotice(item.trackingNumber)
                            .then(function(result) {
                                    if (!!result.data.success) {
                                        var index = $scope.shippingNoticeList.indexOf(item);
                                        $scope.shippingNoticeList.splice(index, 1);
                                    }

                                    alertify.success('删除成功!');
                                },
                                function(result) {
                                    if (result.data.message) {
                                        alertify.alert('错误', result.data.message);
                                    }
                                });
                    },
                    function() {
                        alertify.error('已取消删除!');
                    })

                // SweetAlert.swal({
                //     title: "请确认是否要删除该记录?",
                //     type: "warning",
                //     showCancelButton: true,
                //     confirmButtonColor: "#DD6B55",
                //     confirmButtonText: "确定",
                //     cancelButtonText: "取消",
                //     closeOnConfirm: false
                // }, function (isConfirm) {
                //     if (isConfirm) {
                //         orderSvr
                //             .deleteShippingNotice(item.trackingNumber)
                //             .then(function (result) {
                //                 if (!!result.data.success) {
                //                     var index = $scope.shippingNoticeList.indexOf(item);
                //                     $scope.shippingNoticeList.splice(index, 1);
                //                 }

                //                 //SweetAlert.swal('提示', '删除成功.', 'success');
                //                 alertify.alert('提示','删除成功!');
                //             },
                //             function (result) {
                //                 if (result.data.message) {
                //                     //SweetAlert.swal('错误', result.data.message, 'error');
                //                     alertify.alert('错误',result.data.message);
                //                 }
                //             });
                //     }
                // });

            };


            var checkAndGetSelect = function(isFastOrder) {
                    var shippingList = $scope.shippingNoticeList,
                        selectedItems = [];
                    if (!shippingList.length) return false;
                    for (var i = 0, ii = shippingList.length; i < ii; i++) {
                        var shippItemData = shippingList[i];
                        shippItemData.orderItems = [{ goodsCategory: '' }];
                        if (shippItemData.checked) {
                            if(isFastOrder && shippItemData.status != 'Intransit'){
                                alertify.alert('提醒', '极速原单只能提交未入库的货物信息!');
                                return false;
                            }
                            if (!isFastOrder) {
                                //console.log(shippItemData.status);
                                if (shippItemData.status != 'Onshelf') {
                                    //SweetAlert.swal('提醒', '普通订单只能提交已入库的货物信息.', 'warning');
                                    alertify.alert('提醒', '普通订单只能提交已上架的货物信息!');
                                    return false;
                                }
                            }
                            selectedItems.push(shippItemData);
                        }
                    }

                    if (!selectedItems.length) {
                        //SweetAlert.swal('提醒', '请选择需要提交的货物信息.', 'warning');
                        alertify.alert('提醒', '请选择需要提交的货物信息!');
                        return false;
                    }
                    return selectedItems;
                }
                //暂留未用
            var getSelectedItemsId = function(selectedArr) {
                var idArrr = [];
                for (var i = 0, ii = (selectedArr || []).length; i < ii; i++) {
                    idArrr.push(selectedArr[i].transactionNumber);
                }
                return idArrr.join(',');
            }

            orderSvr.selectedShippingItems = [];
            $scope.redirectToSubmitOrder = function() {
                if (!checkSelected()) return false;

                var selected = checkAndGetSelect();
                if (selected && selected.length) {
                    orderSvr.selectedShippingItems = selected;


                    $state.go('customer.submitorder');
                }
            }
         
            $scope.redirectToFastOrder = function() {
                if (!checkSelected()) return false;
                var selected = checkAndGetSelect(true);
                if (selected.length > 1) {
                    alertify.alert('提醒', '极速原单只能选择一个货物信息!');
                    return false;
                }
                if (selected && selected.length) {
                    selected[0].isFastOrder = true;
                    orderSvr.selectedShippingItems = selected;
                    $state.go('customer.submitorder');
                }
            };

            $scope.redirectToOrderDetail = function(orderNumber) {
                $state.go('customer.orderdetail', { id: orderNumber });
            };

            $scope.isFocus = function() {
                setTimeout(function() {
                    $window.document.getElementById("packageWeight").focus();
                }, 300)
            }
        }
    ]);

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});