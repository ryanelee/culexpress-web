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

            // $http.get(cul.apiPath + '/web/recentnotify').then(function (data) {
            //     $scope.RecentNotifies = data;
            // });

            // $http.get(cul.apiPath + '/web/recentrebate').then(function (data) {
            //     $scope.RecentRebates = data;
            // });

            // $http.get(cul.apiPath + '/web/client').then(function (data) {
            //     $scope.Clients = data;
            // });

            $scope.hoverHt = function(dom, type) {
              if (type === 'hover') {
                $('.'+dom).addClass(dom+'-hover');
              } else {
                $('.'+dom).removeClass(dom+'-hover');
              }
            }

            // 流程鼠标移入移除控制效果
            $scope.hoverLC = function(sty, type) {
              var dom = $('.lc-right');
              dom.removeClass('lc-rk').removeClass('lc-ck').removeClass('lc-ps').addClass(sty);
            }

            //普通广告管理 公开
            $scope.openAnnounceList = [{
                title:"",
                content:""
            }];
            var obj = {type:2,status:1,openAll:0};
            $scope.getOpenAnnounce = function(obj) {
                $http.post(cul.apiPath + '/web/WebAnnounce',obj).then(function (result) {
                    $scope.openAnnounceList = result.data.data.data;
                    console.log($scope.openAnnounceList);
                });
            }
            $scope.getOpenAnnounce();
        }
    ])
.directive('ourclient', function () {
    return {
        templateUrl: 'views/ourclient.html'
    };
});
