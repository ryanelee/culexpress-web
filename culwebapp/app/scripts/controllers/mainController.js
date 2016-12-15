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

            $http.get(cul.apiPath + '/web/recentnotify').then(function (data) {
                $scope.RecentNotifies = data;
            });

            $http.get(cul.apiPath + '/web/recentrebate').then(function (data) {
                $scope.RecentRebates = data;
            });

            $http.get(cul.apiPath + '/web/client').then(function (data) {
                $scope.Clients = data;
            });
        }
    ])
.directive('ourclient', function () {
    return {
        templateUrl: 'views/ourclient.html'
    };
});
