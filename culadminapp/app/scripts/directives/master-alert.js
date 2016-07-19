'use strict';

/**
 * @ngdoc directive
 * @name culAdminApp.directive:masterAlert
 * @description
 * # masterAlert
 */
angular.module('culAdminApp')
  .directive('masterAlert', ["$http", function ($http) {
      return {
          templateUrl: "views/templates/master/alert_tpl.html",
          restrict: 'E',
          replace: true,
          $scope: true,
          link: function postLink($scope, $element, attrs) {
              //*******************************************
              /*	BOOTSTRAP TOUR
              /********************************************/
              var kingTour = new Tour({
                  //basePath: "edit/basepath/see/doc/", // please see documentation for this setting
                  basePath: "/dev/kingadmin-1.4/",
                  steps: [
                      {
                          element: "#tour-searchbox",
                          title: "Bootstrap Tour <span class=\"badge element-bg-color-blue\">New</span>",
                          content: "<p>Hello there, this tour can <strong>guide new user</strong> or show new feature/update on your website. " +
                          "Oh and why don't you try search <em>'sales'</em> here to see Widget Live Search on action.</p>" +
                          "<p><em>To navigate the site please follow the tour first or click \"End tour\".</em></p>",
                          placement: "bottom"
                      },
                      {
                          element: "#sales-stat-tab",
                          title: "Dynamic Content",
                          content: "You can select statistic view based on predefined period here."
                      },
                      {
                          element: "#tour-focus",
                          title: "Focus Mode",
                          content: "Focus your attention and hide all irrelevant contents.",
                          placement: "left"
                      },
                      {
                          element: ".del-switcher-toggle",
                          title: "Color Skins",
                          content: "Open the hidden panel here by clicking this icon to apply built-in skins.",
                          placement: "left",
                          backdrop: true
                      },
                      {
                          element: "#start-tour",
                          title: "Start/Restart Tour",
                          content: "Click this link later if you need to <strong>restart the tour</strong>.",
                          placement: "bottom",
                          backdrop: true
                      }
                  ],
                  template: "<div class='popover tour'> " +
                                  "<div class='arrow'></div> " +
                                  "<h3 class='popover-title'></h3>" +
                                  "<div class='popover-content'></div>" +
                                  "<div class='popover-navigation'>" +
                                      "<button class='btn btn-default' data-role='prev'>« Prev</button>" +
                                      "<button class='btn btn-primary' data-role='next'>Next »</button>" +
                                      "<button class='btn btn-default' data-role='end'>End tour</button>" +
                                  "</div>" +
                              "</div>",
                  onEnd: function (tour) {
                      $('#start-tour').prop('disabled', false);
                  }
              });

              /************************
              /*	TOP BAR
              /************************/

              if ($('.top-general-alert').length > 0) {

                  if (localStorage.getItem('general-alert') == null) {
                      $('.top-general-alert').delay(800).slideDown('medium');
                      $('.top-general-alert .close').click(function () {
                          $(this).parent().slideUp('fast');
                          localStorage.setItem('general-alert', 'closed');
                      });
                  }
              }

              kingTour.init();

              $('#start-tour').click(function () {
                  if (kingTour.ended()) {
                      kingTour.restart();
                  } else {
                      kingTour.start();
                  }

                  $(this).prop('disabled', true);
              });

              var $btnGlobalvol = $('.btn-global-volume');
              var $theIcon = $btnGlobalvol.find('i');

              function checkGlobalVolume(iconElement, vSetting) {
                  if (vSetting == null || vSetting == "1") {
                      iconElement.removeClass('fa-volume-off').addClass('fa-volume-up');
                  } else {
                      iconElement.removeClass('fa-volume-up').addClass('fa-volume-off');
                  }
              }

              // check global volume setting for each loaded page
              checkGlobalVolume($theIcon, localStorage.getItem('global-volume'));

              $btnGlobalvol.click(function () {
                  var currentVolSetting = localStorage.getItem('global-volume');
                  // default volume: 1 (on)
                  if (currentVolSetting == null || currentVolSetting == "1") {
                      localStorage.setItem('global-volume', 0);
                  } else {
                      localStorage.setItem('global-volume', 1);
                  }

                  checkGlobalVolume($theIcon, localStorage.getItem('global-volume'));
              });
          }
      };
  }]);
