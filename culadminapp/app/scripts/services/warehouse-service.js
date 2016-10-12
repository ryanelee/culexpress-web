'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.warehouseService
 * @description
 * # warehouseService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('warehouseService', ["$http", function ($http) {
      var self = this;

      self.getInboundPackageList = function (options, callback) {
          $http.post(cul.apiPath + "/inboundPackage/list", options).success(function (result) {
              $.each(result.data, function (index, item) {
                  item._status = _statusConvert(item.status);
              });
              callback(result);
          });
      }

      self.getInboundPackageDetail = function (id, callback) {
          $http.get(cul.apiPath + "/inboundPackage/" + id).success(function (result) {
              callback(result);
          });
      }

      self.updateInboundPackageDetail = function (model, callback) {
          $http.put(cul.apiPath + "/inboundPackage/inbound", model).success(function (result) {
              callback(result);
          });
      }

      self.deleteInboundPackageDetail = function (id, callback) {
          $http.delete(cul.apiPath + "/inboundPackage?number=" + id).success(function (result) {
              callback(result);
          });
      }

      self.getOutboundPackageByOrderNumbers = function (ids, callback) {
          //$http.get(cul.apiPath + "/outboundpackage/order/" + ids.join(",")).success(function (result) {
          $http.post(cul.apiPath + "/outboundpackage/order", {
              orderNumber: ids
          }).success(function (result) {
              callback(result);
          });
      }

      self.outboundPackageShip = function (trackingNumbers, callback) {
          var _data = [];
          $.each(trackingNumbers, function (i, trackingNumber) {
              _data.push({
                  "trackingNumber": trackingNumber
              });
          })
          $http.post(cul.apiPath + "/outboundpackage/ship", _data).success(function (result) {
              callback(result);
          });
      }

      self.outboundPackageSplit = function (options, callback) {
          $http.post(cul.apiPath + "/outboundpackage/split", options).success(function (result) {
              callback(result);
          });
      }

      self.getOutboundPackageList = function (options, callback) {
          $http.post(cul.apiPath + "/outboundPackage/list", options).success(function (result) {
              $.each(result.data, function (i, item) {
                  if (!!item.address) {
                      item._shipToAddresses = [];
                      var _str = item.address.receivePersonName;
                      if (!!item.address.cellphoneNumber) _str += "(" + item.address.cellphoneNumber + ")";
                      _str += item.address.address1;
                      if (!!item.address.receiveCompanyName) _str += item.address.receiveCompanyName;
                      if (!!item.address.zipcode) _str += "(" + item.address.zipcode + ")";
                      if ($.grep(item._shipToAddresses, function (n) { return n == _str }).length == 0) {
                          item._shipToAddresses.push(_str);
                      }
                  }
                  switch (item.exportStatus) {
                      case "Exported":
                          item._exportStatus = "已导出";
                          break;
                      case "UnExported":
                      default:
                          item._exportStatus = "未导出";
                          break;
                  }
              });

              callback(result);
          });
      }

      self.getWarehouse = function (callback) {
          $http.get(cul.apiPath + "/warehouse").success(function (result) {
              callback(result);
          })
      }

      self.registerOutboundPackages = function (count, callback) {
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

      self.getCategory = function (callback) {
          $http.get(cul.apiPath + "/item/category/list").success(function (result) {
              callback(result);
          })
      }
  }]);
