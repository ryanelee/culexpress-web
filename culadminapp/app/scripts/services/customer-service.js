﻿'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.customerService
 * @description
 * # customerService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
    .service('customerService', ["$window", "$http", function($window, $http) {
        var self = this;

        self.getDetail = function(customerNumber, callback) {
            $http.get(cul.apiPath + "/customer/" + customerNumber)
                .success(function(result) {
                    switch (result && result.vipStatus) {
                        case "Applied":
                            result._vipStatus = "申请";
                            break;
                        case "Approved":
                            result._vipStatus = "同意";
                            break;
                        case "Cancelled":
                            result._vipStatus = "取消";
                            break;
                        case "Rejected":
                            result._vipStatus = "拒绝";
                            break;
                    }
                    callback(result);
                });
        }

        self.getList = function(options, callback) {
            $http.post(cul.apiPath + "/customer/list", options)
                .success(function(result) {
                    $.each(result.data, function(i, item) {
                        switch (item.vipStatus) {
                            case "Applied":
                                item._vipStatus = "申请";
                                break;
                            case "Approved":
                                item._vipStatus = "同意";
                                break;
                            case "Cancelled":
                                item._vipStatus = "取消";
                                break;
                            case "Rejected":
                                item._vipStatus = "拒绝";
                                break;
                        }
                    });
                    callback(result);
                });
        }

        self.delete = function(ids, callback) {
            $http.delete(cul.apiPath + "/customer?number=" + ids)
                .success(function(result) {
                    callback(result);
                });
        }

        self.update = function(data, callback) {
            $http.put(cul.apiPath + "/customer/profile", data)
                .success(function(result) {
                    callback(result);
                });
        }

        self.vipApprove = function(options, callback) {
            $http.put(cul.apiPath + "/customer/vip/audit", options).success(function(result) {
                callback(result);
            });
        }

        self.getVipAndMsg = function(options, callback) {
            $http.post(cul.apiPath + "/customer/getVipAndMsg", options).success(function(result) {
                callback(result);
            });
        }

        self.updatePoint = function(options, callback) {
            $http.put(cul.apiPath + "/customer/mypoint", options).success(function(result) {
                callback(result);
            });
        }

        self.clearReference = function(customerNumber, callback) {
            $http.put(cul.apiPath + "/customer/cancelReference/" + customerNumber).success(function(result) {
                callback(result);
            });
        }

        self.statisticsList = function(options, callback) {
            var customer_ids = JSON.parse($window.sessionStorage.getItem("role")).customer_ids;

            if(customer_ids != undefined && parseInt(customer_ids) !== 0){

                if (options["customerNumber"] != undefined
                    && !customer_ids.includes(options["customerNumber"].toUpperCase())) {//搜索指定customer#不在当前用户允许查询的customer权限中，直接返回空数据集
                        return;
                };

                if (options["customerNumber"] == undefined)//默认只返回具备权限查看customer的数据
                    options["customerNumber"] = customer_ids;
            };

            $http.post(cul.apiPath + "/customer/statistics/list", options).success(function(result) {
                callback(result);
            });
        }

        self.getUnpaid = function(options, callback) {
            $http.post(cul.apiPath + "/customer/unpaid", options).success(function(result) {
                callback(result);
            });
        }

        self.financeLogList = function(options, callback) {
            $http.post(cul.apiPath + "/customer/financeLog/list", options).success(function(result) {
                callback(result);
            });
        }


        self.refundRecharge = function(options, callback) {
            $http.post(cul.apiPath + "/customer/recharge", options).success(function(result) {
                callback(result);
            });
        }

        self.paymentByOffline = function(options, callback) {
            $http.post(cul.apiPath + "/customer/manual/offline/payment", options).success(function(result) {
                callback(result);
            });
        }

        self.paymentByOnline = function(options, callback) {
            $http.post(cul.apiPath + "/customer/manual/online/payment", options).success(function(result) {
                callback(result);
            });
        }
        self.getVipAndMsg = function(options, callback) {
            $http.post(cul.apiPath + "/customer/getVipAndMsg", options).success(function(result) {
                callback(result);
            });
        }

    }]);