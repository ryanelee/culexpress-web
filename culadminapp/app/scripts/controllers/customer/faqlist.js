'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:FAQListCtrl
 * @description
 * # FAQListCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('FAQListCtrl', ["$scope", "$location", "$filter", "faqService", "plugMessenger","storage", function ($scope, $location, $filter, faqService, plugMessenger,storage) {
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];

      $scope.dataList = [];
      $scope.pagination = {
          pageSize: "20",
          pageIndex: 1,
          totalCount: 0
      }
      /*search bar*/
      $scope.searchBar = {
          keywordType: "transactionnumber",
          orderStatus: "0",
          warehouse: "0",
          messageType: "",
          startDate: "",
          endDate: "",
          opened: {
              startDate: false,
              endDate: false
          },
          selectedAll: false
      }
         $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }
            //   storage.session.setObject("searchBar", $scope.searchBar);

      faqService.getMessageType(7, function (result) {
          $scope.searchBar.messageTypeData = [{ "typeID": "", "typeName": "全部问题" }].concat(result);
      });

      $scope.btnSelectedItem = function (item) {
          if (!!item) {
              if (!item._selected) {
                  $scope.searchBar.selectedAll = false;
              }
          } else {
              $.each($scope.dataList, function (i, item) {
                  item._selected = $scope.searchBar.selectedAll;
              });
          }
      }

      $scope.getData = function () {
           storage.session.setObject("searchBar", $scope.searchBar);
          var _options = {
              "pageInfo": $scope.pagination,
              "dateFrom": !!$scope.searchBar.startDate ? $scope.searchBar.startDate.toISOString() : "",
              "dateTo": !!$scope.searchBar.endDate ? $scope.searchBar.endDate.toISOString() : "",
          }
          if (!!$scope.searchBar.orderStatus) {
              _options["status"] = $scope.searchBar.orderStatus;
          }
          if (!!$scope.searchBar.warehouse) {
              _options["receivedWarehouseNumber"] = $scope.searchBar.warehouse;
          }
          if (!!$scope.searchBar.messageType) {
              _options["messageType"] = $scope.searchBar.messageType;
          }
          _options[$scope.searchBar.keywordType] = $scope.searchBar.keywords;
          faqService.getList(_options, function (result) {
              $.each(result.data, function (index, item) {
                  item._status = item.status == 0 ? "已处理" : "未处理";
                  switch (item.receivedWarehouseNumber) {
                      case 0:
                          item._receivedWarehouseNumber = "CA";
                          break;
                      case 1:
                          item._receivedWarehouseNumber = "DE";
                          break;
                      case 2:
                          item._receivedWarehouseNumber = "OR";
                          break;
                  }
                  item._messageType = $.grep($scope.searchBar.messageTypeData, function (n) { return n.typeID == item.messageType })[0].typeName;
              });
              $scope.dataList = result.data;
              $scope.pagination.totalCount = result.pageInfo.totalCount;
          });
      }

      $scope.btnSearch = function () {
          $scope.dataList = [];
          $scope.pagination.pageIndex = 1;
          $scope.pagination.totalCount = 0;
          $scope.getData();
      }

      $scope.btnOpenDetail = function (item) {
          $location.search({ "transactionNumber": item.transactionNumber });
          $location.path("/customer/faqdetail");
      }

      $scope.btnRemove = function (item) {
          faqService.delete(item.messageNumber, function (result) {
              if (result.success == true) {
                  plugMessenger.success("移除成功");
                  $scope.getData();
              }
          });
      }

  }]);
