'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.menuInfoService
 * @description
 * # menuInfoService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
    .service('orderService', ["$window", "$http", "warehouseService", function ($window, $http, warehouseService) {
        var self = this;

        var _getOrderStatus = function (orderStatus) {
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
        }

        var _getPrintStatus = function (printStatus) {
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
        }

        self.getList = function (options, callback) {
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

            $http.post(cul.apiPath + "/order/list", options).then(function (result) {
                var result = result.data;
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
                    $.each(item.outboundPackages, function (i, outboundPackage) {
                        item._outboundTrackingNumbers.push(outboundPackage.trackingNumber);
                    });
                    // 入库单号list
                    item._inboundTrackingNumbers = [];

                    if(item.inboundPackages && item.inboundPackages.length > 0){
                        $.each(item.inboundPackages, function (i, inboundPackage) {
                            item._inboundTrackingNumbers.push(inboundPackage.trackingNumber);
                        });
                    }                    
                });
                callback(result);
            });
        }

        self.getExportUrl = function (options, callback) {
            var queryString = [];
            for (var key in options) {
                if (key != "pageInfo") {
                    queryString.push(key + "=" + options[key]);
                }
            }
            var _token = sessionStorage.getItem("token");
            if (!!_token) queryString.push("token=" + encodeURIComponent(_token));
            callback(cul.apiPath + "/order/list/export?" + queryString.join("&"));
        }

        self.getDetail = function (orderNumber, callback) {
            $http.get(cul.apiPath + "/order/" + orderNumber).then(function (result) {
                var result = result.data
                result._orderStatus = _getOrderStatus(result.orderStatus);
                result._printStatus = _getPrintStatus(result.printStatus);
                callback(result);
            });
        }

        self.create = function (order, callback) {
            $http.post(cul.apiPath + "/order", order).then(function (result) {
                callback(result.data);
            });
        }

        self.update = function (order, callback) {
            $http.put(cul.apiPath + "/order", order).then(function (result) {
                callback(result.data);
            });
        }

        self.checkOrderNumber = function (order) {
            return $http.post(cul.apiPath + "/order/checkOrderNumber", order)
        }

        self.delete = function (searchOrder, callback) {
            $http.delete(cul.apiPath + "/order?number=" + searchOrder.orderNumber + "&orderNumberList=" + searchOrder.orderNumberList+"&deleteMessage="+searchOrder.deleteMessage).then(function (result) {
                callback(result.data);
            });
        }

        self.offlineOrderCheckExcel = function (fileId, callback) {
            $http.post(cul.apiPath + "/order/offlineOrderCheckExcel", {
                fileId: fileId
            }).success(function (result) {
                callback(result);
            });
        }

        self.offlineOrderCreateExcel = function (fileId, callback) {
            $http.post(cul.apiPath + "/order/offlineOrderCreateExcel", {
                fileId: fileId
            }).then(function (result) {
                var result = result.data
                warehouseService.getWarehouse(function (warehouseList) {
                    $.each(result, function (i, order) {
                        var _warehouse = $.grep(warehouseList, function (n) { return n.warehouseNumber == order.warehouseNumber });
                        order.warehouseName = _warehouse.length > 0 ? _warehouse[0].warehouseName : "";
                    })
                    callback(result);
                });
            });
        }

        self.generatePackageNumber = function (model, callback) {
            $http.post(cul.apiPath + "/outboundpackage/generate", model).then(function (result) {
                callback(result.data);
            });
        }

        self.orderPackageUpdateByExcel = function (fileId, callback) {
            $http.post(cul.apiPath + "/order/batchUpdateOutboundPackageByExcel", {
                fileId: fileId
            }).then(function (result) {
                var result = result.data;
                callback(result == "import successfully" ? true : result.message);
            });
        }

        self.updateOutboundPackage = function (model, callback) {
            $http.put(cul.apiPath + "/outboundpackage", model).then(function (result) {
                callback(result.data);
            });
        }

        self.deleteOutboundPackage = function (numbers, callback) {
            //console.log("self.deleteOutboundPackage");
            //console.log(numbers);
            // $http.delete(cul.apiPath + "/outboundpackage?number=" + numbers.join(",")).success(function (result) {
            $http.post(cul.apiPath + "/deleteOutboundpackage", numbers).then(function (result) {
                callback(result.data);
            });
        }
        self.getOutboundPackage = function (number, callback) {
            $http.get(cul.apiPath + "/outboundpackage/" + number).then(function (result) {
                callback(result.data);
            });
        }

        //self.settlement = function (orderNumbers, callback) {
        //    $http.put(cul.apiPath + "/order/settlement", orderNumbers).success(function (result) {
        //        callback(result);
        //    });
        //}

        self.settlementForOffline = function (batchNumber, callback) {
            $http.get(cul.apiPath + "/order/settlement/offline/" + batchNumber).then(function (result) {
                callback(result.data);
            });
        }

        self.outbound = function (model, callback) {
            $http.post(cul.apiPath + "/order/ship/offline", model).then(function (result) {
                callback(result.data);
            });
        }

        self.outbound_vip = function (model, callback) {
            $http.post(cul.apiPath + "/order/ship/vip/" + model.orderNumber, model).then(function (result) {
                callback(result.data);
            });
        }

        self.batchOutboundPackage_vip = function (orderNumbers, callback) {
            $http.post(cul.apiPath + "/order/ship/vip", {
                orderNumber: orderNumber
            }).then(function (result) {
                callback(result.data);
            });
        }

        self.updateOutboundPackageAndMessage = function (model, callback) {
            $http.put(cul.apiPath + "/order/message_package/offline", model).then(function (result) {
                callback(result.data);
            });
        }

        self.settlementForOnline = function (orderNumber, callback) {
            $http.get(cul.apiPath + "/order/settlement/online/" + orderNumber).then(function (result) {
                callback(result.data);
            });
        }

        self.batchUpdate = function (orderArray, callback) {
            $http.post(cul.apiPath + "/order/batchUpdate", orderArray).then(function (result) {
                callback(result.data);
            });
        }

        self.orderTrackUpdateByExcel = function (fileId, callback) {
            $http.post(cul.apiPath + "/order/batchUpdateOrderStepByExcel", {
                fileId: fileId
            }).then(function (result) {
                var result = result.data;
                callback(result == "import successfully" ? true : result.message);
            });
        }

        self.printOrder = function (orderNumbers, callback) {
            $http.put(cul.apiPath + "/order/print", {
                orderNumber: orderNumbers
            }).then(function (result) {
                callback(result.data);
            });
        }



        //财务按渠道统计
        self.financeTotal = function (options, callback) {
            $http.post(cul.apiPath + "/order/financeTotal", options).then(function (result) {
                callback(result.data);
            });
        }



        self.activitiesList = function (options, callback) {
            $http.post(cul.apiPath + "/order/activities", options).then(function (result) {
               var result = result.data;
                $.each(result.data, function (index, item) {
                    item._orderStatus = _getOrderStatus(item.orderStatus);
                    item._printStatus = _getPrintStatus(item.printStatus);
                });
                callback(result);
            });
        }

        self.adminPaymentOrder = function (obj) {
            return $http.put(cul.apiPath + "/order/adminPayment", obj)
        }

        self.getOrderCommentsList = function (options, callback) {
            $http.post(cul.apiPath + "/customermessage/order/list", options).then(function (result) {
                callback(result.data);
            });
        }

    }]);