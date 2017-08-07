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

      //创建角色
      self.create = function (options, callback) {
          $http.post(cul.apiPath + "/role", options).then(function (result) {
              callback(result.data);
          })
      }

      //修改角色
      self.update = function (options, callback) {
          $http.put(cul.apiPath + "/role", options).then(function (result) {
              callback(result.data);
          })
      }

      //删除角色
      self.delete = function (role_id, callback) {
          $http.delete(cul.apiPath + "/role?role_id="+role_id, {}).then(function (result) {
              callback(result.data);
          })
      }

      //查询角色列表
      self.getList = function (options, callback) {
          $http.post(cul.apiPath + "/role/list", options).then(function (result) {
              callback(result.data);
          })
      }

      //查询角色列表
      self.getFunctionList = function (options, callback) {
          $http.get(cul.apiPath + "/function", options).then(function (result) {
              callback(result.data);
          })
      }

      //查询角色详情
      self.getDetail = function (role_id, callback) {
          $http.get(cul.apiPath + "/role/" + role_id).then(function (result) {
              callback(result.data);
          })
      }

  }]);
