'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseInventoryCtrl
 * @description
 * # WarehouseInventoryCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseInventoryCtrl', ['$rootScope','$scope', '$location', '$window', 'warehouseService', 'inventoryService',
      function ($rootScope,$scope, $location, $window, warehouseService, inventoryService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.dataList = [];
          $scope.customer_ids = JSON.parse($window.sessionStorage.getItem("role")).customer_ids;

          /*search bar*/
          $scope.searchBar = {
              keywordType: "itemNumber",
              warehouseNumber: "",
              inventoryCondition: "",
              inventoryConditionValue: "0",
              categoryId: "",
              categorySubId: "",

              dateRange: "",
              startDate: "",
              endDate: "",
              opened: {
                  startDate: false,
                  endDate: false
              }
          }

          $scope.pagination = {
              pageSize: "20",
              pageIndex: 1,
              totalCount: 0
          }

          warehouseService.getWarehouse(function (result) {
              if (result.length == 1) {
                  $scope.searchBar.warehouseList = result;
                  $scope.searchBar.warehouseNumber = $scope.searchBar.warehouseList[0].warehouseNumber;
              } else {
                  $scope.searchBar.warehouseList = [{ warehouseNumber: "", warehouseName: "全部" }].concat(result);
              }
          });

          inventoryService.getCategoryList(function (result) {
              if (!!result) {
                  $scope.searchBar.categoryList = [{ cateid: "", name: "全部" }].concat(result);
                  $scope.searchBar.categorySubList = [{ cateid: "", name: "全部" }];
              }
          });

          $scope.changeCategory = function () {
              $scope.searchBar.categorySubId = "";
              $scope.searchBar.categorySubList = [{ cateid: "", name: "全部" }];
              var currentCategory = _.findWhere($scope.searchBar.categoryList, { cateid: $scope.searchBar.categoryId });
              if (!!currentCategory) {
                  $scope.searchBar.categorySubList = $scope.searchBar.categorySubList.concat(currentCategory.sub || []);
              }
          }

          var _filterOptions = function () {
              var _options = {
                  "pageInfo": $scope.pagination,
                  "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
                  "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : "",
              }
              if (!!$scope.searchBar.categoryId) {
                  _options["itemCategory"] = $scope.searchBar.categoryId;
              }
              if (!!$scope.searchBar.categorySubId) {
                  _options["itemSubCategory"] = $scope.searchBar.categorySubId;
              }

              switch ($scope.searchBar.inventoryCondition) {
                  case ">":
                      _options["inventoryFrom"] = $scope.searchBar.inventoryConditionValue;
                      break;
                  case "<":
                      _options["inventoryTo"] = $scope.searchBar.inventoryConditionValue;
                      break;
                  case "=":
                      _options["inventory"] = $scope.searchBar.inventoryConditionValue;
                      break;
              }

              if (!!$scope.searchBar.warehouseNumber) {
                  _options["warehouseNumber"] = $scope.searchBar.warehouseNumber;
              }
              if (!!$scope.searchBar.keywords) {
                  if ($scope.searchBar.keywordType == "customerNumber"
                      && parseInt($scope.customer_ids) !== 0
                      && !$scope.customer_ids.split(",").includes($scope.searchBar.keywords)) {
                      $scope.searchBar.keywords = "没有查看该客户的权限,请联系统管理员";
                  }

                  _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
              }
              return angular.copy(_options);
          }

          $scope.getData = function () {
              inventoryService.getList(_filterOptions(), function (result) {
                  var _data = result.data;
                  if (parseInt($scope.customer_ids) !== 0) {
                      _data = _data.filter(function(x){
                          return $scope.customer_ids.split(",").includes(x.customerNumber);
                      });
                  }

                  $scope.dataList = _data;
                  $scope.pagination.totalCount = result.pageInfo.totalCount;
                  $rootScope.$emit("changeMenu");
              });
          }
          $scope.getData();

          $scope.btnSearch = function () {
              $scope.selectedListCache = [];
              $scope.dataList = [];
              $scope.pagination.pageIndex = 1;
              $scope.pagination.totalCount = 0;
              $scope.getData();
          }

          $scope.btnAction = function (type, item) {
              if (!!item) $location.search({ itemNumber: item.itemNumber });
              switch (type) {
                  case "frozen":
                      $location.path("/warehouse/inventoryfrozen");
                      break;
                  case "adjust":
                      $location.path("/warehouse/inventoryadjust");
                      break;
                  case "logs":
                      $location.path("/warehouse/inventoryloglist");
                      break;
                  case "detail":
                      $location.path("/warehouse/inventorydetail");
                      break;
              }
          }
      }]);

