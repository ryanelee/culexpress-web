'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:MainIndexCtrlCtrl
 * @description
 * # IndexCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
  .controller('IndexCtrl', ['$scope', '$rootScope', '$window', function ($scope, $rootScope, $window) {
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
      $('.content-wrapper').css('min-height', $('.wrapper').outerHeight(true) - $('.top-bar').outerHeight(true));

      $scope.userInfo = null;
      $rootScope.$on('changeMenu', function() {
          // 获取权限
          var role = {}
          if ($window.sessionStorage.getItem('role')) {
              role = JSON.parse($window.sessionStorage.getItem('role'));
          }
          var _funcs = role.functions ? JSON.parse(role.functions) : {};

          // 处理页面权限
          let count = 1;
          let setRole = setInterval(function(){
            count += 1;
            $('.role').each(function() {
              var roleId = $(this).data('role')
              // 没有权限则隐藏
              if (_funcs[roleId] == 2) {
                $(this).hide();
              }
            })

            if (count > 15) {
              console.log(count);
              clearInterval(setRole);
            }
          }, 100)
      })
  }]);
