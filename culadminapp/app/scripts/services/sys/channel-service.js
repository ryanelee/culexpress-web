'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.ChannelService
 * @description
 * # ChannelService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
    .service('channelService', ["$http", "$window", function ($http, $window) {
        var channel = this;

        channel.getChannel = function (callback) {
            var Channel  = $window.sessionStorage.getItem("Channel");
            // console.log("Channel",Channel);

            if (!Channel || Channel == 'undefined' ) {
                $http.get(cul.apiPath + "/Channel").success(function (result) {
                    var role = [], Channel_ids = [];
                    if ($window.sessionStorage.getItem('role')) {
                        role = JSON.parse($window.sessionStorage.getItem('role'));
                    }

                    if (role && role.length > 0) {
                        role.forEach(function (item) {
                            Channel_ids = $.extend(Channel_ids, item.Channel_ids.toString().split(","));
                        })
                    }
                    var _data = result;
                    //filter by role
                    if (Channel_ids) {
                        _data = result.filter(function (x) {
                            return Channel_ids.includes('' + x.ChannelNumber);
                        });
                    };
                    $window.sessionStorage.setItem("Channel",JSON.stringify(_data));
                    callback(_data);
                })
            }else{
                callback(JSON.parse(Channel));
            }


        }

        channel.registerOutboundPackages = function (count, callback) {
            $http.post(cul.apiPath + "/outboundpackage/mark", {
                count: count
            }).success(function (result) {
                callback(result);
            });
        }

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

        channel.getCategory = function (callback) {
            $http.get(cul.apiPath + "/item/category/list").success(function (result) {
                callback(result);
            })
        }

        //Shipping channel lsit
        channel.getShippingChannelList = function (callback) {
            $http.post(cul.apiPath + "/shipservice/list", { "pageInfo": { "pageSize": 20, "pageIndex": 1 } }).success(function (result) {
                callback(result.data);
            })
        }

        //创建仓库
        channel.createChannel = function (options, callback) {
            $http.post(cul.apiPath + "/createChannel", options).success(function (result) {
                callback(result);
            });
        }

        //搜索仓库
        channel.getChannelList = function (options, callback) {
            $http.post(cul.apiPath + "/getChannel", options).success(function (result) {
                callback(result);
            });
        }
        //删除仓库
        channel.deleteChannel = function (options, callback) {
            $http.post(cul.apiPath + "/deleteChannel", options).success(function (result) {
                callback(result);
            });
        }
        //更新仓库
        channel.updateChannel = function (options, callback) {
            $http.post(cul.apiPath + "/updateChannel", options).success(function (result) {
                callback(result);
            });
        }

        //更新仓库
        channel.updateWareInboundpackage = function (options, callback) {
            $http.post(cul.apiPath + "/updateWareInboundpackage", options).success(function (result) {
                callback(result);
            });
        }
    }]);
