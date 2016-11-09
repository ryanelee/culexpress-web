'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.menuInfoService
 * @description
 * # menuInfoService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('menuInfoService', ["$rootScope", "sysroleService", "$window",
    function ($rootScope, sysroleService, $window) {
      var funcs = [], role = {},_menus = [], _funcs= {}, _methods=[];
      let setMenu = function () {
        if ($window.sessionStorage.getItem('functions')) {
            funcs = JSON.parse($window.sessionStorage.getItem('functions'));
        }
        if ($window.sessionStorage.getItem('role')) {
            role = JSON.parse($window.sessionStorage.getItem('role'));
        }
        _menus = _.groupBy(funcs, 'type')[1];
        _methods = _.groupBy(funcs, 'type')[2];
        _funcs = role.functions ? JSON.parse(role.functions) : {};
      }

      setMenu();
      var self = this;

      self.getMenus = function () {
          setMenu();
          var functions = [];
          var funcObj = {};
          _menus.forEach(function(item) {
              // 根据保存的权限来匹配
              if (_funcs[item.functionID] == 1) {
                funcObj[item.functionID] = item
                if (!item.parentFunctionID) {
                  functions.push(item)
                } else {
                    if (!funcObj[item.parentFunctionID].childs) {
                        funcObj[item.parentFunctionID].childs = []
                    }
                    funcObj[item.parentFunctionID].childs.push(item)
              }
              } else {
                  funcObj[item.functionID] = {}
              }
          })
          return angular.copy(functions);
      }

      // 获取子菜单
      self.getChildMenus = function(id){
        setMenu();
        let menus = _.filter(_methods, function(item) {
            if (item.parentFunctionID == id) {
                item.status = _funcs[item.functionID];
                return item;
            }
        });

        return menus;
      }

      var _eachMenus = function (url, menus, obj) {
          $.each(menus, function (index, menu) {
              if (!obj.menu) {
                  if (url == menu.url) {
                      obj.menu = menu;
                      obj.routePath.push(menu);
                      return false;
                  } else if (!!menu.childs && menu.childs.length > 0) {
                      obj.routePath.push(menu);
                      _eachMenus(url, menu.childs, obj);
                  } else if (menus.length == index + 1) {
                      obj.routePath = [];
                  }
              }
          });
      }
      self.getMenuInfo = function (url) {
          setMenu();
          var obj = {
              menu: null,
              routePath: []
          };
          _eachMenus(url, _menus, obj);
          return obj;
      }
  }]);
