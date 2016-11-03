'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.sysroleService
 * @description
 * # sysroleService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('sysroleService', ["$http", function ($http) {
      var self = this;

      //创建总单
      self.create = function (options, callback) {
          $http.post(cul.apiPath + "/role", options).success(function (result) {
              callback(result);
          })
      }

      //修改总单
      self.update = function (options, callback) {
          $http.PUT(cul.apiPath + "/role", options).success(function (result) {
              callback(result);
          })
      }

      //查询总单列表
      self.getList = function (options, callback) {
          $http.post(cul.apiPath + "/role/list", options).success(function (result) {
              callback(result);
          })
      }

      //查询总单列表
      self.getFunctionList = function (options, callback) {
          $http.get(cul.apiPath + "/function", options).success(function (result) {
              callback(result);
          })
      }

      //查询总单详情
      self.getDetail = function (role_id, callback) {
          $http.get(cul.apiPath + "/role/" + role_id).success(function (result) {
              callback(result);
          })
      }

  }]);
