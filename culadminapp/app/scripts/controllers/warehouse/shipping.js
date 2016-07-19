'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:WarehouseShippingCtrl
 * @description
 * # WarehouseShippingCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('WarehouseShippingCtrl', ['$scope', '$location', '$window', 'shippingSvr',
      function ($scope, $location, $window, shippingSvr) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          //$('.switch-demo, .switch-radio-demo').bootstrapSwitch();


          $scope.dataList = [];
          $scope.pagination = {
              pageSize: "20",
              pageIndex: 1,
              total: 0
          }

          $scope.getData = function () {
              var dataResult = shippingSvr.getShippingList({}, $scope.pagination.pageIndex, $scope.pagination.pageSize);
              $scope.dataList = dataResult.list;
              $scope.pagination.total = dataResult.total;
          }
          $scope.getData();

          /*search bar*/
          $scope.searchBar = {
              startDate: new Date(),
              endDate: new Date(),
              opened: {
                  startDate: false,
                  endDate: false
              }
          }


          $scope.linkToExpressWebSite = function (receiptItem) {
              var expressCfg = {
                  USPS: 'https://tools.usps.com/go/TrackConfirmAction_input?strOrigTrackNum=' + receiptItem.expressNumber,
                  UPS: 'http://wwwapps.ups.com/etracking/tracking.cgi?tracknum=' + receiptItem.expressNumber,
                  ONTRAC: 'http://www.ontrac.com/trackingres.asp?tracking_number=' + receiptItem.expressNumber,
                  DHL: 'http://www.dhl.com/atrknav.asp?ShipmentNumber=' + receiptItem.expressNumber,
                  FEDEX: 'https://www.fedex.com/apps/fedextrack/?action=track&action=track&language=english&cntry_code=us&initial=x&tracknumbers=' + receiptItem.expressNumber
              };
              $window.open(expressCfg[receiptItem.expressCompany]);
          }

          $scope.linkToCustomerInfoPage = function (customerNumber) {
              $window.open('http://www.culexpress.com/WMS/ClientInfo.aspx?sysid=' + customerNumber);
          }

          $scope.addShipping = function () {
              $location.path('/warehouse/editshipping');
          }

      }]);