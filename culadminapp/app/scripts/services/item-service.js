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
    self.insertItemCategory = function (options, callback) {
      $http.post(cul.apiPath + "/insertItemCategory", options).then(function (data) {
          callback(data);
      })
  }
  self.updateItemCategory = function (options, callback) {
    $http.post(cul.apiPath + "/updateItemCategory", options).then(function (data) {
        callback(data);
    })
    
}
self.deleteItemCategory = function (cateid, callback) {
    $http.delete(cul.apiPath + "/deleteItemCategory/"+cateid).then(function (data) {
        callback(data);
    })
    
}

  



  }]);
