'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.faqService
 * @description
 * # faqService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
    .service('faqService', ["$http", function ($http) {
        var self = this;

        self.getMessageType = function (type, callback) {
            $http.get(cul.apiPath + "/customermessagetype?type=" + type).then(function (result) {
                callback(result.data);
            });
        } 

        self.getList = function (options, callback) {
            $http.post(cul.apiPath + "/customermessage/list", options).then(function (result) {
                callback(result.data);
            });
        }
        self.getMessageOperationlog = function (options, callback) {
            $http.post(cul.apiPath + "/customermessage/getSysMessageOperationlog", options).then(function (result) {
                callback(result.data);
            });
        }
        self.updateMessageOperation = function (obj) {
            return $http.post(cul.apiPath + '/customermessage/updateMessageOperation', obj);
        }

        self.deleteMessageOperation = function (obj) {
            return $http.post(cul.apiPath + '/customermessage/deleteMessageOperation', obj);
        }



        self.getDetail = function (id, callback) {
            $http.get(cul.apiPath + "/customermessage/" + id).then(function (result) {
                callback(result.data);
            });
        }

        self.delete = function (ids, callback) {
            $http.delete(cul.apiPath + "/customermessage?number=" + ids).then(function (result) {
                callback(result.data);
            });
        }

        self.update = function (data, callback) {
            $http.put(cul.apiPath + "/customermessage", data).then(function (result) {
                callback(result.data);
            });
        }

        self.setMessagelog = function (data, callback) {
            $http.post(cul.apiPath + "/customermessage/setMessagelog", data).then(function (result) {
                callback(result.data);
            });
        }
        self.getMessagelog = function (data, callback) {
            $http.post(cul.apiPath + "/customermessage/getMessagelog", data).then(function (result) {
                callback(result.data);
            });
        }
        // self.updateMessageOperation = function (obj) {
        //     return $http.post(cul.apiPath + '/customermessage/updateMessageOperation', obj);
        // };
    }]);