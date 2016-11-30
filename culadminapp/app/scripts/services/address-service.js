'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.addressService
 * @description
 * # addressService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('addressService', ["$http", function ($http) {
      var self = this;

      self.getDetail = function (transactionNumber, callback) {
          $http.get(cul.apiPath + "/receiveaddress/" + transactionNumber)
          .success(function (result) {
              console.log(result);
              callback(result);
          });
      }

      self.getList = function (options, callback) {
          $http.post(cul.apiPath + "/receiveaddress/list", options)
          .success(function (result) {
              $.each(result.data, function (index, item) {
                  switch (item.verifyMark) {
                      case 0:
                          item._verifyMark = "未验证";
                          break;
                      case 1:
                          item._verifyMark = "已验证";
                          break;
                  }
              });
              callback(result);
          });
      }
      
      self.update = function (data, callback) {
          $http.put(cul.apiPath + "/receiveaddress", data)
          .success(function (result) {
              callback(result);
          });
      }

      self.delete = function (ids, callback) {
          $http.delete(cul.apiPath + "/receiveaddress?number=" + ids)
          .success(function (result) {
              callback(result);
          });
      }

      self.getProvinceList = function (callback) {
          $http.get(cul.apiPath + '/province').success(function (data) {
              callback(data);
          });
      }
  }]);
