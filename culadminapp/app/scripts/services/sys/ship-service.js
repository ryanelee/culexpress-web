'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.ShipserviceService
 * @description
 * # ShipserviceService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
    .service('shipService', ["$http", "$window", function ($http, $window) {
        var shipservice = this;

        //创建转运服务
        shipservice.createShipservice = function (options, callback) {
            $http.post(cul.apiPath + "/createShipService", options).success(function (result) {
                callback(result);
            });
        }

        //搜索转运服务
        shipservice.getShipserviceList = function (options, callback) {
            $http.post(cul.apiPath + "/getShipService", options).success(function (result) {
                callback(result);
            });
        }

        //删除转运服务
        shipservice.deleteShipservice = function (shipservice_id, callback) {
            $http.get(cul.apiPath + "/deleteShipservice/"+shipservice_id, {}).success(function (result) {
                callback(result);
            });
        }

        //更新转运服务
        shipservice.updateShipservice = function (options, callback) {
            $http.post(cul.apiPath + "/updateShipService", options).success(function (result) {
                callback(result);
            });
        }

        //获取商品类别
        shipservice.getGoodCategory = function (callback) {
            $http.get(cul.apiPath + "/getItemCategoryListAdmin").success(function (result) {
                callback(result);
            });
        }
    }]);
