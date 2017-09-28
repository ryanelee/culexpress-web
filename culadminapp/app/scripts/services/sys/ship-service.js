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


        var _statusConvert = function (status) {
            //Intransit -- 在途; Inbound -- 入库; Onshelf -- 上架; Offshelf -- 下架;
            var title = "";
            switch (status) {
                case "Intransit":
                    title = "在途中";
                    break;
                case "Inbound":
                    title = "已入库";
                    break;
                case "Onshelf":
                    title = "已上架";
                    break;
                case "Offshelf":
                    title = "已下架";
                    break;
            }
            return title;
        }

        //创建渠道
        shipservice.createShipservice = function (options, callback) {
            $http.post(cul.apiPath + "/createShipservice", options).success(function (result) {
                callback(result);
            });
        }

        //搜索渠道
        shipservice.getShipserviceList = function (options, callback) {
            $http.post(cul.apiPath + "/getShipService", options).success(function (result) {
                callback(result);
            });
        }

        //删除渠道
        shipservice.deleteShipservice = function (options, callback) {
            $http.post(cul.apiPath + "/deleteShipservice", options).success(function (result) {
                callback(result);
            });
        }

        //更新渠道
        shipservice.updateShipservice = function (options, callback) {
            $http.post(cul.apiPath + "/updateShipservice", options).success(function (result) {
                callback(result);
            });
        }
    }]);
