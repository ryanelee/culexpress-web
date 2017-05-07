'use strict';

angular
    .module('culwebApp')
    .controller('MainController', ['$rootScope', '$scope', '$http',
        function($rootScope, $scope, $http) {
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
                    $('.' + dom).addClass(dom + '-hover');
                } else {
                    $('.' + dom).removeClass(dom + '-hover');
                }
            }

            // 流程鼠标移入移除控制效果
            $scope.hoverLC = function(sty, type) {
                var dom = $('.lc-right');
                dom.removeClass('lc-rk').removeClass('lc-ck').removeClass('lc-ps').addClass(sty);
            }

            //普通广告管理 公开
            $scope.openAnnounceList = [{
                title: "",
                content: ""
            }];

            $scope.getOpenAnnounce = function() {
                var obj = { type: 2, status: 1, openAll: 1 };
                $http.post(cul.apiPath + '/web/WebAnnounce', obj).then(function(result) {
                    $scope.openAnnounceList = result.data.data.data;
                    console.log($scope.openAnnounceList);
                    var htm = "";
                    if ($scope.openAnnounceList[0]) {
                        var htm1 = '<div class="container-fluid info-banner slideBox hidden-sm">' +
                            '<div class="container">' +
                            '<div class="info-op">' +
                            '<img class="unslider-arrow prev" src="../assets/img/index/icon-info-left.png" />' +
                            '<img class="unslider-arrow next" src="../assets/img/index/icon-info-right.png" />' +
                            '</div>' +
                            '</div>' +
                            '<ul> ';
                        var htm2 = ""
                        for (var i = 0; i < $scope.openAnnounceList.length; i++) {
                            var j = i % 3 + 1;
                            htm2 = htm2 + '' +
                                '<li class="info-banner' + j + '" >' +
                                '<div class="container">' +
                                '<h1 class="info-title">' + $scope.openAnnounceList[i].title + '</h1>' +
                                '<div class="info-content">' +
                                '    <img src="../assets/img/index/info-person' + j + '.png" />' +
                                '<p class="info-detail-lg">' + $scope.openAnnounceList[i].content + '</p>' +
                                '</div>' +
                                '</div>' +
                                '</li>';
                        }
                        var htm3 = ' </ul></div>';
                        htm = htm1 + htm2 + htm3;

                        $("#bana").append(htm);
                        var unslider = $('.info-banner').unslider({
                            nav: false
                        });

                        $('.unslider-arrow').click(function() {

                            var fn = this.className.split(' ')[1];
                            unslider.data('unslider')[fn]();
                        });
                    }



                });
            }
            $scope.getOpenAnnounce();
        }
    ])
    .directive('ourclient', function() {
        return {
            templateUrl: 'views/ourclient.html'
        };
    });