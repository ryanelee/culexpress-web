'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.sysusergroupService
 * @description
 * # sysusergroupService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('sysusergroupService', ["$http", function ($http) {
      var self = this;

      //创建用户组
      self.create = function (options, callback) {
          $http.post(cul.apiPath + "/user_group", options).success(function (result) {
              callback(result);
          })
      }

      //修改用户组
      self.update = function (options, callback) {
          $http.PUT(cul.apiPath + "/user_group", options).success(function (result) {
              callback(result);
          })
      }

      //查询用户组列表
      self.getList = function (options, callback) {
          $http.post(cul.apiPath + "/user_group/list", options).success(function (result) {
              callback(result);
          })
      }

      //查询用户组列表
      self.getFunctionList = function (options, callback) {
          $http.get(cul.apiPath + "/function", options).success(function (result) {
              callback(result);
          })
      }

      //查询用户组详情
      self.getDetail = function (user_group_id, callback) {
          $http.get(cul.apiPath + "/user_group/" + user_group_id).success(function (result) {
              callback(result);
          })
      }

  }]);
