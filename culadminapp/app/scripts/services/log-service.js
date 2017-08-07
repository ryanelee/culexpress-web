'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.LogService
 * @description
 * # LogService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('LogService', ["$http", function ($http) {
      var self = this;

      self.getOperationList = function (options, callback) {
          $http.post(cul.apiPath + "/operationLog/list", options).then(function (result) {
              var result = result.data;
              $.each(result.data, function (index, item) {
                  switch (item.operationType) {
                      case 0: item._operationType = "修改密码"; break;
                      case 1: item._operationType = "调整积分"; break;
                      case 2: item._operationType = "取消推荐人"; break;
                      case 3: item._operationType = "批准VIP资格"; break;
                      case 4: item._operationType = "取消VIP资格"; break;
                      case 5: item._operationType = "激活账号"; break;
                  }
              });
              callback(result);
          });
      }

      self.getLoginList = function (options, callback) {
          $http.post(cul.apiPath + "/user/loginlog/list", options).then(function (result) {
              var result = result.data;
              $.each(result.data, function (index, item) {
                  switch (item.result) {
                      case "success": item._result = "登录成功"; break;
                      case "failed": item._result = "登录失败"; break;
                  }
              });
              callback(result);
          });
      }
  }]);