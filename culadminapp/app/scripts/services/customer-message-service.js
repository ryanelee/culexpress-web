'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.customerMessageService
 * @description
 * # customerMessageService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('customerMessageService', ["$http", function ($http) {
      var self = this;

      self.getDetail = function (id, callback) {
          $http.get(cul.apiPath + "/customermessage/" + id).success(function (result) {
              callback(result);
          });
      }

      self.push = function (options, callback) {
          $http.post(cul.apiPath + "/customermessage/log", options).success(function (result) {
              callback(result);
          });
      }
  }]);
