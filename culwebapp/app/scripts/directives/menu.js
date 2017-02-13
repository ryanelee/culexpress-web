angular.module('culwebApp')
    .directive('umiMenu', ['$timeout', '$compile', 'menuSerivce',
        function($timeout, $compile, menuSerivce) {
            return {
                restrict: "EA",
                replace: true,
                scope: {
                    source: '=',
                    cls: '@',
                    key: '@'
                },
                template: '<ul class="{{cls}}" id="{{key}}"><menu-item ng-if="dataItem.visible !== false" ng-repeat="dataItem in source" ng-model="dataItem" child-name="{{childName}}"></menu-item></ul>',
                link: function(scope, element, attrs) {
                    var childName = scope.childName = attrs.childName || 'childs',
                        isVip = scope.$root.currentUser && scope.$root.currentUser.isVip;
                    if (!scope.source && !attrs.nestedInner) {
                        scope.source = menuSerivce.getPages(isVip);
                    }
                    //sidebar-nav
                }
            };
        }
    ])
    .directive('menuItem', ['$http', '$compile', '$state', 'menuSerivce',
        function($http, $compile, $state, menuSerivce) {
            return {
                restrict: "EA",
                replace: true,
                require: 'ngModel',
                scope: {
                    ngModel: '=',
                    childName: '@'
                },
                template: '<li ng-class="{\'list-toggle\':!!ngModel.toggle,active:ngModel.actived,\'list-group-item\':!ngModel.leaf}"  ng-click="itemSelect($event)">' + '<a href="javascript:void(0);" ng-if="!ngModel.toggle" ><i ng-if="!!ngModel.icon" class="{{ngModel.icon}}"></i> {{ngModel.name}}</a>' + '<a href="javascript:void(0);" data-toggle="collapse" data-parent="#sidebar-nav" ' + 'data-target="#collapse-{{ngModel.key}}" class="collapsed" aria-expanded="false"' + ' ng-if="!!ngModel.toggle"><i ng-if="!!ngModel.icon" class="{{ngModel.icon}}"></i> {{ngModel.name}}</a>' + '</li>',
                link: function(scope, element, attrs) {
                    var childName = scope.childName || scope.$parent.childName,
                        childData = scope.ngModel[childName];

                    if (scope.ngModel.visible !== false && angular.isArray(childData)) {
                        element.append('<umi-menu source="ngModel.' + childName + '" nested-inner="true" ' + (scope.ngModel.toggle ? 'key="collapse-' + scope.ngModel.key + '" cls="collapse" ' : '') + '></umi-menu>');
                        $compile(element.contents())(scope);
                    }


                    scope.itemSelect = function($event) {
                        if (!!scope.ngModel.route) {
                          if (!!scope.ngModel.stateParams) {
                            $state.go(scope.ngModel.route, scope.ngModel.stateParams);
                          } else {
                            $state.go(scope.ngModel.route);
                          }
                          // if (scope.ngModel.name === '使用流程') {
                          //   var url = $state.href(scope.ngModel.route);
                          //   window.open(url, '_blank');
                          // } else {
                          // }
                        }
                        menuSerivce.changState(scope.ngModel);
                        if (!scope.ngModel.toggle) {
                            $event.stopPropagation && $event.stopPropagation();
                            return false;
                        }
                    }
                }
            }
        }
    ])
    .service('menuSerivce', ['$http', '$filter',
        function($http, $filter) {
            var self = this,
                dataItem;
            self.getPages = function(isVip) {
                //isVip = true; //test

                var data = [{
                    key: 'home',
                    icon: 'fa fa-user',
                    name: '用户中心',
                    route: 'customer.myhome',
                    actived: true
                }, {
                    key: 'shipOrder',
                    icon: 'fa fa-list',
                    name: !!isVip ? '海淘管理' : '运单管理',
                    toggle: true,
                    childs: [{
                        leaf: true, //叶子节点（有父节点）
                        key: 'cargoForecast',
                        name: '货物预报',
                        icon: 'fa fa-clock-o',
                        route: 'customer.shippingnotice'
                    }, {
                        leaf: true,
                        key: 'forecastInfo',
                        name: '预报信息',
                        icon: 'fa fa-compass',
                        route: 'customer.shippingnoticelist'
                    }, {
                        leaf: true,
                        key: 'orders',
                        name: '我的订单',
                        icon: 'fa fa-shopping-cart',
                        route: 'customer.myorders'
                    }]
                }, {
                    key: 'productManage',
                    name: '商品管理',
                    toggle: true,
                    visible: isVip,
                    childs: [{
                        leaf: true, //叶子节点（有父节点）
                        key: 'products',
                        name: '商品列表',
                        icon: 'fa fa-cubes',
                        route: 'customer.products'
                    }, {
                        leaf: true, //叶子节点（有父节点）
                        key: 'sendStock',
                        name: '寄送库存',
                        icon: 'fa fa-arrow-circle-right',
                        route: 'customer.sendiedit'
                    }, {
                        leaf: true, //叶子节点（有父节点）
                        key: 'inventories',
                        name: '库存寄件列表',
                        icon: 'fa fa-list',
                        route: 'customer.sendinventory'
                    }]

                }, {
                    key: 'orderManage',
                    name: '订单管理',
                    toggle: true,
                    visible: isVip,
                    childs: [{
                        leaf: true, //叶子节点（有父节点）
                        key: 'newOrder',
                        name: '创建订单',
                        icon: 'fa fa-plus-square',
                        route: 'customer.neworder'
                    }, {
                        leaf: true, //叶子节点（有父节点）
                        key: 'orders',
                        name: '订单查询',
                        icon: 'fa fa-list-ol',
                        route: 'customer.orders'
                    }, {
                        leaf: true, //叶子节点（有父节点）
                        key: 'printOrders',
                        name: '订单打印',
                        icon: 'fa fa-print',
                        route: 'customer.printorders'
                    }]

                }, {
                    key: 'financeManage',
                    icon: 'fa fa-credit-card',
                    name: '财务管理',
                    toggle: true,
                    childs: [{
                        leaf: true, //叶子节点（有父节点）
                        key: 'balance',
                        name: '我的余额',
                        icon: 'fa fa-yen',
                        route: 'customer.myfinance'
                    }, {
                        leaf: true, //叶子节点（有父节点）
                        visible: isVip,
                        key: 'reports',
                        name: '结算报表',
                        icon: 'fa fa-list',
                        route: 'customer.billingreport'
                    }]

                }, {
                    key: 'setting',
                    icon: 'fa fa-cogs',
                    name: '个人设置',
                    toggle: true,
                    childs: [{
                        leaf: true,
                        key: 'questions',
                        name: '我的信息',
                        icon: 'fa fa-list-alt',
                        route: 'customer.myaccount',
                        stateParams: {anchorid:'profile'}
                    }, {
                        leaf: true,
                        key: 'passwordTab',
                        name: '修改密码',
                        icon: 'fa fa-lock',
                        route: 'customer.myaccount',
                        stateParams: {anchorid:'passwordTab'}
                    }, {
                        leaf: true,
                        key: 'addressbook',
                        name: '收货地址',
                        icon: 'fa fa-map-marker',
                        route: 'customer.myaccount',
                        stateParams: {anchorid:'addressbook'}
                    }]
                }, {
                    key: 'help',
                    name: '帮助中心',
                    icon: 'fa fa-question-circle',
                    toggle: true,
                    childs: [{
                        leaf: true,
                        key: 'questions',
                        name: '我的问题',
                        icon: 'fa fa-clock-o',
                        route: 'customer.myquestions'
                    },
                    // {
                    //     leaf: true,
                    //     key: 'charges',
                    //     name: '资费标准',
                    //     icon: 'fa fa-yen',
                    //     route: 'pricing'
                    // },
                    {
                        leaf: true,
                        key: 'manual',
                        name: '使用流程',
                        icon: 'fa fa-graduation-cap',
                        route: 'howtouse',
                        target: '_blank'
                    },{
                        leaf: true,
                        key: 'askquestion',
                        name: '在线咨询',
                        icon: 'fa fa-comment',
                        route: 'customer.askquestion'
                    },{
                        leaf: true,
                        key: 'refer-a-friend',
                        name: '好友邀请',
                        icon: 'fa fa-gift',
                        route: 'refer-a-friend'
                    }]
                }];
                //为了方便实现，这里直接设置数组的第一个元素为默认选中元素
                prevSelected = data[0];
                return data;
            }

            var prevSelected;
            self.changState = function(item) {
                if (!!prevSelected) prevSelected.actived = false;
                if (!item.toggle) {
                    item.actived = true;
                    prevSelected = item;
                } else {
                    item.actived = !item.actived;
                }
            }

        }
    ]);
