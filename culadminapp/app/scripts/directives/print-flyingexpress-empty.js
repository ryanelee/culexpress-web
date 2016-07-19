'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:printFlyingExpress2
 * @description
 * # printFlyingExpress2
 */
angular.module('culAdminApp')
  .directive('printFlyingExpressEmpty', ["$http", "$timeout", "warehouseService", "plugMessenger",
      function ($http, $timeout, warehouseService, plugMessenger) {
          return {
              templateUrl: "views/templates/common/print-flyingexpress_empty_form_tpl.html",
              restrict: 'E',
              replace: true,
              scope: true,
              link: function postLink($scope, $element, attrs) {
                  var barCodeSettings = {
                      addQuietZone: "1",
                      barHeight: "25",
                      barWidth: "1",
                      bgColor: "#FFFFFF",
                      color: "#000000",
                      moduleSize: "5",
                      output: "css",
                      posX: "10",
                      posY: "20"
                  }

                  $scope.data = {
                      printCount: 1
                  }

                  $scope.btnPrint = function () {
                      if (!_.isFinite($scope.data.printCount) || $scope.data.printCount <= 0) {
                          plugMessenger.info("请输入正确的数量");
                          return;
                      }
                      warehouseService.registerOutboundPackages($scope.data.printCount, function (result) {
                          var _array = [],
                              _template = $element.find("#print-template").html(),
                              _$template = null;
                          _.each(result, function (item) {
                              _array.push(_template.replace(RegExp("\\$\\{trackingNumber\\}", "gi"), item));
                          });
                          _$template = $(_array.join(""));

                          $.each(_$template.find("div[trackingNumber]"), function (index, el) {
                              $(el).barcode($(el).attr("trackingNumber"), "code128", barCodeSettings);
                          });
                          _$template.jqprint();
                          _modalAction("hide");
                      });
                  }

                  var _modalAction = function (action) {
                      switch (action) {
                          case "show":
                              $scope.data.printCount = 1;   //初始化
                              $element.modal("show");
                              break;
                          case "hide":
                              $element.modal("hide");
                              break;
                      }
                  }

                  $scope.$on("print-flying-express-empty", function (event, action) {
                      _modalAction(action);
                  });
              }
          };
      }]);
