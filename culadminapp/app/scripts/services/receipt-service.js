'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.receiptService
 * @description
 * # receiptService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
    .service('receiptService', ["$http", function ($http) {
        var self = this;

        //寄送库存海淘入库登记
        self.getDetail = function (receiptNumber, callback) {
            $http.get(cul.apiPath + "/item/transport?receiptNumber=" + receiptNumber).success(function (result) {
                if (result)
                    result._inboundStatus = "";
                switch (result.inboundStatus) {
                    case 0:
                        result._inboundStatus = "等待登记";
                        break;
                    case 1:
                        result._inboundStatus = "等待清点";
                        break;
                    case 2:
                        result._inboundStatus = "部分收货";
                        break;
                    case 3:
                        result._inboundStatus = "已收货";
                        break;
                    default:
                        result._inboundStatus = "所有";
                        break;
                }
                callback(result);
            });
        }

        //寄送库存海淘入库登记
        self.saveForOnline = function (options, callback) {
            $http.post(cul.apiPath + "/item/transport/Inbound/online", options).success(function (result) {
                callback(result);
            });
        }

        //寄送库存大客户入库登记
        self.saveForOffline = function (options, callback) {
            $http.post(cul.apiPath + "/item/transport/Inbound/offline", options).success(function (result) {
                callback(result);
            });
        }

        self.checkForOffline = function (options, callback) {
            $http.post(cul.apiPath + "/item/transport/check/offline", options).success(function (result, status) {
                callback(result, status);
            });
        }

        //删除入库登记数据
        self.delete = function (options, callback) {
            $http.post(cul.apiPath + "/item/transport/delete", options).success(function (result) {
                callback(result);
            });
        }

        self.checkItem = function (code, callback) {
            $http.get(cul.apiPath + "/item/upc?numberOrUpc=" + code).success(function (result, status) {
                callback(result, status);
            });
        }

        //入库异常列表
        self.getExceptionList = function (options, callback) {
            $http.post(cul.apiPath + "/inbound/exception/list", options).success(function (result) {
                _.each(result.data, function (item) {
                    item._sendtype = self.mapping.sendType(item.sendtype);
                    item._type = self.mapping.type(item.type);
                    item._status = self.mapping.status(item.status);
                });
                callback(result);
            });
        }

        //获取入库异常
        self.getExceptionDetail = function (exceptionNumber, callback) {
            $http.get(cul.apiPath + "/inbound/exception?exceptionNumber=" + exceptionNumber).success(function (result) {
                callback(result);
            });
        }

        //新增入库异常
        self.exceptionSave = function (options, callback) {
            $http.post(cul.apiPath + "/inbound/exception", options).success(function (result) {
                callback(result);
            });
        }

        //修改入库异常
        self.exceptionEdit = function (options, callback) {
            $http.put(cul.apiPath + "/inbound/exception", options).success(function (result) {
                callback(result);
            });
        }

        //验证收货定义号
        self.checkReceiveIdentity = function (options, callback) {
            return $http.post(cul.apiPath + "/customermessage/checkReceiveIdentity", options)
        }
        //验证收货定义号
        self.checkInboundPackage = function (options, callback) {
            return $http.post(cul.apiPath + "/customermessage/getInboundPackage", options)
        }

        self.getInboundPackage = function (trackingNumber, callback) {
            console.log("trackingNumber",trackingNumber)
             $http.get(cul.apiPath + "/inboundpackage/"+trackingNumber).success(function (result) {
                callback(result);
            });
        }

        self.mapping = {
            sendType: function (sendType) {
                var _sendType = "";
                switch (sendType) {
                    case 1:
                        _sendType = "寄送库存";
                        break;
                    case 2:
                        _sendType = "海淘包裹";
                        break;
                }
                return _sendType;
            },
            type: function (type) {
                var _type = "";
                switch (type) {
                    case 1:
                        _type = "无预报记录";
                        break;
                    case 2:
                        _type = "物品损坏";
                        break;
                    case 3:
                        _type = "错送";
                        break;
                    case 4:
                        _type = "少送";
                        break;
                    case 5:
                        _type = "多送";
                        break;
                    case 6:
                        _type = "其他";
                        break;
                    case 7:
                        _type = "员工包裹";
                        break;
                }
                return _type;
            },
            status: function (status) {
                var _status = "";
                switch (status) {
                    case 1:
                        _status = "未解决";
                        break;
                    case 2:
                        _status = "已关闭";
                        break;
                    case -1:
                        _status = "已删除";
                        break;
                }
                return _status;
            }
        }
    }]);
