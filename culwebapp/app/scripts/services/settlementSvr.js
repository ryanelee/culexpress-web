'use strict';

angular.module('culwebApp')
    .factory('settlementSvr', ['$http', function ($http) {

        var getList = function (paras) {
            var url = cul.apiPath + '/settlement/list';
            return $http.post(url, paras || {});
        },
        getRule = function (options) {
            var url = cul.apiPath + '/settlement/rule';
            return $http.post(url, {
                customerNumber: options.customerNumber,
                warehouseNumber: options.warehouseNumber,
                shipServiceId: options.shipServiceId
            });
        },
        getExcelList = function (customerNumber) {
            var url = cul.apiPath + '/settlement/report/list';
            return $http.post(url, {
                customerNumber: customerNumber
            });
        },
        pay = function (customerNumber, money) {
            var url = cul.apiPath + '/customer/alipay/payment';
            return $http.post(url, {
                "customerNumber": customerNumber,
                'WIDtotal_fee': money
            });
        },
        instruction = function (customerNumber) {
            var url = cul.apiPath + '/settlement/instruction';
            return $http.post(url, {
                "customerNumber": customerNumber
            });
        },
        getUnpaid = function (customerNumber) {
            var url = cul.apiPath + '/customer/unpaid';
            return $http.post(url, { customerNumber: customerNumber });
        },
        getPaymentHistory = function (index, customerNumber) {
            var url = cul.apiPath + '/customer/payment/history';
            return $http.post(url, {
                pageInfo: {
                    pageSize: 10,
                    pageIndex: index || 1
                }, customerNumber: customerNumber
            });
        };



        return {
            getList: getList,
            getRule: getRule,
            getExcelList: getExcelList,
            pay: pay,
            instruction: instruction,
            getUnpaid: getUnpaid,
            getPaymentHistory: getPaymentHistory
        };

    }]);