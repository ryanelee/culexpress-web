'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.faqService
 * @description
 * # faqService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('utilsService', ["$http", function ($http) {
      var self = this,
          _data = {
              provice: null,
              warehouse: null
          };

      $http.get(cul.apiPath + "/provice").success(function (result) {
          _data.provice = result;
      });

      $http.get(cul.apiPath + "/warehouse").success(function (result) {
          _data.warehouse = result;
      });

      self.getProvice = function () {
          return angular.copy(_data.provice);
      }

      self.getWarehouse = function () {
          return angular.copy(_data.warehouse);
      }
  }]);
