'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.shelfService
 * @description
 * # shelfService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
    .service('shelfService', ["$http", function($http) {
        var self = this;

        //获取架位
        self.getDetail = function(options, callback) {
                $http.get(cul.apiPath + "/warehouse/shelf?shelfNumber=" + options.shelfNumber + "&warehouseNumber=" + options.warehouseNumber).success(function(result) {
                    callback(result);
                })
            }
            //删除架位
        self.deleteShelf = function(item, callback) {
            $http.post(cul.apiPath + "/warehouse/deleteshelf/", item).success(function(result) {
                callback(result);
            })
        }

        //获取架位列表
        self.getList = function(options, callback) {
            $http.post(cul.apiPath + "/warehouse/shelf/list", options).success(function(result) {
                _.each(result.data, function(item) {
                    switch (item.type) {
                        case "A":
                            item._type = "海淘客户";
                            break;
                        case "B":
                            item._type = "大客户";
                            break;
                        case "C":
                            item._type = "异常包裹";
                            break;
                        case "D":
                            item._type = "员工包裹";
                            break;
                    }
                });
                callback(result);
            })
        }

        //修改架位
        self.update = function(options, callback) {
            $http.post(cul.apiPath + "/warehouse/shelf", options).success(function(result) {
                callback(result);
            })
        }

        //获取单个寄送库存
        self.getTransportDetail = function(receiptNumber, callback) {
            $http.get(cul.apiPath + "/item/transport?receiptNumber=" + receiptNumber).success(function(result) {
                callback(result);
            });
        }

        //库存寄送列表
        self.getTransportList = function(options, callback) {
            console.log(options);
            $http.post(cul.apiPath + "/item/transport/list", options).success(function(result) {
                _.each(result.data, function(item) {
                    switch (item.sendType) {
                        case 1:
                            item._sendType = "寄送库存";
                            break;
                        case 2:
                            item._sendType = "海淘包裹";
                            break;
                    }
                    switch (item.inboundStatus) {
                        case 0:
                            item._inboundStatus = "等待登记";
                            break;
                        case 1:
                            item._inboundStatus = "等待清点";
                            break;
                        case 2:
                            item._inboundStatus = "部分收货";
                            break;
                        case 3:
                            item._inboundStatus = "已收货";
                            break;
                        default:
                            item._inboundStatus = "所有";
                            break;
                    }
                    switch (item.shelfStatus) {
                        case 0:
                            item._shelfStatus = "未上架";
                            break;
                        case 1:
                            item._shelfStatus = "部分上架";
                            break;
                        case 2:
                            item._shelfStatus = "已上架";
                            break;
                    }
                });
                callback(result);
            });
        }

        //商品上架
        self.onshelfForInbound = function(options, callback) {
            $http.post(cul.apiPath + "/item/onshelf", options).success(function(result) {
                callback(result);
            });
        }

        //货架商品移动
        self.onshelfForMove = function(options, callback) {
            $http.put(cul.apiPath + "/item/onshelf", options).success(function(result) {
                callback(result);
            });
        }

        //获取上架清单
        self.getUnshelfList = function(options, callback) {
            $http.post(cul.apiPath + "/item/unshelf/list", options).success(function(result) {
                callback(result);
            });
        }

        //上架商品列表
        self.getOnshelfList = function(options, callback) {
            $http.post(cul.apiPath + "/item/onshelf/list", options).success(function(result) {
                _.each(result.data, function(item) {
                    switch (item.sendType) {
                        case 1:
                            item._sendType = "寄送库存";
                            break;
                        case 2:
                            item._sendType = "海淘包裹";
                            break;
                    }
                });
                callback(result);
            });
        }
    }]);