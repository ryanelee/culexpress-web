'use strict';

angular.module('culwebApp')
    .factory('Customer', function($http) {

        var provinceList = [];

        //retrieveUtility(success,error){};

        return {
            getCustomerInfo: function(customerId) {
                return $http.get(cul.apiPath + '/customer/' + customerId);
            },
            updateCustomerProfile: function(customer, success, error) {
                $http.put(cul.apiPath + '/customer/profile', customer).then(function(data) {
                    success(data);
                }, function(err) {
                    error(err);
                });
            },
            updateCustomerPoint: function(customer, success, error) {
                $http.put(cul.apiPath + '/customer/mypoint', customer).then(function(data) {
                    success(data);
                }).error(error);
            },
            activateCustomerPoint: function(customer, success, error) {
                $http.put(cul.apiPath + '/customer/mypoint/activate', customer).then(function(data) {
                    success(data);
                }).error(error);
            },
            updateCustomerAccountBalance: function(customer, success, error) {
                $http.put(cul.apiPath + '/customer/accountbalance', customer).then(function(data) {
                    success(data);
                }).error(error);
            },
            //身份证上传
            uploadID: function(data, success, error) {
                $http.post(cul.apiPath + '/customer/uploadID', data)
            },


            retrieveProvinceList: function(success, error) {
                $http.get(cul.apiPath + '/province').then(function(data) {
                    success(data);
                    provinceList = data;
                }, function(err) {
                    error(err)
                });
            },
            changePassword: function(password, newPassword, emailAddress) {
                var data = {
                    password: password,
                    newPassword: newPassword,
                    emailAddress: emailAddress
                };

                var key = CryptoJS.lib.WordArray.random(128 / 8);

                var bodyData = {
                    data: CryptoJS.AES.encrypt(JSON.stringify(data), key.toString()).toString(),
                    key: key.toString()
                };

                return $http.put(cul.apiPath + '/customer/password', bodyData);
            },
            userPay: function(customerNumber, amount) {
                return $http.post(cul.apiPath + '/alipay/create_direct_pay_by_user', {
                    WIDtotal_fee: amount,
                    customerNumber: customerNumber
                });
            },
            getFinanceLog: function(index, customerNumber, operationType,size) {
                return $http.post(cul.apiPath + '/customer/financelog/list', {
                    pageInfo: {
                        pageSize: size | 10,
                        pageIndex: index || 1
                    },
                    operationType: operationType || 1,
                    customerNumber: customerNumber,
                });
            },
            getQuestionList: function(index, customerNumber) {
                return $http.post(cul.apiPath + '/customermessage/list/customer', {
                    pageInfo: {
                        pageSize: 10,
                        pageIndex: index || 1
                    },
                    customerNumber: customerNumber,
                });
            },
            getQuestionCategories: function() {
                return $http.get(cul.apiPath + '/customermessagetype?type=1');
            },
            addQuestion: function(questionItem) {
                //console.log(questionItem);
                return $http.post(cul.apiPath + '/customermessage', {
                    customerNumber: questionItem.customerNumber,
                    messageType: questionItem.messageType,
                    receivedWarehouseNumber: questionItem.receivedWarehouseNumber,
                    receiveTrackingNumber: questionItem.receiveTrackingNumber,
                    orderNumber: questionItem.orderNumber,
                    deliveryTrackingNumber: questionItem.deliveryTrackingNumber,
                    images: questionItem.images || null,
                    message: questionItem.message,
                    status: 0
                });
            },
            delQuestion: function(questionNumber) {
                return $http.delete(cul.apiPath + '/customermessage?number=' + questionNumber);
            },
            getQuestionInfo: function(questionNumber) {
                return $http.get(cul.apiPath + '/customermessage/' + questionNumber);
            },
            applyVIP: function(customerNumber) {
                return $http.put(cul.apiPath + '/customer/vip/apply', { customerNumber: customerNumber });
            },
            sendForgetPasswordEmail: function(emailAddress) {
                return $http.post(cul.apiPath + '/user/password/forgetmail', {
                    emailAddress: emailAddress
                });
            },
            resetPasswordEmail: function(emailAddress, password, uuid) {
                return $http.put(cul.apiPath + '/user/password/reset', {
                    emailAddress: emailAddress,
                    password: password,
                    uuid: uuid
                });
            },

            checkTrackingNumber: function(obj) {
                return $http.post(cul.apiPath + '/customermessage/checkTrackingNumber', obj);
            },


            getMessageOperationlog: function(obj) {
                return $http.post(cul.apiPath + '/customermessage/getMessageOperationlog', obj);
            },
            updateMessageOperation: function(obj) {
                return $http.post(cul.apiPath + '/customermessage/updateMessageOperation', obj);
            },
            saveWithdrawRequest: function(obj) {
                return $http.post(cul.apiPath + '/customer/withdrawRequest', obj);
            },
            getWithdrawRquestList: function(index,size,customerNumber) {
                return $http.post(cul.apiPath + '/customer/getWithdrawRequestList',{
                    pageInfo: {
                        pageSize: size | 10,
                        pageIndex: index || 1
                    },
                    customerNumber: customerNumber
                });
            },

            ProvinceList: provinceList
        };
    });