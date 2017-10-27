'use strict';

angular.module('culwebApp')
    .factory('OrderSvr', ['$http', function ($http) {

        var shippingCarriers = [{
            id: 1,
            name: 'DHL'
        }, {
            id: 2,
            name: 'EMS'
        }, {
            id: 3,
            name: 'FEDEX'
        }, {
            id: 4,
            name: 'UPS'
        }, {
            id: 5,
            name: 'USPS'
        }, {
            id: 6,
            name: '其他快递'
        }];
        var goodsCategories = [{
            key: '食品',
            text: '食品'
        }, {
            key: '衣服',
            text: '衣服'
        }, {
            key: '鞋子',
            text: '鞋子'
        }, {
            key: '餐具',
            text: '餐具'
        }, {
            key: '包',
            text: '包'
        }, {
            akey: '电器',
            text: '电器'
        }, {
            key: '首饰',
            text: '首饰'
        }, {
            key: '化妆品',
            text: '化妆品'
        }, {
            key: '表',
            text: '表'
        }, {
            key: '音像文化',
            text: '音像文化'
        }, {
            key: '玩具',
            text: '玩具'
        }];
        var packageCountItems = [{
            key: 1,
            text: '1'
        }, {
            key: 2,
            text: '2'
        }, {
            key: 3,
            text: '3'
        }, {
            key: 4,
            text: '4'
        }];

        return {
            addShippingNotice: function (shippingNotice) {
                return $http.post(cul.apiPath + '/inboundpackage', {
                    customerNumber: shippingNotice.customerNumber,
                    status: 'Intransit',
                    carrierName: shippingNotice.carrierName,
                    trackingNumber: shippingNotice.trackingNumber,
                    warehouseNumber: shippingNotice.warehouseNumber,
                    packageDescription: shippingNotice.packageDescription,
                    packageWeight: shippingNotice.packageWeight,
                    packageNote: shippingNotice.packageNote,
                    isFastShip: (shippingNotice.isFastOrder ? 1 : 0)
                });
            },
            deleteShippingNotice: function (transactionNumber) {
                return $http.delete(cul.apiPath + '/inboundpackage?number=' + transactionNumber);
            },
            retrieveShippingNoticeList: function (index, pageSize, paras) {
                if (!paras) paras = {};

                paras.status = paras.status ? [paras.status] : ["Intransit", "Inbound", "Onshelf"]
                paras.excludeInOrderPackage = true;//Doesn't show packages with order submitted.

                return $http.post(cul.apiPath + '/inboundpackage/list', $.extend({
                    pageInfo: {
                        pageSize: pageSize,
                        pageIndex: index || 1
                    },
                    customerNumber: paras.customerNumber,
                }, paras));
            },
            getWarehouses: function () {
                var cacheData = window.sessionStorage.getItem('cache_warehouse');
                if (!!cacheData) {
                    return {
                        then: function (callback) {
                            callback && callback({
                                data: JSON.parse(cacheData)
                            });
                        }
                    }
                }
                var obj = { status: 1 };
                console.log("wonderful world");
                return $http.get(cul.apiPath + '/warehouse', obj);
            },
            getShipChannelItems: function () {
                return $http.post(cul.apiPath + '/shipservice/list');
            },
            getOrderList: function (index, queryPara, pageSize) {
                var paras = {
                    pageInfo: {
                        pageSize: pageSize || 10,
                        pageIndex: index || 1
                    },
                    customerNumber: queryPara.customerNumber,
                    dateFrom: queryPara.dateFrom,
                    dateTo: queryPara.dateTo,
                };

                if (queryPara.orderStatus) {
                    paras.orderStatus = queryPara.orderStatus
                }
                angular.extend(paras, queryPara);


                return $http.post(cul.apiPath + '/order/list', paras);
            },
            getOrderInfo: function (orderId) {
                return $http.get(cul.apiPath + '/order/' + orderId);
            },
            getOrderPackageNumber: function (orderId) {
                return $http.get(cul.apiPath + '/order/package/' + orderId);
            },
            submitOrder: function (orderData) {
                return $http.post(cul.apiPath + '/order', {
                    //客户编号
                    customerNumber: orderData.customerNumber,
                    //订单编号，填写客户编号+客户收件标识，如KX142QPTN
                    orderNumber: orderData.orderNumber,
                    //发货渠道(暂时注释)
                    shipServiceId: orderData.shipServiceId,
                    //货物类别
                    goodsCategory: orderData.goodsCategory,
                    //申报价值：number
                    declareGoodsValue: orderData.declareGoodsValue,
                    //申报品名
                    declareGoodsName: orderData.declareGoodsName,
                    //取出发票 0,1
                    pack_takeoutInvoice: orderData.pack_takeoutInvoice,
                    //加急处理 0,1
                    pack_urgentProcess: orderData.pack_urgentProcess,
                    //内件加固 0,1
                    pack_steadyInner: orderData.pack_steadyInner,
                    //更换外箱 0,1
                    pack_replaceCarton: orderData.pack_replaceCarton,
                    //去除内件 0,1
                    pack_removeInner: orderData.pack_removeInner,
                    //购买保险标识 0,1
                    insuranceMark: (orderData.insuranceMark ? 1 : 0),
                    //使用积分标识 0,1
                    pointMark: (orderData.usePoint > 0 ? 1 : 0),
                    //使用积分数 number
                    usedPoint: orderData.usePoint,
                    //积分抵现 number
                    pointCash: orderData.pointCash,
                    //小费 number
                    tip: orderData.tip,
                    //仓库编号
                    warehouseNumber: orderData.warehouseNumber,
                    //留言内容
                    message: orderData.message || '',
                    //入库包裹
                    inboundPackages: orderData.inboundPackages || [],
                    //收件人
                    shipToAddresses: orderData.shipToAddresses || [],
                    //出库包裹
                    outboundPackages: orderData.outboundPackages || [],
                    //订单商品
                    orderItems: orderData.orderItems || [],
                    //箱子个数
                    cartonCount: orderData.cartonCount || 0,
                    goodsCount: orderData.goodsCount,
                    isFastOrder: orderData.isFastOrder ? 1 : 0,
                    packageWeight: orderData.packageWeight,
                    tariffMoney:orderData.tariffMoney ,
                    
                });
            },
            getOrderStepList: function (trackingNumber) {
                return $http.put(cul.apiPath + '/order/step', {
                    trackingNumber: trackingNumber
                });
            },
            getOrderTrackingList: function (trackingNumber) {
                return $http.get(cul.apiPath + '/outboundpackage/track/' + trackingNumber);
            },
            // saveMessageBack: function(orderMessageNumber, messageContent) {
            saveMessageBack: function (questionMessageItem) {
                return $http.post(cul.apiPath + '/customermessage/log', {
                    messageNumber: questionMessageItem.orderMessageNumber,
                    message: questionMessageItem.messageContent,
                    images: questionMessageItem.images,
                    status: 0
                });
            },
            saveMessage: function (orderMessageItem) {
                return $http.post(cul.apiPath + '/customermessage/log', {
                    messageNumber: orderMessageItem.orderMessageNumber,
                    message: orderMessageItem.messageContent,
                    images: orderMessageItem.images,
                    status: 0
                });
            },
            deleteOrder: function (orderNumber) {
                return $http.delete(cul.apiPath + '/order?number=' + orderNumber);
            },

            getMessage: function (messageNumber) {
                return $http.get(cul.apiPath + '/customermessage/' + messageNumber);
            },
            /**
             * 更新订单留言消息的状态，从未读变为已读
             */
            updateMessageStatus: function (messageNumber) {
                return $http.put(cul.apiPath + '/customermessage/log', {
                    messageNumber: messageNumber,
                    status: 0        // 0-已读
                });
            },
            paymentOrder: function (orderNumber) {
                return $http.put(cul.apiPath + '/order/payment', {
                    orderNumber: orderNumber
                });
            },
            getGoodsCategories: function () {
                return $http.get(cul.apiPath + '/item/category/list');
            },

            submitProduct: function (model) {
                if (!!model.transactionNumber) {
                    return $http.put(cul.apiPath + '/item', model);
                }
                return $http.post(cul.apiPath + '/item', model);
            },

            getProducts: function (queryPara) {
                return $http.post(cul.apiPath + '/item/list', queryPara);
            },
            getProduct: function (itemNumber) {
                return $http.get(cul.apiPath + '/item?itemNumber=' + itemNumber);
            },
            deleteProducts: function (itemNumbers) {
                return $http.put(cul.apiPath + '/item/batch/delete', { itemNumbers: itemNumbers });
            },
            getItemInventory: function (queryPara) {
                return $http.post(cul.apiPath + '/item/inventory/log/list', queryPara);
            },
            batchProductsUpload: function (form) {
                return $http.post(cul.apiPath + '/files/upload', form, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                });
            },
            batchProductsVerify: function (fileId) {
                return $http.post(cul.apiPath + '/item/batch/check', {
                    "fileId": fileId
                });
            },
            batchProductsCreate: function (fileId) {
                return $http.post(cul.apiPath + '/item/batch/create', {
                    "fileId": fileId
                });
            },
            transportItem: function (model) {
                if (!!model.transactionNumber) {
                    return $http.put(cul.apiPath + '/item/transport', model);
                }
                return $http.post(cul.apiPath + '/item/transport', model);
            },
            getTransportItems: function (queryPara) {
                return $http.post(cul.apiPath + '/item/transport/list', queryPara);
            },
            getTransportItem: function (transportNumber) {
                return $http.get(cul.apiPath + '/item/transport?receiptNumber=' + transportNumber);
            },
            deleteTransportItem: function (transportNumber) {
                return $http.post(cul.apiPath + '/item/transport/void', { receiptNumber: transportNumber });
            },
            batchTransportUpload: function (form) {
                return $http.post(cul.apiPath + '/files/upload', form, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                });
            },
            batchTransportVerify: function (fileId) {
                return $http.post(cul.apiPath + '/item/transport/batch/check', {
                    "fileId": fileId
                });
            },
            batchTransportCreate: function (fileId) {
                return $http.post(cul.apiPath + '/item/transport/batch/create', {
                    "fileId": fileId
                });
            },
            cacluTariff: function (options, callback) {
             return   $http.post(cul.apiPath + "/order/cacluTariff", options);
            },
            shippingCarriers: shippingCarriers,
            goodsCategories: goodsCategories,
            packageCountItems: packageCountItems
        };
    }]);