'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.faqService
 * @description
 * # faqService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
    .service('faqService', ["$http", function($http) {
        var self = this;

        self.getMessageType = function(type, callback) {
            $http.get(cul.apiPath + "/customermessagetype?type=" + type).success(function(result) {
                callback(result);
            });
        }

        self.getList = function(options, callback) {
            $http.post(cul.apiPath + "/customermessage/list", options).success(function(result) {
                callback(result);
            });
        }
        self.getMessageOperationlog = function(options, callback) {
            $http.post(cul.apiPath + "/customermessage/getSysMessageOperationlog", options).success(function(result) {
                callback(result);
            });
        }
        self.updateMessageOperation = function(obj) {
            return $http.post(cul.apiPath + '/customermessage/updateMessageOperation', obj);
        }



        self.getDetail = function(id, callback) {
            $http.get(cul.apiPath + "/customermessage/" + id).success(function(result) {
                callback(result);
            });
        }

        self.delete = function(ids, callback) {
            $http.delete(cul.apiPath + "/customermessage?number=" + ids).success(function(result) {
                callback(result);
            });
        }

        self.update = function(data, callback) {
            $http.put(cul.apiPath + "/customermessage", data).success(function(result) {
                callback(result);
            });
        }

        self.setMessagelog = function(data, callback) {
            $http.post(cul.apiPath + "/customermessage/setMessagelog", data).success(function(result) {
                callback(result);
            });
        }
        self.getMessagelog = function(data, callback) {
            $http.post(cul.apiPath + "/customermessage/getMessagelog", data).success(function(result) {
                callback(result);
            });
        }
    }]);