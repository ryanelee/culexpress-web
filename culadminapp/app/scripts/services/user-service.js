'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.userService
 * @description
 * # userService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('userService', ["$http", "$rootScope", "$location", function ($http, $rootScope, $location) {
      var self = this,
          userInfoKey = "user-info";

      self.login = function (userInfo, callback) {
          $http.post(cul.apiPath + "/user/login", {
              "password": userInfo.password,
              "emailAddress": userInfo.username
          }).success(function (result) {
              localStorage.setItem(userInfoKey, null);
              sessionStorage.setItem(userInfoKey, null);
              $rootScope.userInfo = null;

              if (!result.message) {
                  switch (result.roleName) {
                      case "super_admin":
                      case "warehouse_admin":
                          result.roleTitle = "管理部门";
                          break;
                      case "cs_admin":
                          result.roleTitle = "客服部";
                          break;
                      case "culwebapp_customer":
                          switch (result.userType) {
                              case "normal_customer":
                                  result.roleTitle = "普通客户";
                                  break;
                              case "vip_customer":
                                  result.roleTitle = "VIP客户";
                                  break;
                          }
                          break;
                  }

                  var str_userInfo = JSON.stringify(result);
                  if (userInfo.remember) {
                      localStorage.setItem(userInfoKey, str_userInfo);
                  } else {
                      sessionStorage.setItem(userInfoKey, str_userInfo);
                  }
                  $rootScope.userInfo = result;
                  ga('set', 'loginusername', result.emailAddress);
                  ga("send", "pageview", { page: $location.path() });
              }
              callback(result.message);
          });
      }

      self.logout = function (callback) {
          localStorage.removeItem(userInfoKey);
          sessionStorage.removeItem(userInfoKey);
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          $rootScope.userInfo = null;
          if (!!callback) callback();
      }

      // 添加用户
      self.addUser = function (userInfo, callback) {
        $http.post(cul.apiPath + "/user/login", userInfo).success(function (result) {
            callback(result);
        });
      }

      self.getUserInfo = function () {
          var _userInfo = sessionStorage.getItem(userInfoKey) || localStorage.getItem(userInfoKey)
          if (!!_userInfo) _userInfo = JSON.parse(_userInfo);
          return _userInfo;
      }

      self.resetPassword = function (options, callback) {
          $http.put(cul.apiPath + "/user/password/reset/default").success(function (result) {
              callback(result);
          });
      }

      $.extend(true, window.cul, {
          service: {
              user: self
          }
      });
  }]);
