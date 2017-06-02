'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:OrderExportCtrl
 * @description
 * # OrderExportCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('OrderExportCtrl', ["$scope", "orderService","storage", function ($scope, orderService,storage) {
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];

      $scope.dataList = [];

      /*search bar*/
      $scope.searchBar = {
          type: "single",
          channel: "0",
          selectedAll: false
      }

         $scope.tempSearchBar = angular.copy(storage.getSearchObject());
            if ($scope.tempSearchBar) {
                $scope.searchBar = $scope.tempSearchBar ? $scope.tempSearchBar : $scope.searchBar;
            }
            //   storage.session.setObject("searchBar", $scope.searchBar);



      $scope.pagination = {
          pageSize: "20",
          pageIndex: 1,
          totalCount: 0
      }

      $scope.channelFilter = {
          "single": [
              { title: "小包裹身份证渠道", value: "0" },
              { title: "小包裹CA", value: "" },
              { title: "大包裹新", value: "" },
              { title: "USPS渠道", value: "" }
          ],
          "multi": [
              { title: "小包裹身份证渠道", value: "0" },
              { title: "小包裹CA", value: "" },
              { title: "大包裹新", value: "" },
              { title: "USPS渠道", value: "" }
          ],
          "bak": [
              { title: "小包裹身份证渠道", value: "0" },
              { title: "小包裹CQ", value: "" },
              { title: "小包裹TJ", value: "" },
              { title: "大包裹", value: "" },
              { title: "大包裹新", value: "" }
          ],
          "update": [
              { title: "小包裹身份证渠道", value: "0" },
              { title: "小包裹CQ", value: "" },
              { title: "小包裹TJ", value: "" },
              { title: "大包裹", value: "" },
              { title: "大包裹新", value: "" }
          ]
      }

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
          orderService.getList($scope.pagination, function (result) {
              $scope.dataList = result.data;
              $scope.pagination.totalCount = result.totalCount;
          });
      }
      $scope.getData();
  }]);
