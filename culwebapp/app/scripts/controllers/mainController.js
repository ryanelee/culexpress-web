'use strict';

angular
    .module('culwebApp')
    .controller('MainController', ['$rootScope', '$scope', '$http',
        function ($rootScope, $scope, $http) {
            if (App) {
                App.init();
                App.initParallaxBg();
                OwlCarousel.initOwlCarousel();
                StyleSwitcher.initStyleSwitcher();
                ParallaxSlider.initParallaxSlider();
            }

            $http.get(cul.apiPath + '/web/recentnotify').success(function (data) {
                $scope.RecentNotifies = data;
            });

            $http.get(cul.apiPath + '/web/recentrebate').success(function (data) {
                $scope.RecentRebates = data;
            });

            $http.get(cul.apiPath + '/web/client').success(function (data) {
                $scope.Clients = data;
            });
        }
    ])
.directive('ourclient', function () {
    return {
        templateUrl: 'views/ourclient.html'
    };
});