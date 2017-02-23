'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.inventoryService
 * @description
 * # inventoryService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('inventoryService', ["$window", "$http", function ($window, $http) {
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
          var customer_ids;

          var roles = JSON.parse($window.sessionStorage.getItem("role"));
          roles.forEach(function (role) {
              customer_ids = $.grep([customer_ids, role.customer_ids], Boolean).join(",");
          });

        if(customer_ids != undefined && parseInt(customer_ids) !== 0){

            if (options["customerNumber"] != undefined
                && !customer_ids.includes(options["customerNumber"].toUpperCase())) {//搜索指定customer#不在当前用户允许查询的customer权限中，直接返回空数据集
                    return;
            };

            if (options["customerNumber"] == undefined)//默认只返回具备权限查看customer的数据
                options["customerNumber"] = customer_ids;
        };

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
              case 2: _typeVal ="商品入库"; break;
              case 3: _typeVal ="订单下单"; break;
              case 4: _typeVal ="库存冻结"; break;
              case 5: _typeVal ="库存解冻"; break;
              case 6: _typeVal ="纠正库存"; break;
          }
          return _typeVal;
      }
  }]);
