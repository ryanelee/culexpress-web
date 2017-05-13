'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.bucketService
 * @description
 * # bucketService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('bucketService', ["$http", function ($http) {
      var self = this;

      //创建总单
      self.create = function (options, callback) {
          $http.post(cul.apiPath + "/bucket", options).success(function (result) {
              callback(result);
          })
      }

      //修改总单
      self.update = function (options, callback) {
          $http.PUT(cul.apiPath + "/bucket", options).success(function (result) {
              callback(result);
          })
      }

      //查询总单列表
      self.getList = function (options, callback) {
          $http.post(cul.apiPath + "/bucket/list", options).success(function (result) {
              _.each(result.data, function (item) {
                  switch (item.status) {
                      case "0":
                          item._status = "关闭";
                          break;
                      case "1":
                          item._status = "开启";
                          break;
                  }
              });
              callback(result);
          })
      }

      //查询总单详情
      self.getDetail = function (bucketNumber, callback) {
          $http.get(cul.apiPath + "/bucket?bucketNumber=" + bucketNumber).success(function (result) {
              callback(result);
          })
      }

      //检查包裹是否存在
      self.checkPackage = function (trackingNumber, callback) {
          $http.get(cul.apiPath + "/bucket/checkpackage?trackingNumber=" + trackingNumber).success(function (result) {
              callback(result);
          });
      }

      //关闭总单
    //   self.close = function (bucketNumber, callback) {
    //       $http.put(cul.apiPath + "/bucket/close?bucketNumber=" + bucketNumber).success(function (result) {
    //           callback(result);
    //       });
    //   }
      self.close = function (options, callback) {
          console.log("bucket_service options:")
          console.log(options)
          $http.put(cul.apiPath + "/bucket/close", options).success(function (result) {
              callback(result);
          });
      }
  }]);
