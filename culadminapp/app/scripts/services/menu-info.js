'use strict';

/**
 * @ngdoc service
 * @name culAdminApp.menuInfoService
 * @description
 * # menuInfoService
 * Service in the culAdminApp.
 */
angular.module('culAdminApp')
  .service('menuInfoService', ["$rootScope", function ($rootScope) {
      var self = this;
      var _menus = [{
          key: "customer_management",
          title: "客户管理",
          icon: "fa-users",
          url: null,
          tip: null,
          childs: [
              { title: "客户查询", icon: null, url: "/customer/customerlist", childs: [{ title: "客户详情", icon: null, url: "/customer/customerdetail", hidden: true }] },
              { title: "地址查询", icon: null, url: "/customer/addresslist", childs: [{ title: "地址详情", icon: null, url: "/customer/addressdetail", hidden: true }] },
              { hidden: true, title: "身份认证", icon: null, url: null },
              { hidden: true, title: "证件下载", icon: null, url: null },
              { hidden: true, title: "问题处理", icon: null, url: "/customer/faqmanagement", childs: [{ title: "问题详情", icon: null, url: "/customer/faqdetail", hidden: true }] },
              { title: "客户留言", icon: null, url: "/customer/messagelist", /*tip: "86"*/ }
          ]
      }, {
          key: "order_management",
          title: "订单管理",
          icon: "fa-shopping-cart",
          url: null,
          tip: null,
          childs: [
              { title: "订单查询", icon: null, url: "/order/orderlist", childs: [{ title: "订单详情", icon: null, url: "/order/orderdetail", hidden: true }], },
              { title: "订单导出", icon: null, url: "/order/orderexport", hidden: true, },
              { title: "订单打印", icon: null, url: "/order/orderprint", },
              { title: "线下订单创建", icon: null, url: "/order/orderofflineimport", },
              { title: "批量更新包裹", icon: null, url: "/order/orderpackagebatchupdate", },
              { title: "批量更新轨迹", icon: null, url: "/order/ordertrackbatchupdate", }
          ]
      }, {
          key: "payment_management",
          title: "财务管理",
          icon: "fa-building",
          url: null,
          tip: null,
          childs: [
              { title: "财务列表", icon: null, url: "/finance/financelist", },
              { title: "财务明细", icon: null, url: "/finance/financedetail", hidden: true },
              { title: "支付详情", icon: null, url: "/finance/financedetail/pay", hidden: true },

              { hidden: true, title: "财务明细", icon: null, url: null, },
              { hidden: true, title: "大包新批价", icon: null, url: null, },
              { hidden: true, title: "SH批价", icon: null, url: null, },
              { hidden: true, title: "CA批价", icon: null, url: null, },
              { hidden: true, title: "USPS批价", icon: null, url: null, },
              { hidden: true, title: "财务扣款", icon: null, url: null, },
              { hidden: true, title: "充值记录", icon: null, url: null, },
              { hidden: true, title: "消费记录", icon: null, url: null, },
              { hidden: true, title: "消费总额", icon: null, url: null, },
              { hidden: true, title: "调价记录", icon: null, url: null, },
              { hidden: true, title: "调分记录", icon: null, url: null, }
          ]
      }, {
          key: "warehouse_management",
          title: "仓储管理",
          icon: "fa-home",
          url: null,
          tip: null,
          //hidden: true,
          childs: [
              { title: "收货管理", icon: null, url: '/warehouse/receipt' },
              { title: "收货登记", icon: null, url: '/warehouse/editreceipt', hidden: true },
              {
                  title: "收货管理", icon: null, tip: "new", url: '/warehouse/receipt2',
                  childs: [
                      { hidden: true, title: "入库登记查看", icon: null, url: '/warehouse/receiptdetail2', },
                      { hidden: true, title: "入库登记", icon: null, url: '/warehouse/receiptedit2', },
                      { hidden: true, title: "入库清点", icon: null, url: '/warehouse/receiptcheck2', },
                      { hidden: true, title: "异常管理", icon: null, url: '/warehouse/receiptexception', },
                      { hidden: true, title: "异常登记", icon: null, url: '/warehouse/receiptexceptionedit', },
                      { hidden: true, title: "异常查看", icon: null, url: '/warehouse/receiptexceptiondetail', },
                  ]
              },
              {
                  title: "上架管理", icon: null, url: '/warehouse/onshelf',
                  childs: [
                      { hidden: true, title: "上架登记", icon: null, url: '/warehouse/onshelfdetail', },
                      {
                          title: "架位管理", icon: null, url: '/warehouse/shelf',
                          childs: [
                              { hidden: true, title: "架位详情", icon: null, url: '/warehouse/shelfdetail', },
                          ]
                      },
                  ]
              },
              {
                  title: "架位管理", icon: null, url: '/warehouse/shelfmanagement',
                  childs: [
                      { hidden: true, title: "创建架位", icon: null, url: '/warehouse/shelfmanagementcreate', },
                      { hidden: true, title: "架位详情", icon: null, url: '/warehouse/shelfmanagementdetail', },
                  ]
              },
              {
                  title: "库存管理", icon: null, url: '/warehouse/inventory',
                  childs: [
                      { hidden: true, title: "库存明细", icon: null, url: '/warehouse/inventorydetail', },
                      { hidden: true, title: "库存日志", icon: null, url: '/warehouse/inventoryloglist', },
                      { hidden: true, title: "冻结/解冻库存", icon: null, url: '/warehouse/inventoryfrozen', },
                      { hidden: true, title: "纠正库存", icon: null, url: '/warehouse/inventoryadjust', }
                  ]
              },
              {
                  title: "出库管理", icon: null, url: '/warehouse/bucket',
                  childs: [
                      { hidden: true, title: "出库总单明细", icon: null, url: '/warehouse/bucketedit', }
                  ]
              },
              { hidden: true, title: "拣货管理", icon: null, url: '/warehouse/picking', },
              { hidden: true, title: "拣货管理", icon: null, url: '/warehouse/editpicking', hidden: true },
              { title: "打包管理", icon: null, url: '/warehouse/package' },
              { hidden: true, title: "按单打包", icon: null, url: '/warehouse/editpackage', hidden: true },
              { title: "打包登记（线上订单）", icon: null, url: '/warehouse/registerpackageonline', hidden: true },
              { title: "打包登记（线下订单）", icon: null, url: '/warehouse/registerpackageoffline', hidden: true },
              { hidden: true, title: "出货管理", icon: null, url: '/warehouse/shipping', },
              { hidden: true, title: "订单签出", icon: null, url: '/warehouse/editshipping', hidden: true }
          ]
      }, {
          key: "truck_management",
          title: "物流管理",
          icon: "fa-truck",
          url: null,
          tip: null,
          hidden: true,
          childs: [
              { title: "添加渠道", icon: null, url: null, },
              { title: "渠道查询", icon: null, url: null, },
              { title: "渠道集成", icon: null, url: null, }
              //{ title: "运单明细", icon: null, url: null, },
              //{ title: "在线下单", icon: null, url: null, },
              //{ title: "地址管理", icon: null, url: null, },
              //{ title: "出库登记", icon: null, url: null, },
              //{ title: "当前出库", icon: null, url: null, },
              //{ title: "历史出库", icon: null, url: null, },
              //{ title: "翔通分配", icon: null, url: null, },
              //{ title: "翔通打印", icon: null, url: null, },
              //{ title: "条码打印", icon: null, url: null, },
              //{ title: "单号关联", icon: null, url: null, },
              //{ title: "新单出库", icon: null, url: null, }
          ]
      }, {
          title: "系统管理",
          icon: "fa-database",
          url: null,
          tip: null,
          childs: [
              { title: "操作记录", icon: null, url: "/system/operationloglist" },
              { title: "登录记录", icon: null, url: "/system/loginloglist" }
          ]
      } /*{
          title: "报表管理",
          icon: "fa-bar-chart",
          url: null,
          tip: null
      }*/]

      self.getMenus = function () {
          var userInfo = $rootScope.userInfo,
              result = [];
          $.each(_menus, function (index, menu) {
              switch (userInfo.roleName) {
                  case "super_admin":   //管理部门
                  case "warehouse_admin":
                      result.push(menu);
                      break;
                  case "cs_admin":         //客服部
                      if (menu.key == "customer_management" || menu.key == "order_management") {
                          result.push(menu);
                      }
                      break;
                  case "culwebapp_customer":  //VIP客户
                      if (menu.key == "order_management") {
                          result.push(menu);
                      }
                      break;
              }
          });

          return angular.copy(result);
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
          var obj = {
              menu: null,
              routePath: []
          };
          _eachMenus(url, self.getMenus(), obj);
          return obj;
      }
  }]);
