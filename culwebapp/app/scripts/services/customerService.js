'use strict';

angular.module('culwebApp')
    .factory('Customer', function ($http) {

        var provinceList = [];

        //retrieveUtility(success,error){};

        return {
            getCustomerInfo: function (customerId) {
                return $http.get(cul.apiPath + '/customer/' + customerId);
            },
            updateCustomerProfile: function (customer, success, error) {
                $http.put(cul.apiPath + '/customer/profile', customer).success(function (data) {
                    success(data);
                }).error(function (result) {
                    console.error(result)
                });
            },
            updateCustomerPoint: function (customer, success, error) {
                $http.put(cul.apiPath + '/customer/mypoint', customer).success(function (data) {
                    success(data);
                }).error(error);
            },
            activateCustomerPoint: function (customer, success, error) {
                $http.put(cul.apiPath + '/customer/mypoint/activate', customer).success(function (data) {
                    success(data);
                }).error(error);
            },
            updateCustomerAccountBalance: function (customer, success, error) {
                $http.put(cul.apiPath + '/customer/accountbalance', customer).success(function (data) {
                    success(data);
                }).error(error);
            },
            retrieveProvinceList: function (success, error) {
                $http.get(cul.apiPath + '/province').success(function (data) {
                    success(data);
                    provinceList = data;
                }).error(error);
            },
            changePassword: function (password, newPassword, emailAddress) {
                return $http.put(cul.apiPath + '/customer/password', {
                    password: password,
                    newPassword: newPassword,
                    emailAddress: emailAddress
                });
            },
            userPay: function (customerNumber, amount) {
                return $http.post(cul.apiPath + '/alipay/create_direct_pay_by_user', {
                    WIDtotal_fee: amount,
                    customerNumber: customerNumber
                });
            },
            getFinanceLog: function (index, customerNumber, operationType) {
                return $http.post(cul.apiPath + '/customer/financelog/list', {
                    pageInfo: {
                        pageSize: 10,
                        pageIndex: index || 1
                    },
                    operationType: operationType || 1,
                    customerNumber: customerNumber,
                });
            },
            getQuestionList: function (index, customerNumber) {
                return $http.post(cul.apiPath + '/customermessage/list/customer', {
                    pageInfo: {
                        pageSize: 10,
                        pageIndex: index || 1
                    },
                    customerNumber: customerNumber,
                });
            },
            getQuestionCategories: function () {
                return $http.get(cul.apiPath + '/customermessagetype?type=1');
            },
            addQuestion: function (questionItem) {
                return $http.post(cul.apiPath + '/customermessage', {
                    customerNumber: questionItem.customerNumber,
                    messageType: questionItem.messageType,
                    receivedWarehouseNumber: questionItem.receivedWarehouseNumber,
                    receiveTrackingNumber: questionItem.receiveTrackingNumber,
                    orderNumber: questionItem.SONumber,
                    deliveryTrackingNumber: questionItem.deliveryTrackingNumber,
                    images: questionItem.images || null,//暂时不做图片上传
                    message: questionItem.message,
                    status: 0
                });
            },
            delQuestion: function (questionNumber) {
                return $http.delete(cul.apiPath + '/customermessage?number=' + questionNumber);
            },
            getQuestionInfo: function (questionNumber) {
                return $http.get(cul.apiPath + '/customermessage/' + questionNumber);
            },
            applyVIP: function (customerNumber) {
                return $http.put(cul.apiPath + '/customer/vip/apply', { customerNumber: customerNumber });
            },
            sendForgetPasswordEmail: function (emailAddress) {
                return $http.post(cul.apiPath + '/user/password/forgetmail', {
                    emailAddress: emailAddress
                });
            },
            resetPasswordEmail: function (emailAddress, password, uuid) {
                return $http.put(cul.apiPath + '/user/password/reset', {
                    emailAddress: emailAddress,
                    password: password,
                    uuid: uuid
                });
            },
            ProvinceList: provinceList
        };
    });
