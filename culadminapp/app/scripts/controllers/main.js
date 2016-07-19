'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('MainCtrl', ["$scope", "$location", function ($scope, $location) {
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];

      //mock data -- START
      var mockdata = {
          numberData: [{ title: "运费收入", total: "22500", symbol: "￥", icon: "fa-caret-up", percent: "19", values: [47, 39, 33, 22, 103, 86, 42] },
                           { title: "订单数", total: "225", icon: "fa-caret-up", percent: "24", values: [47, 39, 103, 86, 42, 81, 82] },
                           { title: "新注册客户", total: "24", icon: "fa-caret-up", percent: "44", values: [47, 39, 33, 22, 42, 81, 82] },
                           { title: "客户总数", total: "132000", icon: "fa-caret-up", percent: "6", values: [47, 22, 5, 86, 42, 81, 3] }],
          customerFlotData: {
              dataList: [{
                  label: "注册客户",
                  data: [
                      [(new Date("10/18/2015")).getTime(), 188],
                      [(new Date("10/19/2015")).getTime(), 205],
                      [(new Date("10/20/2015")).getTime(), 250],
                      [(new Date("10/21/2015")).getTime(), 230],
                      [(new Date("10/22/2015")).getTime(), 240],
                      [(new Date("10/23/2015")).getTime(), 200],
                      [(new Date("10/24/2015")).getTime(), 290]
                  ]
              }, {
                  label: "提交订单",
                  data: [
                      [(new Date("10/18/2015")).getTime(), 10],
                      [(new Date("10/19/2015")).getTime(), 20],
                      [(new Date("10/20/2015")).getTime(), 55],
                      [(new Date("10/21/2015")).getTime(), 50],
                      [(new Date("10/22/2015")).getTime(), 45],
                      [(new Date("10/23/2015")).getTime(), 60],
                      [(new Date("10/24/2015")).getTime(), 75]
                  ]
              }],
              secondaryList: [
                  { id: "category1", title: "本月新注册用户", total: 260, percent: 15, icon: "fa-caret-up", backgroundColor: "#3F7577", values: [47, 39, 33, 22, 103, 86, 42, 81, 82] },
                  { id: "category2", title: "本月客户留言", total: 700, percent: 5, icon: "fa-caret-down", backgroundColor: "#67773F", values: [64, 58, 32, 27, 60, 107, 48, 120, 53] },
                  { id: "category3", title: "本月提交订单", total: 1200, percent: 7, icon: "fa-caret-up", backgroundColor: "#D36B19", values: [76, 23, 62, 61, 53, 71, 42, 83, 86] }
              ]
          },
          customerTicketData: {
              dataList: [{ number: "A001", date: Date.now(), category: "Front-End Site", name: "Smith", title: "Product Review Problem", priority: 1 },
                         { number: "A002", date: Date.now(), category: "Front-End Site", name: "Smith", title: "Product Review Problem", priority: 2 },
                         { number: "A003", date: Date.now(), category: "Front-End Site", name: "Smith", title: "Product Review Problem", priority: 4 },
                         { number: "A004", date: Date.now(), category: "Front-End Site", name: "Smith", title: "Product Review Problem", priority: 3 },
                         { number: "A005", date: Date.now(), category: "Front-End Site", name: "Smith", title: "Product Review Problem", priority: 5 }]
          },
          warehouseFlotData: {
              dataList: [{
                  label: "入库包裹",
                  data: [
                      [(new Date("10/18/2015")).getTime(), 188],
                      [(new Date("10/19/2015")).getTime(), 205],
                      [(new Date("10/20/2015")).getTime(), 250],
                      [(new Date("10/21/2015")).getTime(), 230],
                      [(new Date("10/22/2015")).getTime(), 240],
                      [(new Date("10/23/2015")).getTime(), 200],
                      [(new Date("10/24/2015")).getTime(), 290]
                  ]
              }, {
                  label: "出库订单",
                  data: [
                      [(new Date("10/18/2015")).getTime(), 10],
                      [(new Date("10/19/2015")).getTime(), 20],
                      [(new Date("10/20/2015")).getTime(), 55],
                      [(new Date("10/21/2015")).getTime(), 50],
                      [(new Date("10/22/2015")).getTime(), 45],
                      [(new Date("10/23/2015")).getTime(), 60],
                      [(new Date("10/24/2015")).getTime(), 75]
                  ]
              }],
              secondaryList: [
                  { id: "category1", title: "本月预报货物", total: 5260, percent: 3, icon: "fa-caret-up", backgroundColor: "#3F7577", values: [47, 39, 33, 22, 103, 86, 42, 81, 82] },
                  { id: "category2", title: "本月已入库包裹", total: 3000, percent: 5, icon: "fa-caret-down", backgroundColor: "#67773F", values: [64, 58, 32, 27, 60, 107, 48, 120, 53] },
                  { id: "category3", title: "本月出库订单", total: 700, percent: 7, icon: "fa-caret-up", backgroundColor: "#D36B19", values: [76, 23, 62, 61, 53, 71, 42, 83, 86] }
              ]
          },
          warehouseTicketData: {
              dataList: [{ number: "A001", date: Date.now(), category: "Front-End Site", name: "Smith", title: "Product Review Problem", priority: 1 },
                         { number: "A002", date: Date.now(), category: "Front-End Site", name: "Smith", title: "Product Review Problem", priority: 2 },
                         { number: "A003", date: Date.now(), category: "Front-End Site", name: "Smith", title: "Product Review Problem", priority: 4 },
                         { number: "A004", date: Date.now(), category: "Front-End Site", name: "Smith", title: "Product Review Problem", priority: 3 },
                         { number: "A005", date: Date.now(), category: "Front-End Site", name: "Smith", title: "Product Review Problem", priority: 5 }]
          }
      }
      //mock data -- END

      var userInfo = $scope.$root.userInfo;
      $scope.model = {
          numberStat: false,
          customerFlot: false,
          customerTicket: false,
          warehouseFlot: false,
          warehouseTicket: false,
          warehouseFilter: []
      }

      switch (userInfo.roleName) {
          case "super_admin":
          case "warehouse_admin":
              $scope.model.numberStat = mockdata.numberData;
              $scope.model.customerFlot = mockdata.customerFlotData;
              $scope.model.warehouseFlot = mockdata.warehouseFlotData;
              break;
          case "cs_admin":
              $scope.model.customerFlot = mockdata.customerFlotData;
              $scope.model.customerTicket = mockdata.customerTicketData;
              break;
          case "culwebapp_customer":
              if (userInfo.userType == "vip_customer") {
                  //transfer to order list
                  $location.path("/order/orderlist");
              }
              break;
          //case "super_warehouse":
          //    $scope.model.warehouseFlot = mockdata.warehouseFlotData;
          //    $scope.model.warehouseTicket = mockdata.warehouseTicketData;
          //    break;
      }


      $scope.$on("flot.customer.refresh", function (e, options, callback) {
          switch (options.period) {
              case "week":
                  for (var i = 0; i < $scope.model.customerFlot.dataList.length; i++) {
                      //mock data
                      $scope.model.customerFlot.dataList[i].data = mockData("week");
                  }
                  break;
              case "month":
                  //mock data
                  $scope.model.customerFlot.dataList[0].data = mockData("month");
                  $scope.model.customerFlot.dataList[1].data = mockData("month");
                  break;
              case "year":
                  //mock data
                  $scope.model.customerFlot.dataList[0].data = mockData("year");
                  $scope.model.customerFlot.dataList[1].data = mockData("year");
                  break;
          }
          callback($scope.model.customerFlot);
      });

      $scope.$on("flot.warehouse.refresh", function (e, options, callback) {
          switch (options.period) {
              case "week":
                  for (var i = 0; i < $scope.model.warehouseFlot.dataList.length; i++) {
                      //mock data
                      $scope.model.warehouseFlot.dataList[i].data = mockData("week");
                  }
                  break;
              case "month":
                  //mock data
                  $scope.model.warehouseFlot.dataList[0].data = mockData("month");
                  $scope.model.warehouseFlot.dataList[1].data = mockData("month");
                  break;
              case "year":
                  //mock data
                  $scope.model.warehouseFlot.dataList[0].data = mockData("year");
                  $scope.model.warehouseFlot.dataList[1].data = mockData("year");
                  break;
          }
          callback($scope.model.warehouseFlot);
      });

      //mock data function
      var mockData = function (type) {
          var data = [];
          switch (type) {
              case "week":
                  for (var i = 25; i <= 31; i++) {
                      data.push([(new Date("10/" + i + "/2015")).getTime(), parseInt(Math.random() * 100)]);
                  }
                  break;
              case "month":
                  for (var i = 1; i <= 31; i++) {
                      data.push([(new Date("10/" + i + "/2015")).getTime(), parseInt(Math.random() * 100)]);
                  }
                  break;
              case "year":
                  for (var i = 1; i <= 12; i++) {
                      data.push([(new Date(i + "/1/2015")).getTime(), parseInt(Math.random() * 100)]);
                  }
                  break;
          }
          return data;
      }
  }]);
