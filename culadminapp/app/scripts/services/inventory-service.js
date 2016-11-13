'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.inventoryService
 * @description
 * # inventoryService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('inventoryService', ["$http", function ($http) {
      var self = this;

      self.getDetail = function (itemNumber, callback) {
          $http.get(cul.apiPath + "/item/inventory?itemNumber=" + itemNumber).success(function (result) {
              callback(result);
          })
      }

      self.getInfo = function (itemNumber, callback) {
          $http.get(cul.apiPath + "/item/info?itemNumber=" + itemNumber).success(function (result) {
              callback(result);
          })
      }

      self.getInfoByReceiptNumber = function (receiptNumber, callback) {
          $http.get(cul.apiPath + "/item/info?receiptNumber=" + receiptNumber).success(function (result) {
              callback(result);
          })
      }

      self.getList = function (options, callback) {
          $http.post(cul.apiPath + "/item/inventory/list", options).success(function (result) {
              callback(result);
          })
      }

      self.getLogList = function (options, callback) {
          $http.post(cul.apiPath + "/item/inventory/log/list", options).success(function (result) {
              _.each(result.data, function (item) {
                  item._type = _logType(item.type);
              });
              callback(result);
          })
      }

      self.getCategoryList = function (callback) {
          $http.get(cul.apiPath + "/item/category/list").success(function (result) {
              callback(result);
          })
      }

      self.frozen = function (options, callback) {
          $http.put(cul.apiPath + "/item/inventory/frozen", options).success(function (result) {
              callback(result);
          })
      }

      self.adjust = function (options, callback) {
          $http.put(cul.apiPath + "/item/inventory/adjust", options).success(function (result) {
              callback(result);
          })
      }

      var _logType = function (type) {
          var _typeVal = "";
          switch (type) {
              case 1: _typeVal ="订单出库"; break;
              case 2: _typeVal ="寄送库存"; break;
              case 3: _typeVal ="订单下单"; break;
              case 4: _typeVal ="库存冻结"; break;
              case 5: _typeVal ="库存解冻"; break;
              case 6: _typeVal ="纠正库存"; break;
          }
          return _typeVal;
      }
  }]);
