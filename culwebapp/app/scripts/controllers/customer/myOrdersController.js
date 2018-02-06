'use strict';

var app = angular
    .module('culwebApp')
    .controller('MyOrdersController', ['$rootScope', '$scope', '$compile', '$timeout', '$state', '$stateParams', 'OrderSvr', 'addressSvr', 'settlementSvr', '$filter', '$window', 'AuthService', 'Customer',
        function ($rootScope, $scope, $compile, $timeout, $state, $stateParams, orderSvr, addressSvr, settlementSvr, $filter, $window, AuthService, customer) {
            if (!$scope.$root.orderOptions) $scope.$root.orderOptions = {};
            $scope.orderItems = [];
            $scope.calculateCategory = {
                mainName: "",
                name: ""
            }
            $scope.addOrderItem = function ($event, shippingItem) {
                var orderItem = {
                    id: shippingItem.orderItems.length + 1,
                    packageNumber: shippingItem.trackingNumber,
                    itemBrand: '',
                    description: '',
                    quantity: '',
                    unitprice: ''
                },
                    items = shippingItem.orderItems;

                $timeout(function () {
                    if (!items) items = [];
                    items.push(orderItem);

                    shippingItem.orderItems = items;

                    $scope.orderItems = angular.copy(items);
                });
            }


            AuthService.getCustomerMessage({ customerNumber: $rootScope.currentUser.customerNumber }).then(function (result) {
                $scope.currentUser = result.data
            })

            $scope.currentUser = AuthService.getUser();
            customer.getCustomerInfo($scope.currentUser.customerNumber)
                .then(function (result) {
                    $scope.currentUser.accountBalance = result.data.accountBalance;
                });



            $scope.removeOrderItem = function ($event, itemIndex, shippingItem) {
                if (shippingItem.orderItems.length > 1) {
                    $event.stopPropagation && $event.stopPropagation();
                    shippingItem.orderItems.splice(itemIndex, 1);
                } else {
                    alertify.alert('提示', '请至少保留一件商品!');
                    return false;
                }
            }


            $scope.usePointChanged = function () {
                var pointTotal = $scope.currentUser.myPoint;

                if ($scope.data.usePoint > 30) {
                    //alertify.alert('提示', '一次最多允许使用30个积分!');
                    $scope.eMsg = "一次最多允许使用30个积分!";
                    $scope.data.usePoint = '';
                    return;
                }
                if ($scope.data.usePoint > pointTotal) {
                    $scope.data.usePoint = pointTotal;
                }

                if (isNaN($scope.data.usePoint) || !angular.isNumber(+$scope.data.usePoint)) {
                    // alertify.alert('提示', '积分必须为数字并且必须大于0!');
                    $scope.data.usePoint = '';
                    return;
                }
            }


            $scope.selectedChannel = function () {

                $scope.$root.orderOptions.shipServiceItem = $scope.data.shipServiceItem;
                if (!!$scope.data.shipServiceItem) {
                    //var categoryItem = $filter('filter')($scope.warehouses, function (item) { return item.warehouseNumber === getWorkhouseNumber(); });
                    $scope.goodsCategories = $scope.data.shipServiceItem.itemTypeList;
                    $scope.categories = $scope.data.shipServiceItem.itemCateList;
                } else {
                    $scope.goodsCategories = [];
                    $scope.categories = [];
                }
            }

            //init

            $scope.goodsCategories = orderSvr.goodsCategories;

            var data = $scope.data = {
                shippingPackageCount: ''
            }

            var getWorkhouseNumber = function () {
                if (!$scope.shippingItems || !$scope.shippingItems.length) return '';
                return $scope.shippingItems[0].warehouseNumber;
            }
            if (!$scope.$root.orderOptions.warehouses || $scope.$root.orderOptions.warehouses.length <= 0) {
                $scope.warehouses = [];
                $scope.allShipChannels = [];
                orderSvr
                    .getWarehouses()
                    .then(function (result) {
                        // if (!window.sessionStorage.getItem('cache_warehouse')) {
                        // window.sessionStorage.setItem('cache_warehouse', JSON.stringify(result.data));
                        // } else if (!$scope.shippingItems || $scope.shippingItems.length <= 0) {
                        $scope.shippingItems = orderSvr.selectedShippingItems;
                        // }

                        $scope.warehouses = result.data;

                        // if ($scope.$root && $scope.$root.orderOptions) {
                        //     $scope.$root.orderOptions.warehouses = $scope.warehouses;
                        // }
                        for (var i = 0, ii = $scope.warehouses.length; i < ii; i++) {
                            if ($scope.warehouses[i].warehouseNumber == getWorkhouseNumber()) {
                                var shipServiceList = $scope.warehouses[i].shipServiceList;
                                for (var j = 0, jj = shipServiceList.length; j < jj; j++) {
                                    var queried = $filter('filter')($scope.allShipChannels, function (channelItem) {
                                        return channelItem.shipServiceId === shipServiceList[j].shipServiceId;
                                    });
                                    if (queried.length <= 0 && shipServiceList[j].status === 1) {
                                        $scope.allShipChannels.push(shipServiceList[j]);
                                    }
                                }
                            }
                        }
                    });
            } else {
                $scope.allShipChannels = [];
                $scope.warehouses = $scope.$root.orderOptions.warehouses;
                for (var m = 0, mm = $scope.warehouses.length; m < mm; m++) {
                    if ($scope.warehouses[m].warehouseNumber == getWorkhouseNumber()) {
                        var shipServiceList = $scope.warehouses[m].shipServiceList;
                        for (var n = 0, nn = shipServiceList.length; n < nn; n++) {
                            var queried = $filter('filter')($scope.allShipChannels, function (channelItem) {
                                return channelItem.shipServiceId === shipServiceList[n].shipServiceId;
                            });
                            if (queried.length <= 0 && shipServiceList[n].status === 1) {
                                $scope.allShipChannels.push(shipServiceList[n]);
                            }
                        }
                    }
                }
            }

            if (!!$scope.$root.orderOptions.shipServiceItem) $scope.data.shipServiceItem = $scope.$root.orderOptions.shipServiceItem;
            if (!$scope.$root.orderOptions.shippingItems || $scope.$root.orderOptions.shippingItems.length <= 0) {
                $scope.$root.orderOptions.shippingItems = $scope.shippingItems = orderSvr.selectedShippingItems || [];
            } else {
                $scope.shippingItems = $scope.$root.orderOptions.shippingItems;
                $scope.selectedChannel();
            }
            if (!!$scope.shippingItems[0] && !!$scope.shippingItems[0].isFastOrder) {
                $scope.data.isFastOrder = true;
            }
            if (!!$scope.shippingItems[0] && $scope.shippingItems[0].isFastOrder) {
                $scope.showWeight = !$scope.shippingItems[0].packageWeight;
            }

            if ($scope.shippingItems && $scope.shippingItems.length) {
                for (var m = 0, mm = $scope.shippingItems.length; m < mm; m++) {
                    $scope.shippingItems[m].orderItems = [{
                        id: m + 1
                    }]
                }
            } else if ($state.current.name === 'customer.submitorder') {
                $scope.$root.goback();
            }

            $scope.addressListData = [];
            addressSvr.getAddressList(1, {
                userName: $scope.$root.currentUser.userName,
                emailAddress: $scope.$root.currentUser.emailAddress,
                customerNumber: $scope.$root.currentUser.customerNumber,
                verifyMark: 1
            })
                .then(function (result) {
                    if (result.data) {
                        $scope.addressListData = result.data.data;
                    }
                });





            $scope.shippingPackageCount = 0;
            $scope.packageCountItems = orderSvr.packageCountItems;


            $scope.searchKeyItems = [{
                key: 'orderNumber',
                text: '订单编号'
            }, {
                key: 'receiveTrackingNumber',
                text: '预报快递单号'
            }
                , {
                key: 'outBoundTrackingNumber',
                text: '出库包裹编号'
            }
            ];

            var queryPara = $scope.queryPara = {
                searchKeyName: 'orderNumber',
                keywords: '',
                dateRange: 'last6Months',
                orderStatus: 'Unpaid',

            };
            var initQueryParaData = function () {
                $scope.rangeItems = [{
                    key: 'last6Months',
                    text: '最近6个月'
                }];
                var years = (new Date()).getFullYear();
                for (var i = years, ii = years - 4; i > ii; i--) {
                    $scope.rangeItems.push({
                        key: i.toString(),
                        text: i.toString()
                    });
                }
            }
            initQueryParaData();

            //end

            $scope.pagedOptions = {
                total: 0,
                size: 10
            }

            $scope.pageSize = 10;

            if (!!$stateParams.status) {
                $scope.queryPara.orderStatus = $stateParams.status;
            }
            $scope.orderListData = [];
            $scope.orderListData._orderMessageStatus = '0';
            $scope.queryOrder = function (index, paras) {
                var pageSize = $scope.pageSize;
                $scope.pagedOptions.index = index;
                $scope.pagedOptions.size = pageSize;

                orderSvr
                    .getOrderList(index, angular.extend({
                        customerNumber: $scope.$root.currentUser.customerNumber,
                        orderStatus: $scope.queryPara.orderStatus
                    }, paras || {}
                    ), pageSize)
                    .then(function (result) {
                        if (result.data) {
                            $scope.orderListData = result.data.data;
                            $scope.pagedOptions.total = result.data.pageInfo.totalCount;

                            getOrderMessageStatus()
                        }
                    });
            }
            $scope.queryOrder();

            var getOrderMessageStatus = function () {
                $scope.orderListData.forEach(function (order) {
                    orderSvr
                        .getMessage(order.orderMessageNumber)
                        .then(function (result) {
                            if (result.data) {
                                $scope.orderMessages = result.data.messageLogs;
                                if ($scope.orderMessages) {
                                    $scope.orderMessages.forEach(function (e) {
                                        order._orderMessageStatus = e.status
                                        if (e.status === '1') {
                                            return
                                        }
                                    })
                                }
                            }
                        })
                })
            }
            // getOrderMessageStatus();

            $scope.rangSearch = function (rangeItem) {
                $scope.queryPara = {
                    searchKeyName: 'orderNumber',
                    dateRange: 'last6Months',
                    orderStatus: 'Unpaid',
                };

                $scope.queryOrder(1, angular.extend($scope.queryPara, {
                    dateFrom: rangeItem.begin,
                    dateTo: rangeItem.end
                }));
            }
            
            // yyyy-mm-dd
            var _getDate = function (dateStr) {
                var year = dateStr.substr(0, 4);
                var month = dateStr.substr(5, 2) - 1;
                var day = dateStr.substr(8, 2);
                return new Date(year, month, day);
            };

            var _options = function () {
                var dateFrom = !!$scope.queryPara.startDate ? _getDate($scope.queryPara.startDate).toISOString() : "";
                var dateTo = !!$scope.queryPara.endDate ? _getDate($scope.queryPara.endDate).toISOString() : "";
                var _options = {
                    "dateFrom": dateFrom,
                    "dateTo": dateTo
                }
                if (!!$scope.queryPara.orderStatus) {
                    _options["orderStatus"] = $scope.queryPara.orderStatus;
                }
                if (!!$scope.queryPara.keywords) {
                    _options[$scope.queryPara.searchKeyName] = $scope.queryPara.keywords;
                }
                return angular.copy(_options);
            }

            $scope.searchOrder = function () {
                var options = _options();
                $scope.queryOrder(1, options);
            }


            $scope.onPaged = function (pageIndex) {
                $scope.queryOrder(pageIndex);
            }

            $scope.changeQueryStaus = function (status) {
                $scope.queryPara.orderStatus = status || '';
                $scope.queryOrder(1, $scope.queryPara);
            }

            $scope.redirectToDetail = function (orderItem) {
                $state.go('customer.orderdetail', { id: orderItem.orderNumber });
            }

            $scope.updateMessage = function (orderItem) {
                orderSvr
                    .updateMessageStatus(orderItem.orderMessageNumber)
                    .then(function (result) {
                        if (result.data.success) {
                            // 更新成功
                        }
                    })
                $scope.redirectToDetail(orderItem)
            }

            var getShippingPackageCount = function (pageType) {
                var packageArr = [];
                if (data.shippingPackageCount) {
                    for (var i = 0, ii = data.shippingPackageCount * 1; i < ii; i++) {
                        packageArr.push({
                            trackingNumber: pageType
                        });
                    }
                }
                return packageArr;
            }

            var getShippingAddressNumber = function () {
                var addressArr = [];
                var packageItems = getOutboundPackage('CUL');
                for (var j = 0, jj = packageItems.length; j < jj; j++) {
                    var packageItem = packageItems[j],
                        requied = $filter('filter')(addressArr, function (addressItem) {
                            return addressItem.addressNumber === packageItem.addressNumber;
                        });
                    if (!requied || !requied.length) {
                        addressArr.push({
                            addressNumber: packageItem.addressNumber
                        });
                    }
                }

                return addressArr;
            }

            var getInboundPackages = function () {
                var packageArr = [];
                if ($scope.shippingItems && $scope.shippingItems.length) {
                    for (var i = 0, ii = $scope.shippingItems.length; i < ii; i++) {
                        var requied = $filter('filter')(packageArr, function (packageItem) {
                            return packageItem.receiveTrackingNumber === $scope.shippingItems[i].trackingNumber;
                        }),
                            isFastOrder = $scope.shippingItems[0].isFastOrder;
                        if (!requied || !requied.length) {
                            packageArr.push($.extend({
                                receiveTrackingNumber: $scope.shippingItems[i].trackingNumber
                            }, isFastOrder ? {
                                packageWeight: parseFloat($scope.shippingItems[i].packageWeight)
                            } : {}));
                        }
                    }
                }
                return packageArr;
            }

            var getOutboundPackage = function (pageType) {
                var packageArr = [];
                if ($scope.outboundPackages && $scope.outboundPackages.length) {
                    for (var i = 0, ii = $scope.outboundPackages.length; i < ii; i++) {
                        var packageItem = $scope.outboundPackages[i],
                            packageNumber = packageItem.trackingNumber,
                            orderItems = [];
                        for (var j = 0, jj = packageItem.orderItems.length; j < jj; j++) {
                            var orderItem = packageItem.orderItems[j];
                            if (!orderItem.id) orderItem.id = j + 1;
                            orderItems.push(orderItem.id);
                        }
                        packageArr.push({
                            trackingNumber: pageType,
                            addressNumber: packageItem.addressNumber,
                            items: orderItems,
                            goodsCategory: angular.isObject(packageItem.goodsCategory) ? packageItem.goodsCategory.goodsCategory : packageItem.goodsCategory
                        });
                    }
                }
                return packageArr;
            }
            var getOrders = function () {
                //if ($scope.orderItems.length > 0) return $scope.orderItems;
                var orders = [];
                $scope.packageWeight = getWeight();
                $scope.data.declareGoodsValue = 0;
                if ($scope.outboundPackages && $scope.outboundPackages.length) {
                    for (var i = 0, ii = $scope.outboundPackages.length; i < ii; i++) {
                        var packageItem = $scope.outboundPackages[i],
                            packageNumber = packageItem.trackingNumber,
                            orderItems = [];
                        for (var j = 0, jj = packageItem.orderItems.length; j < jj; j++) {
                            var orderItem = packageItem.orderItems[j];
                            orderItem.packageNumber = packageNumber;
                            $scope.data.declareGoodsValue += orderItem.quantity * orderItem.unitprice;
                            if (angular.isObject(orderItem.goodsCategory)) {
                                orderItem.goodsCategory = orderItem.goodsCategory.goodsCategory;
                            }
                            orderItem.itemCategory = $scope.outboundPackages[i].goodsCategory;
                            orderItem.currentCategory = $scope.outboundPackages[i].currentCategory;
                            orderItem.shipServiceId = data.shipServiceItem.shipServiceId;
                            orderItem.packageIndex = i
                            orderItem.packageWeight = $scope.packageWeight

                            orders.push(orderItem);
                        }
                        $scope.data.declareGoodsValue = Number($scope.data.declareGoodsValue).toFixed(2);
                    }
                }
                return orders;
            }

            var getWeight = function () {
                var packageWeight = 0,
                    outboundItems = $scope.shippingItems;
                for (var i = 0, ii = outboundItems.length; i < ii; i++) {
                    packageWeight += (outboundItems[i].packageWeight * 1);
                }
                return packageWeight;
            }

            var getGoodsCategory = function () {
                if (angular.isObject(data.goodsCategory)) {
                    return data.goodsCategory.goodsCategory;
                } else {
                    return data.goodsCategory || 'A';
                }
            }
            $scope.outboundPackages = [{
                orderItems: [{}]
            }];

            $scope.orderBinning = function (binningItem) {
                var allItems = [],
                    newOutboundItem = angular.copy(binningItem),
                    packages = $.extend(true, [], $scope.outboundPackages);
                for (var i = 0, ii = $scope.outboundPackages.length; i < ii; i++) {
                    if ($scope.outboundPackages[i].orderItems) {
                        allItems = allItems.concat($scope.outboundPackages[i].orderItems);
                    }
                }

                for (var j = 0, jj = newOutboundItem.orderItems.length; j < jj; j++) {
                    newOutboundItem.orderItems[j].id = allItems.length + (j + 1);
                    $scope.orderItems.push(angular.copy(newOutboundItem.orderItems[j]));
                }
                packages.push(newOutboundItem);
                $scope.outboundPackages = packages;

            }

            $scope.selectedCategory = function (packageItem, propName, val) {
                packageItem[propName] = val;
                if (propName == "currentCategory") {
                    $scope.calculateCategory.mainName = val
                    packageItem.subCategories = [];
                    packageItem.goodsCategory = "";
                    if (!!val) {
                        var subcategoryItems = $filter('filter')($scope.categories, function (categoryItem) { return categoryItem.parentid === val });
                        if (!!subcategoryItems) {
                            packageItem.subCategories = subcategoryItems;
                            packageItem.goodsCategory = packageItem.subCategories[0].cateid;
                        }
                    }
                } else {
                    $scope.calculateCategory.name = val
                }
            }

            $scope.removePackage = function (packageItem) {
                if ($scope.outboundPackages.length > 1) {
                    var index = $scope.outboundPackages.indexOf(packageItem);
                    $scope.outboundPackages.splice(index, 1);
                } else {
                    alertify.alert('提示', '请至少保留一个转运包裹!');
                    return false
                }
            }

            $scope.redirectToAddressInfo = function (addressItem) {
                $state.go('customer.myaddress', { addressId: addressItem.transactionNumber });
            }

            var preSubmitToService = function (data) {
                console.log(data)
                var text = '';
                if (!data.isFastOrder) {
                    text = "确定提交订单?";
                } else {
                    if ($scope.currentUser.accountBalance < $scope.countFee.totalCount) {
                        alertify.alert('提示', '您需要支付' + $scope.countFee.totalCount + '元，而您的账户余额为' + $scope.currentUser.accountBalance + '元,请充值后再进行支付!');
                        return false;
                    }
                    //parseFloat($scope.shippingItems[0].packageWeight + 0.5) //显示重量原来的写法
                    text = '您好，感谢您提交了CUL EXPRESS极速转运服务订单， 按确定即可完成本次订单的提交，您的包裹预估重量为' +
                        parseFloat(parseFloat($scope.shippingItems[0].packageWeight) + 0.5) +
                        '磅，我们会锁定您' +
                        $scope.countFee.packageWeight +
                        '磅=' +
                        $scope.countFee.totalCount +
                        '元的预收运费，该金额不能做其他订单的交易，等到该极速转运订单出库后会计算出最终运费,如有多余运费会退回到您的CUL EXPRESS账户余额中，详情可到财务明细中查询。';
                }

                alertify.confirm('确认', text,
                    function () {
                        $('.sa-confirm-button-container button.confirm').attr({ disabled: true });
                        orderSvr
                            .submitOrder(data)
                            .then(function (result) {
                                if (result.data.orderNumber) {
                                    alertify.success('订单提交成功!');
                                    $scope.$root.currentUser.myPoint = $scope.$root.currentUser.myPoint - $scope.data.usePoint;
                                    $state.go('customer.myorders');
                                }
                            }, function (result) {
                                if (result.data.message) {
                                    alertify.alert('错误', result.data.message);
                                }
                            });
                    },
                    function () {
                        alertify.error('已取消提交订单!');
                    })
                // SweetAlert.swal({
                //     title: '确认',
                //     text: text,
                //     type: "warning",
                //     showCancelButton: true,
                //     confirmButtonColor: "#DD6B55",
                //     confirmButtonText: "确定",
                //     cancelButtonText: "取消",
                //     closeOnConfirm: false
                // }, function (isConfirm) {
                //     if (isConfirm) {
                //         $('.sa-confirm-button-container button.confirm').attr({ disabled: true });
                //         orderSvr
                //             .submitOrder(data)
                //             .then(function (result) {
                //                 if (result.data.orderNumber) {
                //                     SweetAlert.swal('提示', '提交成功.', 'success');
                //                     $state.go('customer.myorders');
                //                 }
                //             }, function (result) {
                //                 if (result.data.message) {
                //                     SweetAlert.swal('错误', result.data.message, 'error');
                //                 }
                //             });
                //     }
                // });
            }

            $scope.submitOrder = function () {
                if (!$scope.data.submit_agreeterms || $scope.data.submit_agreeterms != true) {
                    alertify.alert('提示', '提交订单之前,请勾选我已阅读并同意CULEXPRESS免责赔偿条款!');
                    return;
                }

                var orderItems = $scope.orderItems = angular.copy(getOrders());
                $scope.data.isFastOrder = $scope.shippingItems[0].isFastOrder;
                if (!!$scope.data.isFastOrder) {
                    if ($scope.$root.currentUser.accountBalance < $scope.countFee.totalCount) {
                        alertify.alert('提示', '您的帐户余额不足，无法提交极速原单!');
                        orderSvr.selectedShippingItems = [];
                        $state.go('customer.shippingnoticelist');
                        return false;
                    }
                    //$scope.data.packageWeight = $scope.shippingItems[0].packageWeight;
                }
                $scope.data.outboundPackages = getOutboundPackage('CUL')
                $scope.data.orderItems = orderItems;
                $scope.data.shipToAddresses = getShippingAddressNumber().length <= 0 ? [{ addressNumber: '' }] : getShippingAddressNumber();
                $scope.data.inboundPackages = getInboundPackages();
                $scope.data.warehouseNumber = getWorkhouseNumber();
                $scope.data.goodsCategory = getGoodsCategory();
                $scope.data.orderNumber = $scope.$root.currentUser.customerNumber + $scope.$root.currentUser.receiveIdentity;
                $scope.data.cartonCount = data.shippingPackageCount;
                $scope.data.message = data.priceAdjustMemo;
                $scope.data.shipServiceId = data.shipServiceItem.shipServiceId;
                $scope.data.tariffMoney = $scope.countFee.tariffMoney
                $scope.data.valueAddFee = $scope.countFee.valueAddFee

                preSubmitToService($scope.data);
            }

            $scope.deleteOrder = function (number) {
                if (!number) return false;
                alertify.confirm('确定要删除订单[' + number + ']?',
                    function () {
                        orderSvr.deleteOrder(number)
                            .then(function (result) {
                                if (result.data.success) {
                                    alertify.success('订单删除成功.');
                                    $scope.queryOrder();
                                }
                            }, function (result) {
                                if (result.data.message) {
                                    alertify.alert('错误', result.data.message);
                                }
                            });
                    },
                    function () {
                        alertify.error('已取消删除!');
                    })
            };

            var payOrderServie = function (orderItem, callback) {
                orderSvr.paymentOrder(orderItem.orderNumber)
                    .then(function (result) {
                        if (result.data.success) {
                            callback && callback();
                            orderItem.totalCount = orderItem.totalCount - $scope.$root.currentUser.accountBalance
                            alertify.alert("支付成功");
                            setTimeout(function () {
                                $window.location.reload()
                            }, 1000);

                            //支付之后刷新一下全局余额
                            $scope.$root.autologin(function (result) {
                                $scope.$root.currentUser.accountBalance = result.accountBalance;

                                return false;
                            });
                        }

                    }, function (result) {
                        if (result.data.message) {
                            alertify.alert('错误', result.data.message);
                        }
                    });
            }

            $scope.payOrder = function (orderItem) {
                if (!orderItem) return false;
                if (!orderItem.totalCount) {
                    alertify.alert('提示', '订单还未计价,不能支付!');
                    return false;
                }
                //运费不足状态下支付，扣除所欠费用即可
                if (orderItem.orderStatus == "Arrears") {
                    orderItem.totalCount = Math.abs(orderItem.shippingFeeAdjust)
                    // orderItem.totalCount = orderItem.shippingFee
                }

                if ($scope.accountBalance < orderItem.totalCount) {
                    alertify.alert('提示', '您需要支付' + orderItem.totalCount + '元，而您的账户余额为' + $scope.currentUser.accountBalance + '元,请充值后再进行支付!');
                    return false;
                }

                // if ( orderItem.orderStatus == "Arrears") {
                //    alertify.confirm('确认', '您将被扣款' + orderItem.shippingFeeAdjust + '元，确定支付订单?',
                //     function() {
                //         $('.sa-confirm-button-container button.confirm').attr({ disabled: true });
                //         payOrderServie(orderItem);
                //     },
                //     function() {
                //         alertify.error('已取消支付!');
                //     });
                // } else {
                alertify.confirm('确认', '您将被扣款' + orderItem.totalCount + '元，确定支付订单?',
                    function () {
                        $('.sa-confirm-button-container button.confirm').attr({ disabled: true });
                        payOrderServie(orderItem);
                    },
                    function () {
                        alertify.error('已取消支付!');
                    });
                //  }
            }

            $scope.wizardOptions = {
                verified: true,
                mode: 'disable',
                nextText: '下一步',
                prevText: '上一步',
                submitText: '提交'
            }
            $scope.wizardValid = function (index, step, callback) {
                if (!!$scope.showWeight) {
                    if (!$scope.data.packageWeight) {
                        alertify.alert('提示', '请输入包裹重量!');
                        return callback("err")
                    } else {
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.shippingItems[0].packageWeight = parseFloat($scope.data.packageWeight);
                            });
                        })

                    }
                }
                if (!data.shipServiceItem) {
                    alertify.alert('提示', '请先选择发货渠道!');
                    return callback("err")
                }


                if (index === 2) {
                    //selectedCategory(outboundPackageItem,'currentCategory',null);
                    var orderItems = getOrders();
                    orderSvr.cacluTariff(orderItems).then(function (data) {
                        // console.log("data", data)
                    })
                    $scope.data.addMoneyFromChannel = 0

                    $scope.sumMoney = 0;
                    $scope.allQuantity = 0
                    for (var i = 0, ii = orderItems.length; i < ii; i++) {

                        var orderItem = orderItems[i];
                        // 允许orderItem.unitprice值为0
                        if (!orderItem.itemBrand || !orderItem.description || !orderItem.quantity || orderItem.unitprice == undefined || orderItem.unitprice == null) {
                            alertify.alert('提示', '必须填写转运包裹申报商品信息，包括商品品牌、商品描述、数量和单价!');
                            return callback("err")
                        }
                        $scope.allQuantity += orderItems[i].quantity
                        $scope.sumMoney += orderItems[i].unitprice;

                        // var patternEng = /^[A-Za-z0-9]+$/
                        // var patternChn = /[^x00-xff]/

                        // if (!patternEng.test(orderItem.itemBrand)){
                        //     alertify.alert('提示', ' 请填写正确的商品品牌的英文名！');
                        //     return false;
                        // }

                        // if ($scope.data.shipServiceItem.shipServiceId == '9') {
                        //     if (!patternEng.test(orderItem.description)){
                        //         alertify.alert('提示', ' 请填写英文商品描述！');
                        //         return false;
                        //     }
                        // } else {
                        //     if (!patternChn.test(orderItem.description)){
                        //         alertify.alert('提示', ' 请填写中文商品描述！');
                        //         return false;
                        //     }
                        // 所有渠道都控制品牌名必须为英文
                        // $scope.data.shipServiceItem.requireEnglish4Name === 1 &&
                        if ($scope.data.shipServiceItem != undefined &&
                            !/^[^\u4e00-\u9fa5]+$/i.test(orderItem.itemBrand)) {
                            alertify.alert('提示', '商品品牌:[<small style="color:red">' + orderItem.itemBrand +
                                '</small>]中包括非英文字符。当前发货渠道:[<small style="color:red">' + $scope.data.shipServiceItem.shipServiceName +
                                '</small>]要求商品品牌必须为英文,请填写正确的英文商品品牌.');
                            return callback("err")
                        }

                        if ($scope.data.shipServiceItem != undefined &&
                            $scope.data.shipServiceItem.requireEnglish4Name === 1 &&
                            !/^[^\u4e00-\u9fa5]+$/i.test(orderItem.description)) {
                            alertify.alert('提示', '商品描述:[<small style="color:red">' + orderItem.description +
                                '</small>]中包括非英文字符。当前发货渠道:[<small style="color:red">' + $scope.data.shipServiceItem.shipServiceName +
                                '</small>]要求商品描述必须为英文,请填写正确的英文商品描述.');
                            return callback("err")
                        }

                        if ($scope.data.shipServiceItem != undefined &&
                            $scope.data.shipServiceItem.requireEnglish4Name != 1 &&
                            /^[u4E00-u9FA5]+$/.test(orderItem.description)) {
                            alertify.alert('提示', '商品描述:[<small style="color:red">' + orderItem.description +
                                '</small>]中包括非中文字符。当前发货渠道:[<small style="color:red">' + $scope.data.shipServiceItem.shipServiceName +
                                '</small>]要求商品描述必须为中文,请填写正确的中文商品描述.');
                            return callback("err")
                        }
                    }

                    var packageItems = getOutboundPackage('CUL');
                    for (var j = 0, jj = packageItems.length; j < jj; j++) {
                        var packageItem = packageItems[j];
                        if (!packageItem.addressNumber) {
                            alertify.alert('提示', '请确保每个转运包裹都选择了收货地址!');
                            return callback("err")
                        }

                        //身份证渠道需要验证选择的收货地址是否通过验证
                        var addressItem =
                            $scope.addressListData.filter(function (value) {
                                return value.transactionNumber == packageItem.addressNumber;
                            })[0];

                        // usps 不用校验地址是否验证
                        if (addressItem != undefined &&
                            $scope.data.shipServiceItem != undefined &&
                            $scope.data.shipServiceItem.needIDCard === 1 &&
                            addressItem.verifyMark !== 1 &&
                            $scope.data.shipServiceItem.shipServiceId !== 9) {
                            alertify.alert('提示', '收货地址:[<small style="color:red">' + addressItem.stateOrProvince + ' ' +
                                addressItem.address1 + ' ' + addressItem.zipcode + ' ' + addressItem.receivePersonName +
                                '</small>]还未通过身份验证。当前发货渠道:[<small style="color:red">' + $scope.data.shipServiceItem.shipServiceName +
                                '</small>]要求收货地址必须提供验证通过的身份证信息,请更改地址信息或者选择其他收货地址。');
                            return callback("err")
                        }

                        //USPS渠道要求收货人姓名必须为英文/拼音,地址为拼音
                        if (addressItem != undefined &&
                            $scope.data.shipServiceItem != undefined &&
                            $scope.data.shipServiceItem.requireEnglish4Name === 1 &&
                            ($scope.data.shipServiceItem === 9 ||
                                $scope.data.shipServiceItem === 10) &&
                            !/^[^\u4e00-\u9fa5]+$/i.test(addressItem.receivePersonName)) {
                            alertify.alert('提示', '收货地址:[<small style="color:red">' + addressItem.stateOrProvince + ' ' +
                                addressItem.address1 + ' ' + addressItem.zipcode + ' ' + addressItem.receivePersonName +
                                '</small>]中包括非英文字符。当前发货渠道:[<small style="color:red">' + $scope.data.shipServiceItem.shipServiceName +
                                '</small>]要求收货人姓名必须为英文或者拼音,请更改收货人信息或者选择其他收货人。注意不能包括空格之外的其他特殊字符.');
                            return callback("err")
                        }

                        if (addressItem != undefined &&
                            $scope.data.shipServiceItem != undefined &&
                            $scope.data.shipServiceItem.requireEnglish4Address === 1 &&
                            !/^[^\u4e00-\u9fa5]+$/i.test(addressItem.address1 + addressItem.zipcode)) {
                            alertify.alert('提示', '收货地址:[<small style="color:red">' + addressItem.stateOrProvince + ' ' +
                                addressItem.address1 + ' ' + addressItem.zipcode + ' ' + addressItem.receivePersonName +
                                '</small>]中包括非英文字符。当前发货渠道:[<small style="color:red">' + $scope.data.shipServiceItem.shipServiceName +
                                '</small>]要求收货人地址必须为英文拼音,请更改收货人信息或者选择其他收货人。注意不能包括空格之外的其他特殊字符.');
                            return callback("err")
                        }

                        if (addressItem != undefined &&
                            $scope.data.shipServiceItem != undefined &&
                            $scope.data.shipServiceItem.requireEnglish4Address != 1 &&
                            /^[^\u4e00-\u9fa5]+$/i.test(addressItem.address1 + addressItem.zipcode)) {
                            alertify.alert('提示', '收货地址:[<small style="color:red">' + addressItem.stateOrProvince + ' ' +
                                addressItem.address1 + ' ' + addressItem.zipcode + ' ' + addressItem.receivePersonName +
                                '</small>]中包括非中文字符。当前发货渠道:[<small style="color:red">' + $scope.data.shipServiceItem.shipServiceName +
                                '</small>]要求收货人地址必须为中文,请更改收货人信息或者选择其他收货人。注意不能包括空格之外的其他特殊字符.');
                            return callback("err")
                        }

                        //商品主类别渠道限制规则
                        var currentMainCategory = $filter('filter')($scope.categories, function (categoryItem) { return categoryItem.parentid === $scope.calculateCategory });
                        /******************** */
                        //1 - quantityLimit
                        if (currentMainCategory != undefined &&
                            currentMainCategory.quantityLimit != undefined &&
                            orderItem.quantity > currentMainCategory.quantityLimit) {
                            alertify.alert('提示', '商品主类别:[<small style="color:red">' + currentMainCategory.name +
                                '</small>]每个包裹限制数量:[' + currentMainCategory.quantityLimit + '].');
                            return callback("err")
                        }
                        //2 - surcharge_maxValueAmount
                        if (currentMainCategory != undefined &&
                            currentMainCategory.surcharge_maxValueAmount != undefined &&
                            orderItem.quantity * orderItem.unitprice > currentMainCategory.surcharge_maxValueAmount) {
                            alertify.alert('提示', '商品主类别:[<small style="color:red">' + currentMainCategory.name +
                                '</small>]每个包裹限制价值不能超过:[' + currentMainCategory.surcharge_maxValueAmount + ']美元.请使用USPS渠道.');
                            return callback("err")
                        }
                        // //3 - weightLimit
                        // if(currentMainCategory != undefined &&
                        //     currentMainCategory.weightLimit != undefined &&
                        //     shippingItem.packageWeight > currentMainCategory.weightLimit ){
                        //         alertify.alert('提示', '商品主类别:[<small style="color:red">' + currentMainCategory.name +
                        //             '</small>]每个包裹限制重量不能超过:['+ currentMainCategory.weightLimit + ']磅.');
                        //            return callback("err")
                        //     }

                        /******************* */

                        if (!packageItem.goodsCategory) {

                            alertify.alert('提示', '请确保每个转运包裹都选择了商品类别!');
                            return callback("err")
                        }
                    }
                    orderSvr.cacluTariff(orderItems).then(function (tariff) {
                        tariff = tariff.data
                        if (tariff.code == "999") {
                            alertify.alert('提示', tariff.msg);
                            //  false;
                            return callback("err")
                        } else {
                            $scope.data.tariffMoney = tariff.data
                            callback(null, null)
                            $scope.calculateFee();
                        }

                    })

                } else {
                    return callback(null, null)
                }
            }

            $scope.countFee = {};

            $scope.calculateFee = function (category, ctrlType) {
                var pointTotal = $scope.currentUser.myPoint;
                if ($scope.data.usePoint > pointTotal) {
                    $scope.data.usePoint = pointTotal;
                }
                var getPackageFirstWeight = function (shipService) {
                    var packageWeight = 0,
                        outboundItems = $scope.shippingItems;
                    for (var i = 0, ii = outboundItems.length; i < ii; i++) {
                        packageWeight += outboundItems[i].packageWeight;
                    }
                    var carton = Math.ceil(packageWeight / shipService.maxWeight);
                    return Math.max(carton, $scope.outboundPackages.length);
                }
                var getPackageWeight = function (shipService, roundup) {
                    var packageWeight = 0,
                        outboundItems = $scope.shippingItems;
                    for (var i = 0, ii = outboundItems.length; i < ii; i++) {
                        packageWeight += (outboundItems[i].packageWeight * 1);
                        if (outboundItems[i].isFastOrder) {
                            packageWeight += 0.5; //极速原单的重量要多加0.5
                        }
                    }
                    var carton = getPackageFirstWeight(shipService);

                    packageWeight += (carton - 1) * shipService.incr_weight_per_split;
                    if (parseFloat((packageWeight - parseInt(packageWeight)).toFixed(2)) >= roundup)
                        packageWeight = Math.ceil(packageWeight);
                    return packageWeight;
                },
                    getShippingFee = function (packageWeight, firstWeight, continuedWeight, shipService) {
                        if (packageWeight < 1) packageWeight = 1;
                        var carton = getPackageFirstWeight(shipService)

                        return firstWeight * carton + (packageWeight - carton) * continuedWeight;
                    },
                    setInsuranceFee = function (calculData, shipService) {
                        if (!shipService) shipService = data.shipServiceItem;

                        if (!calculData) calculData = {};

                        if ($scope.data.insuranceMark == 1) {
                            calculData.insuranceFee = ($scope.data.declareGoodsValue || 0) * shipService.insuranceFeeRate * (shipService.RMBExchangeRate || 6.95)
                            // calculData.totalCount =  calculData.totalCount +  $scope.data.tariffMoney;
                        } else {
                            calculData.insuranceMark = 0;
                            calculData.insuranceFee = 0;
                        }
                    },
                    calculate = function (result) {
                        var shipService = data.shipServiceItem,
                            packages = getOutboundPackage('CUL'),
                            packageItem = packages[0],
                            calculData = {
                                packageWeight: 0,
                                tariffMoney: 0,
                                shippingFee: 0,
                                valueAddFee: ($scope.data.valueAddFee * 1) || 0,
                                tip: ($scope.data.tip * 1) || 0,
                                usePoint: ($scope.data.usePoint * -1) || 0
                            },
                            calRule = $filter('filter')(result.fee, function (ruleItem) { return ruleItem.category === packageItem.goodsCategory; })[0];
                        if (!calRule) calRule = $filter('filter')(result.fee, function (ruleItem) { return ruleItem.category === 0; })[0];
                        var ruleDetail = $.grep(calRule.detail, function (n) { return n.currency == "RMB" })[0];

                        calculData.packageWeight = getPackageWeight(shipService, result.roundup);
                        calculData.shippingFee += getShippingFee(calculData.packageWeight, ruleDetail.firstWeight, ruleDetail.continuedWeight, shipService);

                        setInsuranceFee(calculData, shipService);
                        calculData.tariffMoney = $scope.data.tariffMoney
                        calculData.valueAddFee = $scope.data.valueAddFee
                        calculData.totalCount = (calculData.insuranceFee || 0) + (calculData.shippingFee || 0) + (calculData.tip || 0) + (calculData.usePoint || 0) + (calculData.tariffMoney || 0) + (calculData.valueAddFee || 0);

                        $timeout(function () {
                            $scope.countFee = calculData;
                        })
                    };
                // (shipService.RMBExchangeRate || 6.95);

                //需要即时计算的费用不需要调用API
                if (!!category) {
                    if (category === 'insuranceMark') {
                        setInsuranceFee($scope.countFee);
                    } else if (category === 'tip') {
                        $scope.countFee.tip = ($scope.data.tip * 1) || 0;
                    } else if (category === 'usePoint') {
                        $scope.countFee.usePoint = ($scope.data.usePoint * -1) || 0;
                    } else if (category === 'extraServce') {
                        $scope.countFee.valueAddFee = ($scope.data.valueAddFee * 1) || 0;
                    }
                    $scope.countFee.totalCount = ($scope.countFee.insuranceFee || 0) + ($scope.countFee.shippingFee || 0) + ($scope.countFee.tip || 0) + ($scope.countFee.usePoint || 0) + ($scope.countFee.valueAddFee || 0) +  ($scope.countFee.tariffMoney || 0);
                    if (ctrlType !== 'checkbox') {
                        // if (!angular.isNumber($scope.data.declareGoodsValue) || $scope.data.declareGoodsValue <= 0) $scope.data.declareGoodsValue = 0;
                        if (!angular.isNumber($scope.data.tip) || $scope.data.tip <= 0) $scope.data.tip = 0;
                    }

                    return;
                }

                settlementSvr
                    .getRule({
                        customerNumber: $scope.$root.currentUser.customerNumber,
                        warehouseNumber: getWorkhouseNumber(),
                        shipServiceId: $scope.data.shipServiceItem.shipServiceId
                    })
                    .then(function (result) {
                        if (result) {
                            calculate(result.data);
                        }
                    });
            }

            // 增值服务费用
            $scope.getValueAddFee = function () {
                $scope.data.valueAddFee = 0;

                if ($scope.data.pack_steadyInner == '1') {
                    $scope.data.valueAddFee = $scope.data.valueAddFee + 3
                }
                if ($scope.data.pack_addCarton == '1') {
                    $scope.data.valueAddFee = $scope.data.valueAddFee + 20
                }
                if ($scope.data.pack_checkCount == '1') {
                    $scope.data.valueAddFee = $scope.data.valueAddFee + 20
                }
                $scope.calculateFee('extraServce')
            }
            //$scope.categories = [];
            //$scope.loadGoodsCategory = function () {
            //    orderSvr.getGoodsCategories()
            //        .then(function (result) {
            //            $scope.categories = result.data;
            //        })
            //}
            //$scope.loadGoodsCategory();

            $scope.wizardSubmit = function () {
                $scope.submitOrder();
            }
        }
    ]);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});