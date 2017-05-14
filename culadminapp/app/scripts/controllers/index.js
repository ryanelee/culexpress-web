'use strict';

/**
 * @ngdoc function
 * @name culAdminApp.controller:MainIndexCtrlCtrl
 * @description
 * # IndexCtrl
 * Controller of the culAdminApp
 */
angular.module('culAdminApp')
    .controller('IndexCtrl', ['$scope', '$rootScope', '$window', function($scope, $rootScope, $window) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        //console.log('2345');
        $('.content-wrapper').css('min-height', $('.wrapper').outerHeight(true) - $('.top-bar').outerHeight(true));

        $scope.userInfo = null;
        $rootScope.$on('changeMenu', function() {
            // 获取权限
            var role = {},
                _funcs = [];
            if ($window.sessionStorage.getItem('role')) {
                role = JSON.parse($window.sessionStorage.getItem('role'));
                //role = JSON.parse($window.sessionStorage.getItem('role'));
            }

            if (role && role.length > 0) {
                role.forEach(function(item) {
                    _funcs = $.extend(_funcs, item.functions ? JSON.parse(item.functions) : {});
                })
            }

            //var _funcs = role.functions ? JSON.parse(role.functions) : {};

            // 处理页面权限
            var count = 1;
            var setRole = setInterval(function() {
                count += 1;
                $('.role').each(function() {
                    var roleId = $(this).data('role')
                        // 没有权限则隐藏
                    if (!_funcs[roleId] || _funcs[roleId] == 2) {
                        $(this).hide();
                    }
                })

                if (count > 15) {
                    clearInterval(setRole);
                }
            }, 100)
        })
    }]);