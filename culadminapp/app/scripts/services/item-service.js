'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.bucketService
 * @description
 * # bucketService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('ItemService', ["$http", function ($http) {
      var self = this;

      self.getItemCategoryList = function (options, callback) {
        $http.post(cul.apiPath + "/getItemCategoryList", options).then(function (data) {
            callback(data);
        })
    }



  }]);
