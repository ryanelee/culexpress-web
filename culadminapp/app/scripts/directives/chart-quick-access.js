'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:chartQuickAccess
 * @description
 * # chartQuickAccess
 */
angular.module('culAdminApp')
  .directive('chartQuickAccess', ["$location", "$timeout", "userService", "menuInfoService", function ($location, $timeout, userService, menuInfoService) {
      return {
          templateUrl: "views/templates/common/chart-quick-access_tpl.html",
          restrict: 'E',
          replace: true,
          scope: true,
          link: function postLink($scope, $element, attrs) {
              $scope.userInfo = userService.getUserInfo();

              $scope.btnTransferPage = function (route) {
                  $location.path(route);
              }

              var _refresh = function () {
                  switch ($scope.userInfo.roleName) {
                      case "super_admin":
                      case "warehouse_admin":
                          $scope.chartList = [/*{ route: "/customer/customerlist", icon: "fa-bar-chart-o", title: "客户管理", desc: "查看管理客户信息", css: "bg-color-green", },*/
                                              { route: "/order/orderlist", icon: "fa-envelope", title: "订单管理", desc: "查询管理订单信息", css: "bg-color-blue", },
                                              /*{ route: null, icon: "fa-table", title: "财务管理", desc: "财务明细，客户消费记录信息", css: "bg-color-orange", }*/];
                          
                          break;
                      case "cs_admin":
                          $scope.chartList = [/*{ route: "/customer/customerlist", icon: "fa-bar-chart-o", title: "客户列表", desc: "查看管理客户信息", css: "bg-color-green", },
                                              { route: "/customer/messagelist", icon: "fa-envelope", title: "客户留言", desc: "处理客户留言", css: "bg-color-blue", },*/
                                              { route: "/order/orderlist", icon: "fa-table", title: "订单查询", desc: "查询管理订单信息", css: "bg-color-orange", }];
                          break;
                      case "culwebapp_customer":
                          $scope.chartList = [/*{ route: "/customer/customerlist", icon: "fa-bar-chart-o", title: "客户列表", desc: "查看管理客户信息", css: "bg-color-green", },
                                              { route: "/customer/messagelist", icon: "fa-envelope", title: "客户留言", desc: "处理客户留言", css: "bg-color-blue", },*/
                                              { route: "/order/orderlist", icon: "fa-table", title: "订单查询", desc: "查询管理订单信息", css: "bg-color-orange", }];
                          break;
                      //case "culwebapp_warehouse":       //暂无
                      //    $scope.chartList = [{ route: "/customer/customerlist", icon: "fa-bar-chart-o", title: "收货管理", desc: "入库登记，入库单打印和查询", css: "bg-color-green", },
                      //                        { route: "/customer/messagelist", icon: "fa-envelope", title: "拣货管理", desc: "打印拣货清单，下单", css: "bg-color-blue", },
                      //                        { route: "/order/orderlist", icon: "fa-table", title: "出货管理", desc: "称重批价，订单签出", css: "bg-color-orange", }];
                      //    break;
                  }
              }
              $scope.$on("$routeChangeSuccess", function () {
                  _refresh();
              });
              _refresh();
          }
      };
  }]);
