'use strict';

//将kingadmin的style-swicher转移到这里, 作为angularjs的指令使用.

/**
 * @ngdoc directive
 * @name culAdminApp.directive:styleSwicher
 * @description
 * # styleSwicher
 */
angular.module('culAdminApp')
  .directive('styleSwicher', ["$http", function ($http) {
      return {
          templateUrl: "views/templates/master/style-swicher_tpl.html",
          restrict: 'E',
          $scope: true,
          replace: true,
          link: function postLink($scope, $element, attrs) {
              // switcher toggle 	
              if ($('body').hasClass('home')) {

                  $element.css('right', '0').delay(1000).animate({
                      right: '-=250'
                  }, 300);

              } else {

                  $element.css('right', '-250px');
              }

              $element.find('.del-switcher-toggle').clickToggle(
                  function () {
                      $element.animate({
                          right: '+=250'

                      }, 300);
                  },
                  function () {
                      $element.animate({
                          right: '-=250'

                      }, 300);
                  }
              );

              // check if skin has already applied before
              var skin = localStorage.getItem('skin');
              var skinLogo = localStorage.getItem('skinLogo');
              var skinLogoDefault = 'assets/img/kingadmin-logo-white.png';

              if (skin != null) {
                  $('head').append('<link rel="stylesheet" href="' + skin + '" type="text/css" />');

                  // set the selected button style		
                  if (skin.toLowerCase().indexOf('fulldark') >= 0) {
                      $element.find('.switch-skin-full.fulldark').addClass('selected');
                  } else if (skin.toLowerCase().indexOf('fullbright') >= 0) {
                      $element.find('.switch-skin-full.fullbright').addClass('selected');
                  }
              }

              if (skinLogo != null) {
                  $('.logo img').attr('src', skinLogo);
              }

              // switch items
              $element.find('.switch-skin, .switch-skin-full').click(function (e) {

                  e.preventDefault();

                  resetStyle();
                  $('head').append('<link rel="stylesheet" href="' + $(this).attr('data-skin') + '" type="text/css" />');

                  if ($(this).hasClass('fullbright')) {
                      skinLogo = 'assets/img/kingadmin-logo.png';
                  } else {
                      skinLogo = skinLogoDefault;
                  }

                  $('.logo img').attr('src', skinLogo);

                  localStorage.setItem('skin', $(this).attr('data-skin'));
                  localStorage.setItem('skinLogo', skinLogo);
                  
              });

              $element.find('.switch-skin-full').click(function () {
                  $element.find('.switch-skin-full').removeClass('selected');
                  $(this).addClass('selected');
              });

              // fixed top nav checkbox
              $element.find('form').change(function () {
                  if ($element.find('#fixed-top-nav').is(':checked')) {
                      $('.top-bar').addClass('navbar-fixed-top');
                  } else {
                      $('.top-bar').removeClass('navbar-fixed-top');
                  }
              });

              // reset stlye
              $element.find('.del-reset-style').click(function () {
                  resetStyle();
              });

              function resetStyle() {

                  // remove skins and reset logo to default
                  $('head link[rel="stylesheet"]').each(function () {

                      if ($(this).attr('href').toLowerCase().indexOf("skins") >= 0)
                          $(this).remove();
                  });

                  $('.logo img').attr('src', 'assets/img/kingadmin-logo-white.png');

                  localStorage.removeItem('skin');
                  localStorage.setItem('skinLogo', skinLogoDefault);

                  // remove fixed top navigation
                  $('.top-bar').removeClass('navbar-fixed-top');
              }
          }
      };
  }]);
