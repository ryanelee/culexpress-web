'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.warehouseService
 * @description
 * # warehouseService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
    .service('warehouseService', ["$http", "$window", function ($http, $window) {
        var self = this;

        var _getOrderStatus = function (orderStatus) {
            var statusTitle = "";
            switch (orderStatus) {
                case "Canceled": statusTitle = "取消"; break;
                case "Unpaid": statusTitle = "未支付"; break;
                case "Paid": statusTitle = "已支付"; break;
                case "Processing": statusTitle = "处理中"; break;
                case "WaybillUpdated": statusTitle = "运单更新"; break;
                case "Checkout": statusTitle = "签出"; break;
                case "Arrears": statusTitle = "运费不足"; break;
                case "Shipped": statusTitle = "已出库"; break;
                case "Arrived": statusTitle = "已送达"; break;
                case "Void": statusTitle = "已删除"; break;
                case "PartialShipped": statusTitle = "部分出库"; break;
            }
            return statusTitle;
        }

        self.getInboundPackageList = function (options, callback) {
            $http.post(cul.apiPath + "/inboundPackage/list", options).then(function (result) {
                var result = result.data;
                $.each(result.data, function (index, item) {
                    item._status = _statusConvert(item.status);
                });
                callback(result);
            });
        }

        self.getInboundPackageDetail = function (id, callback) {
            $http.get(cul.apiPath + "/inboundPackage/" + id).then(function (result) {
                callback(result.data);
            });
        }

        self.updateInboundPackageDetail = function (model, callback) {
            $http.put(cul.apiPath + "/inboundPackage/inbound", model).then(function (result) {
                callback(result.data);
            });
        }

        self.deleteInboundPackageDetail = function (id, callback) {
            $http.delete(cul.apiPath + "/inboundPackage?number=" + id).then(function (result) {
                callback(result.data);
            });
        }

        self.getOutboundPackageByOrderNumbers = function (ids, callback) {
            //$http.get(cul.apiPath + "/outboundpackage/order/" + ids.join(",")).success(function (result) {
            $http.post(cul.apiPath + "/outboundpackage/order", {
                orderNumber: ids
            }).then(function (result) {
                callback(result.data);
            });
        }

        self.outboundPackageShip = function (trackingNumbers, callback) {
            var _data = [];
            $.each(trackingNumbers, function (i, trackingNumber) {
                _data.push({
                    "trackingNumber": trackingNumber
                });
            })
            $http.post(cul.apiPath + "/outboundpackage/ship", _data).then(function (result) {
                callback(result.data);
            });
        }

        self.outboundPackageSplit = function (options, callback) {
            $http.post(cul.apiPath + "/outboundpackage/split", options).then(function (result) {
                callback(result.data);
            });

        }
        self.getDeleteReceiptLog = function (options, callback) {
            $http.post(cul.apiPath + "/getDeleteReceiptLog", options).then(function (result) {
                callback(result.data);
            });

        }


        self.inboundpackage = function (options) {
            return $http.post(cul.apiPath + "/inboundpackage", options)
        }

        self.getOutboundPackageList = function (options, callback) {
            $http.post(cul.apiPath + "/outboundPackage/list", options).then(function (result) {
              var result = result.data;
                $.each(result.data, function (i, item) {
                    item._orderStatus = _getOrderStatus(item.orderStatus);
                    if (!!item.address) {
                        item._shipToAddresses = [];
                        var _str = item.address.receivePersonName;
                        if (!!item.address.cellphoneNumber) _str += "(" + item.address.cellphoneNumber + ")";
                        _str += item.address.address1;
                        if (!!item.address.receiveCompanyName) _str += item.address.receiveCompanyName;
                        if (!!item.address.zipcode) _str += "(" + item.address.zipcode + ")";
                        if ($.grep(item._shipToAddresses, function (n) { return n == _str }).length == 0) {
                            item._shipToAddresses.push(_str);
                        }
                    }
                    switch (item.exportStatus) {
                        case "Exported":
                            item._exportStatus = "已导出";
                            break;
                        case "UnExported":
                        default:
                            item._exportStatus = "未导出";
                            break;
                    }
                });

                callback(result);
            });
        }

        self.getWarehouse = function (callback) {
            var warehouse  = $window.sessionStorage.getItem("warehouse");
            // console.log("warehouse",warehouse);

            if (!warehouse || warehouse == 'undefined' ) {
                $http.get(cul.apiPath + "/warehouse").then(function (result) {
                    var result = result.data;
                    var role = [], warehouse_ids = [];
                    if ($window.sessionStorage.getItem('role')) {
                        role = JSON.parse($window.sessionStorage.getItem('role'));
                    }

                    if (role && role.length > 0) {
                        role.forEach(function (item) {
                            warehouse_ids = $.extend(warehouse_ids, item.warehouse_ids.toString().split(","));
                        })
                    }
                    var _data = result;
                    //filter by role
                    if (warehouse_ids) {
                        _data = result.filter(function (x) {
                            return warehouse_ids.includes('' + x.warehouseNumber);
                        });
                    };
                    $window.sessionStorage.setItem("warehouse",JSON.stringify(_data));
                    callback(_data);
                })
            }else{
                callback(JSON.parse(warehouse));
            }


        }

        self.registerOutboundPackages = function (count, callback) {
            $http.post(cul.apiPath + "/outboundpackage/mark", {
                count: count
            }).then(function (result) {
                callback(result.data);
            });
        }

        var _statusConvert = function (status) {
            //Intransit -- 在途; Inbound -- 入库; Onshelf -- 上架; Offshelf -- 下架;
            var title = "";
            switch (status) {
                case "Intransit":
                    title = "在途中";
                    break;
                case "Inbound":
                    title = "已入库";
                    break;
                case "Onshelf":
                    title = "已上架";
                    break;
                case "Offshelf":
                    title = "已下架";
                    break;
            }
            return title;
        }

        self.getCategory = function (callback) {
            $http.get(cul.apiPath + "/item/category/list").then(function (result) {
                callback(result.data);
            });
        }

        //Shipping channel lsit
        self.getShippingChannelList = function (callback) {
            $http.post(cul.apiPath + "/shipservice/list", { "pageInfo": { "pageSize": 20, "pageIndex": 1 } }).then(function (result) {
                callback(result.data);
            });
        }

        // //获取系统公告
        // self.getWebAnnounce = function (options, callback) {
        //     $http.post(cul.apiPath + "/web/getWebAnnounce", options).success(function (result) {
        //         callback(result);
        //     });
        // }

        //创建仓库
        self.createWarehouse = function (options, callback) {
            $http.post(cul.apiPath + "/warehouse", options).then(function (result) {
                callback(result.data);
            });
        }

        //搜索仓库
        self.getWarehouseList = function (options, callback) {
            $http.post(cul.apiPath + "/getWarehouse", options).then(function (result) {
                callback(result.data);
            });
        }
        //删除仓库
        self.deleteWarehouse = function (options, callback) {
            $http.post(cul.apiPath + "/deleteWarehouse", options).then(function (result) {
                callback(result.data);
            });
        }
        //更新仓库
        self.updateWarehouse = function (options, callback) {
            $http.post(cul.apiPath + "/updateWarehouse", options).then(function (result) {
                callback(result.data);
            });
        }

        //更新仓库
        self.updateWareInboundpackage = function (options, callback) {
            $http.post(cul.apiPath + "/updateWareInboundpackage", options).then(function (result) {
                callback(result.data);
            });
        }
    }]);
