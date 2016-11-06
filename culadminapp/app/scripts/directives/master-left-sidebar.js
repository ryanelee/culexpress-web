'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:masterTopToolbar
 * @description
 * # masterTopToolbar
 */
angular.module('culAdminApp')
  .directive('masterLeftSidebar', ["$http", "$location", "$timeout", "menuInfoService",
      function ($http, $location, $timeout, menuInfoService) {
          return {
              templateUrl: "views/templates/master/left-sidebar_tpl.html",
              restrict: 'E',
              replace: true,
              $scope: true,
              link: function postLink($scope, $element, attrs) {
                  $scope.menus = menuInfoService.getMenus();
                  $scope.currentMenu = menuInfoService.getMenuInfo($location.path()).menu;
                  $scope.btnChangeRouter = function (menu) {
                      if (!menu.url) return;
                      $scope.currentMenu = menu;
                      $location.search({});
                      $location.path(menu.url);
                  }

                  $timeout(function () {
                      /************************
                      /*	MAIN NAVIGATION
                      /************************/
                      $element.find('.main-menu .js-sub-menu-toggle').click(function (e) {

                          e.preventDefault();

                          var $li = $(this).parent('li');
                          if (!$li.hasClass('active')) {
                              $li.find(' > a .toggle-icon').removeClass('fa-angle-left').addClass('fa-angle-down');
                              $li.addClass('active');
                          }
                          else {
                              $li.find(' > a .toggle-icon').removeClass('fa-angle-down').addClass('fa-angle-left');
                              $li.removeClass('active');
                          }

                          $li.find(' > .sub-menu').slideToggle(300);
                      });

                      $element.find('.js-toggle-minified').clickToggle(
                          function () {
                              $element.addClass('minified');
                              $('.content-wrapper').addClass('expanded');//modify by clark 此处不能使用$element进行find，可以适当优化

                              $element.find('.sub-menu')
                              .css('display', 'none')
                              .css('overflow', 'hidden');

                              $element.find('.main-menu > li > a > .text').animate({
                                  opacity: 0
                              }, 200);

                              $element.find('.sidebar-minified').find('i.fa-angle-left').toggleClass('fa-angle-right');
                          },
                          function () {
                              $element.removeClass('minified');
                              $('.content-wrapper').removeClass('expanded');//modify by clark 此处不能使用$element进行find，可以适当优化
                              $element.find('.main-menu > li > a > .text').animate({
                                  opacity: 1
                              }, 600);

                              $element.find('.sidebar-minified').find('i.fa-angle-left').toggleClass('fa-angle-right');
                          }
                      );

                      // main responsive nav toggle
                      $element.find('.main-nav-toggle').clickToggle(
                          function () {
                              $element.slideDown(300)
                          },
                          function () {
                              $element.slideUp(300);
                          }
                      );

                      /* 根据当前路由展开相应菜单 */
                      $.each($element.find(".main-nav li.active"), function (index, el) {
                          var $el = $(el);
                          $el.parents(".sub-menu").addClass("open");
                          $el.parents("li").addClass("active");
                          $el.parents("li").find("i.toggle-icon").removeClass("fa-angle-left").addClass("fa-angle-down");
                      })
                  })
              }
          };
      }]);
