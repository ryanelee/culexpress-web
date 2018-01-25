'use strict';

/**
 * @ngdoc service
 * @name culwebApp.customerMessageService
 * @description
 * # customerMessageService
 * Service in the culwebApp.
 */
angular.module('culwebApp')
  .service('customerMessageService', ["$http", function ($http) {
      var self = this;

      self.getDetail = function (id, callback) {
          $http.get(cul.apiPath + "/customermessage/" + id).then(function (result) {
              callback(result);
          });
      }

      self.push = function (options, callback) {
          $http.post(cul.apiPath + "/customermessage/log", options).then(function (result) {
              callback(result);
          });
      }
  }]);
