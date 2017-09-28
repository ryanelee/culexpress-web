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

        //创建装运服务
        shipservice.createShipservice = function (options, callback) {
            $http.post(cul.apiPath + "/createShipService", options).success(function (result) {
                callback(result);
            });
        }

        //搜索装运服务
        shipservice.getShipserviceList = function (options, callback) {
            $http.post(cul.apiPath + "/getShipService", options).success(function (result) {
                callback(result);
            });
        }

        //删除装运服务
        shipservice.deleteShipservice = function (options, callback) {
            $http.post(cul.apiPath + "/deleteShipservice", options).success(function (result) {
                callback(result);
            });
        }

        //更新装运服务
        shipservice.updateShipservice = function (options, callback) {
            $http.post(cul.apiPath + "/updateShipService", options).success(function (result) {
                callback(result);
            });
        }
    }]);
