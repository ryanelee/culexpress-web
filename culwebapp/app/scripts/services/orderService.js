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

                if(paras.status === 'InOrder'){
                    paras.status = ["Intransit", "Inbound", "Onshelf"];
                    paras.onlyIncludeInOrderPackage = true;//Only return packages with order submitted.                    
                }
                else if (paras.status == ''){//all
                    paras.excludeInOrderPackage = true;//Doesn't show packages with order submitted.
                    paras.status = ["Intransit", "Inbound", "Onshelf"];
                }
                else {
                    paras.excludeInOrderPackage = true;//Doesn't show packages with order submitted.
                    paras.status = paras.status ? [paras.status] : ["Intransit", "Inbound", "Onshelf"];
                }
                    

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
                    //加套外箱 0,1
                    pack_addCarton: orderData.pack_addCarton,
                    //清点拍照 0,1
                    pack_checkCount: orderData.pack_checkCount,
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
                    tariffMoney: orderData.tariffMoney,
                    // 增值服务
                    valueAddFee: orderData.valueAddFee
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

            
            /** 新建订单 当单列表 订单答应 开始 */
            
            getList: function (options, callback) {
                var customer_ids;

                var roles = JSON.parse($window.sessionStorage.getItem("role"));
                roles.forEach(function (role) {
                    customer_ids = $.grep([customer_ids, role.customer_ids], Boolean).join(",");
                });

                if (customer_ids != undefined && parseInt(customer_ids) !== 0) {

                    if (options["customerNumber"] != undefined &&
                        customer_ids.toString().split(",").indexof(options["customerNumber"].toUpperCase()) == -1) { //搜索指定customer#不在当前用户允许查询的customer权限中，直接返回空数据集
                        return;
                    };

                    if (options["customerNumber"] == undefined) //默认只返回具备权限查看customer的订单数据
                        options["customerNumber"] = customer_ids;
                };

                $http.post(cul.apiPath + "/order/list", options).success(function (result) {
                    $.each(result.data, function (index, item) {

                        item._orderStatus = _getOrderStatus(item.orderStatus);
                        item._printStatus = _getPrintStatus(item.printStatus);
                        item._shipToAddresses = [];
                        $.each(item.shipToAddresses, function (i, address) {
                            var _str = address.receivePersonName;
                            if (!!address.cellphoneNumber) _str += "(" + address.cellphoneNumber + ")";
                            if (item.shipServiceId != 9 && address.item != 10) {
                                _str += address.address1;
                            } else {
                                _str = _str + address.addressPinyin + address.address1_before;
                            }
                            if (!!address.receiveCompanyName) _str += address.receiveCompanyName;
                            if (!!address.zipcode) _str += "(" + address.zipcode + ")";
                            if ($.grep(item._shipToAddresses, function (n) { return n == _str }).length == 0) {
                                item._shipToAddresses.push(_str);
                            }
                        });
                        // CUL包裹单号list
                        item._outboundTrackingNumbers = [];
                        if (item.outboundPackages) {
                            $.each(item.outboundPackages, function (i, outboundPackage) {
                                item._outboundTrackingNumbers.push(outboundPackage.trackingNumber);
                            });
                        }
                        // 入库单号list
                        item._inboundTrackingNumbers = [];

                        if (item.inboundPackages && item.inboundPackages.length > 0) {
                            $.each(item.inboundPackages, function (i, inboundPackage) {
                                item._inboundTrackingNumbers.push(inboundPackage.trackingNumber);
                            });
                        }
                    });
                    callback(result);
                });
            },

            getExportUrl: function (options, callback) {
                var queryString = [];
                for (var key in options) {
                    if (key != "pageInfo") {
                        queryString.push(key + "=" + options[key]);
                    }
                }
                var _token = sessionStorage.getItem("token");
                if (!!_token) queryString.push("token=" + encodeURIComponent(_token));
                callback(cul.apiPath + "/order/list/export?" + queryString.join("&"));
            },

            getDetail: function (orderNumber, callback) {
                $http.get(cul.apiPath + "/order/" + orderNumber).success(function (result) {
                    result._orderStatus = _getOrderStatus(result.orderStatus);
                    result._printStatus = _getPrintStatus(result.printStatus);
                    callback(result);
                });
            },

            create: function (order, callback) {
                $http.post(cul.apiPath + "/order", order).success(function (result) {
                    callback(result);
                });
            },

            update: function (order, callback) {
                $http.put(cul.apiPath + "/order", order).success(function (result) {
                    callback(result);
                });
            },

            checkOrderNumber: function (order) {
                return $http.post(cul.apiPath + "/order/checkOrderNumber", order)
            },

            delete: function (searchOrder, callback) {
                $http.delete(cul.apiPath + "/order?number=" + searchOrder.orderNumber + "&orderNumberList=" + searchOrder.orderNumberList + "&deleteMessage=" + searchOrder.deleteMessage).success(function (result) {
                    console.log("result", result)
                    callback(result);
                });
            },

            offlineOrderCheckExcel: function (fileId, callback) {
                $http.post(cul.apiPath + "/order/offlineOrderCheckExcel", {
                    fileId: fileId
                }).success(function (result) {
                    callback(result);
                });
            },

            offlineOrderCreateExcel: function (fileId, callback) {
                $http.post(cul.apiPath + "/order/offlineOrderCreateExcel", {
                    fileId: fileId
                }).success(function (result) {
                    warehouseService.getWarehouse(function (warehouseList) {
                        $.each(result, function (i, order) {
                            var _warehouse = $.grep(warehouseList, function (n) { return n.warehouseNumber == order.warehouseNumber });
                            order.warehouseName = _warehouse.length > 0 ? _warehouse[0].warehouseName : "";
                        })
                        callback(result);
                    });
                });
            },

            generatePackageNumber: function (model, callback) {
                $http.post(cul.apiPath + "/outboundpackage/generate", model).success(function (result) {
                    callback(result);
                });
            },

            orderPackageUpdateByExcel: function (fileId, callback) {
                $http.post(cul.apiPath + "/order/batchUpdateOutboundPackageByExcel", {
                    fileId: fileId
                }).success(function (result) {
                    callback(result == "import successfully" ? true : result.message);
                });
            },

            updateOutboundPackage: function (model, callback) {
                $http.put(cul.apiPath + "/outboundpackage", model).success(function (result) {
                    callback(result);
                });
            },

            deleteOutboundPackage: function (numbers, callback) {
                //console.log("deleteOutboundPackage");
                //console.log(numbers);
                // $http.delete(cul.apiPath + "/outboundpackage?number=" + numbers.join(",")).success(function (result) {
                $http.post(cul.apiPath + "/deleteOutboundpackage", numbers).success(function (result) {
                    callback(result);
                });
            },
            getOutboundPackage: function (number, callback) {
                $http.get(cul.apiPath + "/outboundpackage/" + number).success(function (result) {
                    // $http.get(cul.apiPath + "/deleteOutboundpackage", numbers).success(function(result) {
                    callback(result);
                });
            },

            settlementForOffline: function (batchNumber, callback) {
                $http.get(cul.apiPath + "/order/settlement/offline/" + batchNumber).success(function (result) {
                    callback(result);
                });
            },

            outbound: function (model, callback) {
                $http.post(cul.apiPath + "/order/ship/offline", model).success(function (result) {
                    callback(result);
                });
            },

            outbound_vip: function (model, callback) {
                $http.post(cul.apiPath + "/order/ship/vip/" + model.orderNumber, model).success(function (result) {
                    callback(result);
                });
            },

            batchOutboundPackage_vip: function (orderNumbers, callback) {
                $http.post(cul.apiPath + "/order/ship/vip", {
                    orderNumber: orderNumber
                }).success(function (result) {
                    callback(result);
                });
            },

            updateOutboundPackageAndMessage: function (model, callback) {
                $http.put(cul.apiPath + "/order/message_package/offline", model).success(function (result) {
                    callback(result);
                });
            },

            settlementForOnline: function (orderNumber, callback) {
                $http.get(cul.apiPath + "/order/settlement/online/" + orderNumber).success(function (result) {
                    callback(result);
                });
            },

            batchUpdate: function (orderArray, callback) {
                $http.post(cul.apiPath + "/order/batchUpdate", orderArray).success(function (result) {
                    callback(result);
                });
            },

            orderTrackUpdateByExcel: function (fileId, callback) {
                $http.post(cul.apiPath + "/order/batchUpdateOrderStepByExcel", {
                    fileId: fileId
                }).success(function (result) {
                    callback(result == "import successfully" ? true : result.message);
                });
            },

            printOrder: function (orderNumbers, callback) {
                $http.put(cul.apiPath + "/order/print", {
                    orderNumber: orderNumbers
                }).success(function (result) {
                    callback(result);
                });
            },

            activitiesList: function (options, callback) {
                $http.post(cul.apiPath + "/order/activities", options).success(function (result) {
                    $.each(result.data, function (index, item) {
                        item._orderStatus = _getOrderStatus(item.orderStatus);
                        item._printStatus = _getPrintStatus(item.printStatus);
                    });
                    callback(result);
                });
            },

            _getOrderStatus: function(orderStatus) {
                var statusTitle = "";
                switch (orderStatus) {
                    case "Canceled":
                        statusTitle = "取消";
                        break;
                    case "Unpaid":
                        statusTitle = "未支付";
                        break;
                    case "Paid":
                        statusTitle = "已支付";
                        break;
                    case "Processing":
                        statusTitle = "处理中";
                        break;
                    case "WaybillUpdated":
                        statusTitle = "运单更新";
                        break;
                    case "Checkout":
                        statusTitle = "签出";
                        break;
                    case "Arrears":
                        statusTitle = "运费不足";
                        break;
                    case "Shipped":
                        statusTitle = "已出库";
                        break;
                    case "Arrived":
                        statusTitle = "已送达";
                        break;
                    case "Void":
                        statusTitle = "已删除";
                        break;
                    case "PartialShipped":
                        statusTitle = "部分出库";
                        break;
                }
                return statusTitle;
            },

            _getPrintStatus: function(printStatus) {
                var printTitle = "";
                switch (printStatus) {
                    case "Printed":
                        printTitle = "已打印";
                        break;
                    case "UnPrinted":
                        printTitle = "未打印";
                        break;
                }
                return printTitle;
            },

            shippingCarriers: shippingCarriers,
            goodsCategories: goodsCategories,
            packageCountItems: packageCountItems
        };
    }]);