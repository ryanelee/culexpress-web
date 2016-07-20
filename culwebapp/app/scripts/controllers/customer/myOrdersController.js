﻿'use strict';

angular
    .module('culwebApp')
    .controller('MyOrdersController', ['$scope', '$compile', '$timeout', '$state', '$stateParams', 'OrderSvr', 'addressSvr', 'settlementSvr', '$filter', 'SweetAlert',
        function ($scope, $compile, $timeout, $state, $stateParams, orderSvr, addressSvr, settlementSvr, $filter, SweetAlert) {
            if (!$scope.$root.orderOptions) $scope.$root.orderOptions = {};

            $scope.orderItems = [];
            $scope.addOrderItem = function ($event, shippingItem) {
                var orderItem = {
                    id: shippingItem.orderItems.length + 1,
                    packageNumber: shippingItem.trackingNumber,
                    itemBrand: '',
                    description: '',
                    quantity: '',
                    unitprice: ''
                }, items = shippingItem.orderItems;

                $timeout(function () {
                    if (!items) items = [];
                    items.push(orderItem);

                    shippingItem.orderItems = items;

                    $scope.orderItems = angular.copy(items);
                });
            }
            $scope.removeOrderItem = function ($event, itemIndex, shippingItem) {
                if (shippingItem.orderItems.length > 1) {
                    $event.stopPropagation && $event.stopPropagation();
                    shippingItem.orderItems.splice(itemIndex, 1);
                } else {
                    SweetAlert.swal('提示', '请至少保留一件商品!', 'warning');
                    return false;
                }
            }


            $scope.usePointChanged = function () {
                var pointTotal = $scope.$root.currentUser.myPoint;
                if (!angular.isNumber($scope.data.usePoint) || $scope.data.usePoint <= 0) $scope.data.usePoint = 0;
                if ($scope.data.usePoint > pointTotal) {
                    $scope.data.usePoint = pointTotal;
                }
            }


            $scope.selectedChannel = function () {
                $scope.$root.orderOptions.shipServiceItem = $scope.data.shipServiceItem;
                if (!!$scope.data.shipServiceItem) {
                    //var categoryItem = $filter('filter')($scope.warehouses, function (item) { return item.warehouseNumber === getWorkhouseNumber(); });
                    $scope.goodsCategories = $scope.data.shipServiceItem.itemTypeList;
                }
                else {
                    $scope.goodsCategories = [];
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
                        if (!window.sessionStorage.getItem('cache_warehouse')) {
                            window.sessionStorage.setItem('cache_warehouse', JSON.stringify(result.data));
                        }
                        else if (!$scope.shippingItems || $scope.shippingItems.length <= 0) {
                            $scope.shippingItems = orderSvr.selectedShippingItems;
                        }

                        $scope.warehouses = result.data;

                        // if ($scope.$root && $scope.$root.orderOptions) {
                        //     $scope.$root.orderOptions.warehouses = $scope.warehouses;
                        // }
                        for (var i = 0, ii = $scope.warehouses.length; i < ii; i++) {
                            if ($state.current.name === 'customer.myorders' || $scope.warehouses[i].warehouseNumber == getWorkhouseNumber()) {
                                var shipServiceList = $scope.warehouses[i].shipServiceList;
                                for (var j = 0, jj = shipServiceList.length; j < jj; j++) {
                                    var queried = $filter('filter')($scope.allShipChannels, function (channelItem) {
                                        return channelItem.shipServiceId === shipServiceList[j].shipServiceId;
                                    });
                                    if (queried.length <= 0) {
                                        $scope.allShipChannels.push(shipServiceList[j]);
                                    }
                                }
                            }
                        }
                    });
            }
            else {
                $scope.allShipChannels = [];
                $scope.warehouses = $scope.$root.orderOptions.warehouses;
                for (var m = 0, mm = $scope.warehouses.length; m < mm; m++) {
                    if ($state.current.name === 'customer.myorders' || $scope.warehouses[m].warehouseNumber == getWorkhouseNumber()) {
                        var shipServiceList = $scope.warehouses[m].shipServiceList;
                        for (var n = 0, nn = shipServiceList.length; n < nn; n++) {
                            var queried = $filter('filter')($scope.allShipChannels, function (channelItem) {
                                return channelItem.shipServiceId === shipServiceList[n].shipServiceId;
                            });
                            if (queried.length <= 0) {
                                $scope.allShipChannels.push(shipServiceList[n]);
                            }
                        }
                    }
                }
            }
            if (!!$scope.$root.orderOptions.shipServiceItem) $scope.data.shipServiceItem = $scope.$root.orderOptions.shipServiceItem;

            if (!$scope.$root.orderOptions.shippingItems || $scope.$root.orderOptions.shippingItems.length <= 0) {
                $scope.$root.orderOptions.shippingItems = $scope.shippingItems = orderSvr.selectedShippingItems || [];
            }
            else {
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
            }
            else if ($state.current.name === 'customer.submitorder') {
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
                }, {
                    key: 'outBoundTrackingNumber',
                    text: '出库包裹编号'
                }];

            var queryPara = $scope.queryPara = {
                searchKeyName: 'orderNumber',
                dateRange: 'last6Months',
                orderStatus: 'Unpaid',

            };
            var initQueryParaData = function () {
                $scope.rangeItems = [
                    {
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

            if (!!$stateParams.status) {
                $scope.queryPara.orderStatus = $stateParams.status;
            }
            $scope.orderListData = [];
            $scope.queryOrder = function (index, paras) {
                $scope.pagedOptions.index = index;
                orderSvr
                    .getOrderList(index, angular.extend({
                        customerNumber: $scope.$root.currentUser.customerNumber,
                        orderStatus: $scope.queryPara.orderStatus
                    }, paras || {}))
                    .then(function (result) {
                        if (result.data) {
                            $scope.pagedOptions.total = result.data.pageInfo.totalCount;
                            $scope.orderListData = result.data.data;
                        }
                    });
            }
            $scope.queryOrder();

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
            $scope.searchOrder = function () {
                $scope.queryOrder(1, $scope.queryPara);
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
                var packageItems = getOutboundPackage('UMI');
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
                        }), isFastOrder = $scope.shippingItems[0].isFastOrder;
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
                if ($scope.outboundPackages && $scope.outboundPackages.length) {
                    for (var i = 0, ii = $scope.outboundPackages.length; i < ii; i++) {
                        var packageItem = $scope.outboundPackages[i],
                            packageNumber = packageItem.trackingNumber,
                            orderItems = [];
                        for (var j = 0, jj = packageItem.orderItems.length; j < jj; j++) {
                            var orderItem = packageItem.orderItems[j];
                            orderItem.packageNumber = packageNumber;
                            if (angular.isObject(orderItem.goodsCategory)) {
                                orderItem.goodsCategory = orderItem.goodsCategory.goodsCategory;
                            }
                            orders.push(orderItem);
                        }
                    }
                }
                return orders;
            }




            var getGoodsCategory = function () {
                if (angular.isObject(data.goodsCategory)) {
                    return data.goodsCategory.goodsCategory;
                }
                else {
                    return data.goodsCategory || 'A';
                }
            }
            $scope.outboundPackages = [{
                orderItems: [{}]
            }];

            $scope.orderBinning = function (binningItem) {
                var allItems = [], newOutboundItem = angular.copy(binningItem),
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

                var currentItem = $filter('filter')($scope.categories, function (categoryItem) { return categoryItem.cateid === val })[0];
                if (!!currentItem) {
                    packageItem.subCategories = currentItem.sub;
                }
                if (propName !== 'goodsCategory') {
                    packageItem.goodsCategory = packageItem.subCategories[0].cateid;
                }
            }



            $scope.removePackage = function (packageItem) {
                if ($scope.outboundPackages.length > 1) {
                    var index = $scope.outboundPackages.indexOf(packageItem);
                    $scope.outboundPackages.splice(index, 1);
                }
                else {
                    SweetAlert.swal('提示', '请至少保留一个转运包裹!', 'warning');
                    return false
                }
            }


            $scope.redirectToAddressInfo = function (addressItem) {
                $state.go('customer.myaddress', { addressId: addressItem.transactionNumber });
            }

            var preSubmitToService = function (data) {
                var text = '';
                if (!data.isFastOrder) {
                    text = "确定提交订单?";
                }
                else {
                    if ($scope.$root.currentUser.accountBalance < $scope.countFee.totalCount) {
                        SweetAlert.swal('提示', '您需要支付' + $scope.countFee.totalCount + '元，而您的账户余额为' + $scope.$root.currentUser.accountBalance + '元,请充值后再进行支付!', 'warning');
                        return false;
                    }
                    text = '您好，感谢您提交了CUL EXPRESS极速转运服务订单， 按确定即可完成本次订单的提交，您的包裹预估重量为' +
                        parseFloat($scope.shippingItems[0].packageWeight + 0.5) +
                        '磅，我们会锁定您' +
                        $scope.countFee.packageWeight +
                        '磅=' +
                        $scope.countFee.totalCount +
                        '元的预收运费，该金额不能做其他订单的交易，等到该极速转运订单出库后会计算出最终运费,如有多余运费会退回到您的CUL EXPRESS账户余额中，详情可到财务明细中查询。';
                }

                SweetAlert.swal({
                    title: '确认',
                    text: text,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                }, function (isConfirm) {
                    if (isConfirm) {
                        $('.sa-confirm-button-container button.confirm').attr({ disabled: true });
                        orderSvr
                            .submitOrder(data)
                            .then(function (result) {
                                if (result.data.orderNumber) {
                                    SweetAlert.swal('提示', '提交成功.', 'success');
                                    $state.go('customer.myorders');
                                }
                            }, function (result) {
                                if (result.data.message) {
                                    SweetAlert.swal('错误', result.data.message, 'error');
                                }
                            });
                    }
                });
            }
            $scope.submitOrder = function () {

                var orderItems = $scope.orderItems = angular.copy(getOrders());
                $scope.data.isFastOrder = $scope.shippingItems[0].isFastOrder;
                if (!!$scope.data.isFastOrder) {
                    if ($scope.$root.currentUser.accountBalance < $scope.countFee.totalCount) {
                        SweetAlert.swal('提示', '您的帐户余额不足，无法提交极速原单!', 'warning');
                        orderSvr.selectedShippingItems = [];
                        $state.go('customer.shippingnoticelist');
                        return false;
                    }
                    //$scope.data.packageWeight = $scope.shippingItems[0].packageWeight;
                }



                $scope.data.outboundPackages = getOutboundPackage('UMI')
                $scope.data.orderItems = orderItems;
                $scope.data.shipToAddresses = getShippingAddressNumber().length <= 0 ? [{ addressNumber: '' }] : getShippingAddressNumber();
                $scope.data.inboundPackages = getInboundPackages();
                $scope.data.warehouseNumber = getWorkhouseNumber();
                $scope.data.goodsCategory = getGoodsCategory();
                $scope.data.orderNumber = $scope.$root.currentUser.customerNumber + $scope.$root.currentUser.receiveIdentity;
                $scope.data.cartonCount = data.shippingPackageCount;
                $scope.data.message = data.priceAdjustMemo;
                $scope.data.shipServiceId = data.shipServiceItem.shipServiceId;
                preSubmitToService($scope.data);
            }

            $scope.deleteOrder = function (number) {
                if (!number) return false;
                SweetAlert.swal({
                    title: "确定要删除订单[" + number + "]?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                }, function (isConfirm) {
                    if (isConfirm) {
                        orderSvr.deleteOrder(number)
                            .then(function (result) {
                                if (result.data.success) {
                                    SweetAlert.swal('提示', '删除成功.', 'success');
                                    $scope.queryOrder();
                                }
                            }, function (result) {
                                if (result.data.message) {
                                    SweetAlert.swal('错误', result.data.message, 'error');
                                }
                            });

                    }
                });
            }

            var payOrderServie = function (orderItem, callback) {
                orderSvr.paymentOrder(orderItem.orderNumber)
                    .then(function (result) {
                        if (result.data.success) {
                            callback && callback();
                            SweetAlert.swal('提示', '支付成功.', 'success');

                            //支付之后刷新一下全局余额
                            $scope.$root.autologin(function (result) {
                                $scope.$root.currentUser.accountBalance = result.accountBalance;
                                return false;
                            });
                        }

                    }, function (result) {
                        if (result.data.message) {
                            SweetAlert.swal('错误', result.data.message, 'error');
                        }
                    });
            }

            $scope.payOrder = function (orderItem) {
                if (!orderItem) return false;
                if (!orderItem.totalCount) {
                    SweetAlert.swal('提示', '订单还未计价,不能支付!', 'warning');
                    return false;
                }

                if ($scope.$root.currentUser.accountBalance < orderItem.totalCount) {
                    SweetAlert.swal('提示', '您需要支付' + orderItem.totalCount + '元，而您的账户余额为' + $scope.$root.currentUser.accountBalance + '元,请充值后再进行支付!', 'warning');
                    return false;
                }

                SweetAlert.swal({
                    title: "您将被扣款" + orderItem.totalCount + "元，确定支付订单?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                }, function (isConfirm) {
                    if (isConfirm) {
                        $('.sa-confirm-button-container button.confirm').attr({ disabled: true });
                        payOrderServie(orderItem);
                    }
                });
            }


            $scope.wizardOptions = {
                verified: true,
                mode: 'disable',
                nextText: '下一步',
                prevText: '上一步',
                submitText: '提交'
            }
            $scope.wizardValid = function (index, step) {

                if (!!$scope.showWeight) {
                    if (!$scope.data.packageWeight) {
                        SweetAlert.swal('提示', '请输入包裹重量!', 'warning');
                        return false;
                    }
                    else {
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.shippingItems[0].packageWeight = parseFloat($scope.data.packageWeight);
                            });
                        })

                    }
                }

                if (!data.shipServiceItem) {
                    SweetAlert.swal('提示', '请先选择发货渠道!', 'warning');
                    return false;
                }

                if (index === 2) {
                    var orderItems = getOrders();
                    for (var i = 0, ii = orderItems.length; i < ii; i++) {
                        var orderItem = orderItems[i];
                        if (!orderItem.itemBrand || !orderItem.description || !orderItem.quantity || !orderItem.unitprice) {
                            SweetAlert.swal('提示', '必须填写转运包裹申报商品信息，包括商品品牌、商品描述、数量和单价!', 'warning');
                            return false;
                        }

                    }

                    var packageItems = getOutboundPackage('UMI');
                    for (var j = 0, jj = packageItems.length; j < jj; j++) {
                        var packageItem = packageItems[j];
                        if (!packageItem.addressNumber) {
                            SweetAlert.swal('提示', '请确保每个转运包裹都选择了收货地址!', 'warning');
                            return false;
                        }

                        if (!packageItem.goodsCategory) {
                            SweetAlert.swal('提示', '请确保每个转运包裹都选择了商品类别!', 'warning');
                            return false;
                        }
                    }


                    //if (getShippingAddressNumber().length <= 0) {
                    //    SweetAlert.swal('提示', '必须选择至少一个收货地址!', 'warning');
                    //    return false;
                    //}

                    $timeout(function () {
                        $scope.calculateFee();
                    })
                }
            }

            $scope.countFee = {};

            $scope.calculateFee = function (category, ctrlType) {

                var getPackageFirstWeight = function (shipService) {
                    var packageWeight = 0, outboundItems = $scope.shippingItems;
                    for (var i = 0, ii = outboundItems.length; i < ii; i++) {
                        packageWeight += outboundItems[i].packageWeight;
                    }
                    var carton = Math.ceil(packageWeight / shipService.maxWeight);
                    return Math.max(carton, $scope.outboundPackages.length);
                }
                var getPackageWeight = function (shipService, roundup) {
                    var packageWeight = 0, outboundItems = $scope.shippingItems;
                    for (var i = 0, ii = outboundItems.length; i < ii; i++) {
                        packageWeight += (outboundItems[i].packageWeight * 1);
                        if (outboundItems[i].isFastOrder) {
                            packageWeight += 0.5;//极速原单的重量要多加0.5
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

                        if ($scope.data.insuranceMark == 1)
                            calculData.insuranceFee = ($scope.data.declareGoodsValue || 0) * shipService.insuranceFeeRate;
                        else {
                            calculData.insuranceMark = 0;
                            calculData.insuranceFee = 0;
                        }
                    },
                    calculate = function (rules) {
                        var shipService = data.shipServiceItem,
                            packages = getOutboundPackage('UMI'),
                            packageItem = packages[0],
                            calculData = {
                                packageWeight: 0,
                                shippingFee: 0,
                                tip: ($scope.data.tip * 1) || 0,
                            },
                            calRule = $filter('filter')(rules, function (ruleItem) { return ruleItem.goodsCategory === packageItem.goodsCategory; })[0];
                        if (!calRule) calRule = $filter('filter')(rules, function (ruleItem) { return ruleItem.goodsCategory === 0; })[0];

                        calculData.packageWeight = getPackageWeight(shipService, calRule.roundup);

                        calculData.shippingFee += getShippingFee(calculData.packageWeight, calRule.firstWeight, calRule.continuedWeight, shipService);

                        setInsuranceFee(calculData, shipService);

                        calculData.totalCount = (calculData.insuranceFee || 0) + (calculData.shippingFee || 0) + (calculData.tip || 0);

                        $timeout(function () {
                            $scope.countFee = calculData;
                        })
                    };

                //需要即时计算的费用不需要调用API
                if (!!category) {
                    if (category === 'insuranceMark') {
                        setInsuranceFee($scope.countFee);
                    }
                    else if (category === 'tip') {
                        $scope.countFee.tip = ($scope.data.tip * 1) || 0;
                    }
                    $scope.countFee.totalCount = ($scope.countFee.insuranceFee || 0) + ($scope.countFee.shippingFee || 0) + ($scope.countFee.tip || 0);
                    if (ctrlType !== 'checkbox') {
                        if (!angular.isNumber($scope.data.declareGoodsValue) || $scope.data.declareGoodsValue <= 0) $scope.data.declareGoodsValue = 0;
                        if (!angular.isNumber($scope.data.tip) || $scope.data.tip <= 0) $scope.data.tip = 0;
                    }

                    return;
                }


                settlementSvr
                    .getRule($scope.$root.currentUser.customerNumber)
                    .then(function (result) {
                        if (result) {
                            calculate(result.data.ruleDetails);
                        }
                    });
            }

            $scope.categories = [];
            $scope.loadGoodsCategory = function () {
                orderSvr.getGoodsCategories()
                    .then(function (result) {
                        $scope.categories = result.data;
                    })
            }
            $scope.loadGoodsCategory();



            $scope.wizardSubmit = function () {
                $scope.submitOrder();
            }

        }]);