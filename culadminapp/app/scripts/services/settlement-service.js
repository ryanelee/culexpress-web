'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.settlementService
 * @description
 * # settlementService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('settlementService', ["$http", function ($http) {
      var self = this;

      self.getList = function (options, callback) {
          debugger;
          $http.post(cul.apiPath + "/settlement/list", options).success(function (result) {
              callback(result);
          });
      }

      self.reportList = function (options, callback) {
          $http.post(cul.apiPath + "/settlement/report/list", options).success(function (result) {
              callback(result);
          });
      }

      self.instruction = function (options, callback) {
          $http.post(cul.apiPath + "/settlement/instruction", options).success(function (result) {
              callback(result);
          });
      }
  }]);
