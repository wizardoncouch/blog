(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by lex on 9/10/15.
 */

'use strict';

var app = Vue.extend({});

var LoginMixin = require('./views/admin/login');
var Login = Vue.extend({
    mixins: [LoginMixin]
});

// Admin Dashboard
//var DashMixin = require('./views/admin-dashboard');
var Dashboard = Vue.extend({
    //mixins: [DashMixin]
    template: '<div class="row">' + '<div class="col-lg-12">' + '<h1 class="page-header">' + 'Dashboard <small>Overview</small>' + '</h1>' + '</div>' + '</div>'
});
// Story Features
//var StoryListMixin = require('./views/admin-stories');
var StoryList = Vue.extend({
    //mixins: [StoryListMixin]
    template: '<div class="foo">' + '<h2>This is Story List!</h2>' + '</div>'
});

//var StoryEditMixin = require('./views/admin-story-edit');
var StoryEdit = Vue.extend({
    //mixins: [StoryEditMixin]
    template: '<div class="foo">' + '<h2>This is Story Edit!</h2>' + '</div>'
});

var StoryTags = Vue.extend({
    //mixins: [StoryEditMixin]
    template: '<div class="foo">' + '<h2>This is Story Tags!</h2>' + '</div>'
});

var UsersList = Vue.extend({
    //mixins: [StoryEditMixin]
    template: '<div class="foo">' + '<h2>This is Users List!</h2>' + '</div>'
});

// Admin Router
var router = new VueRouter({
    history: true,
    saveScrollPosition: true,
    root: '/admin'
});
router.redirect({
    '/': '/dashboard',
    '/story': '/stories',
    '/translator': '/translator/translations'
});

// Router Map
router.map({
    '/': {
        component: {
            template: require('./views/admin/template.html')
        },
        subRoutes: {
            '/dashboard': {
                name: 'dashboard',
                component: Dashboard,
                auth: true
            },
            '/stories': {
                name: 'storyList',
                component: StoryList,
                auth: true
            },
            '/story/edit/:id': {
                name: 'storyEdit',
                component: StoryEdit,
                auth: true
            },
            '/story/new': {
                name: 'storyNew',
                component: StoryEdit,
                auth: true
            },
            '/story/tags': {
                name: 'storyTags',
                component: StoryTags,
                auth: true
            },

            '/users': {
                name: 'users',
                component: UsersList,
                auth: true
            }
        }
    },
    '/login': {
        name: 'login',
        component: Login
    }
});
router.beforeEach(function (transition) {
    if (transition.to.auth) {
        // check authentication...
        var auth = Cookies.get('AdminAuth');
        if (auth) {
            transition.next();
        } else {
            transition.redirect('/login');
        }
    } else {
        transition.next();
    }
});
router.start(app, 'body');

},{"./views/admin/login":3,"./views/admin/template.html":4}],2:[function(require,module,exports){
module.exports = '<div class="page-container page-form">\n\n    <div class="form-container">\n\n        <div class="container container-xs-width">\n            <div class="row row-sm-height">\n                <div class="col-sm-12">\n\n                    <a href="index.php" class="text-center">\n                        <img src="/images/logo-brandmark.svg" alt="logo" width="100" class="center-block"/>\n                    </a>\n\n                    <form id="form-login" role="form" class="mg-20-t" action="index.html" novalidate="novalidate">\n\n                        <div class="row">\n\n                            <div class="col-sm-12">\n                                <div class="form-group form-group-default">\n                                    <label>Login</label>\n                                    <input type="text" name="username_or_email" placeholder="Username or Email Address"\n                                           class="form-control" required="" aria-required="true">\n                                </div>\n                            </div>\n\n                        </div>\n                        <!--/ .row -->\n\n                        <div class="row">\n\n                            <div class="col-sm-12">\n                                <div class="form-group form-group-default">\n                                    <label>Password</label>\n                                    <input type="text" name="pass" placeholder="Credentials" class="form-control"\n                                           required="" aria-required="true">\n                                </div>\n                            </div>\n\n                        </div>\n                        <!--/ .row -->\n\n                        <div class="row">\n                            <div class="col-sm-6">\n\n                                <div class="checkbox ">\n                                    <input type="checkbox" value="1" id="checkbox1">\n                                    <label for="checkbox1">Keep Me Signed in</label>\n                                </div>\n\n                            </div>\n                            <div class="col-sm-6">\n                                <p class="text-sm-right small"><a href="form-lost-password.php" class="text-info">Lost\n                                    Password?</a></p>\n                            </div>\n                        </div>\n                        <!--/ .row -->\n\n                        <button class="btn btn-complete" type="submit">Continue</button>\n                    </form>\n\n                </div>\n                <!--/ .col-md-12 -->\n\n            </div>\n            <!--/ .row -->\n\n        </div>\n\n    </div>\n    <!--/ .form-container -->\n</div>';
},{}],3:[function(require,module,exports){
/**
 * Created by lex on 9/14/15.
 */
'use strict';

module.exports = {
  template: require('./login-template.html')
};

},{"./login-template.html":2}],4:[function(require,module,exports){
module.exports = '<div id="wrapper">\n\n    <!-- Navigation -->\n    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">\n        <!-- Brand and toggle get grouped for better mobile display -->\n        <div class="navbar-header">\n            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">\n                <span class="sr-only">Toggle navigation</span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n            </button>\n            <a href="/" class="navbar-brand">\n                <img src="/images/logo-brandmark-light.svg" class="logo-brandmark logo-icon"\n                     alt="Bridal Gallery" width="50"/>\n                <img src="/images/logo-wordmark-light.png" class="logo-wordmark logo-icon hidden-xs hidden-sm"\n                     alt="Bridal Gallery" width="215"/>\n            </a>\n        </div>\n        <!-- Top Menu Items -->\n        <ul class="nav navbar-right top-nav">\n            <li class="dropdown">\n                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-envelope"></i> <b\n                        class="caret"></b></a>\n                <ul class="dropdown-menu message-dropdown">\n                    <li class="message-preview">\n                        <a href="#">\n                            <div class="media">\n                                    <span class="pull-left">\n                                        <img class="media-object" src="http://placehold.it/50x50" alt="">\n                                    </span>\n\n                                <div class="media-body">\n                                    <h5 class="media-heading"><strong>John Smith</strong>\n                                    </h5>\n\n                                    <p class="small text-muted"><i class="fa fa-clock-o"></i> Yesterday at 4:32 PM</p>\n\n                                    <p>Lorem ipsum dolor sit amet, consectetur...</p>\n                                </div>\n                            </div>\n                        </a>\n                    </li>\n                    <li class="message-preview">\n                        <a href="#">\n                            <div class="media">\n                                    <span class="pull-left">\n                                        <img class="media-object" src="http://placehold.it/50x50" alt="">\n                                    </span>\n\n                                <div class="media-body">\n                                    <h5 class="media-heading"><strong>John Smith</strong>\n                                    </h5>\n\n                                    <p class="small text-muted"><i class="fa fa-clock-o"></i> Yesterday at 4:32 PM</p>\n\n                                    <p>Lorem ipsum dolor sit amet, consectetur...</p>\n                                </div>\n                            </div>\n                        </a>\n                    </li>\n                    <li class="message-preview">\n                        <a href="#">\n                            <div class="media">\n                                    <span class="pull-left">\n                                        <img class="media-object" src="http://placehold.it/50x50" alt="">\n                                    </span>\n\n                                <div class="media-body">\n                                    <h5 class="media-heading"><strong>John Smith</strong>\n                                    </h5>\n\n                                    <p class="small text-muted"><i class="fa fa-clock-o"></i> Yesterday at 4:32 PM</p>\n\n                                    <p>Lorem ipsum dolor sit amet, consectetur...</p>\n                                </div>\n                            </div>\n                        </a>\n                    </li>\n                    <li class="message-footer">\n                        <a href="#">Read All New Messages</a>\n                    </li>\n                </ul>\n            </li>\n            <li class="dropdown">\n                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-bell"></i> <b\n                        class="caret"></b></a>\n                <ul class="dropdown-menu alert-dropdown">\n                    <li>\n                        <a href="#">Alert Name <span class="label label-default">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-primary">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-success">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-info">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-warning">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-danger">Alert Badge</span></a>\n                    </li>\n                    <li class="divider"></li>\n                    <li>\n                        <a href="#">View All</a>\n                    </li>\n                </ul>\n            </li>\n            <li class="dropdown">\n                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-user"></i> John Smith <b\n                        class="caret"></b></a>\n                <ul class="dropdown-menu">\n                    <li>\n                        <a href="#"><i class="fa fa-fw fa-user"></i> Profile</a>\n                    </li>\n                    <li>\n                        <a href="#"><i class="fa fa-fw fa-envelope"></i> Inbox</a>\n                    </li>\n                    <li>\n                        <a href="#"><i class="fa fa-fw fa-gear"></i> Settings</a>\n                    </li>\n                    <li class="divider"></li>\n                    <li>\n                        <a href="#"><i class="fa fa-fw fa-power-off"></i> Log Out</a>\n                    </li>\n                </ul>\n            </li>\n        </ul>\n        <!-- Sidebar Menu Items - These collapse to the responsive navigation menu on small screens -->\n        <div class="collapse navbar-collapse navbar-ex1-collapse">\n            <ul class="nav navbar-nav side-nav">\n                <li>\n                    <a v-link="{ name: \'dashboard\' }"><i class="fa fa-fw fa-dashboard"></i> Dashboard</a>\n                </li>\n                <li v-class="active: $route.path.indexOf(\'story\') > 0">\n                    <a href="javascript:void(0);" data-toggle="collapse" data-target="#stories"><i\n                            class="fa fa-fw fa-thumb-tack"></i> Stories <i class="fa fa-fw fa-caret-down"></i></a>\n                    <ul id="stories" class="collapse">\n                        <li>\n                            <a v-link="{ name: \'storyList\' }">All Stories</a>\n                        </li>\n                        <li>\n                            <a v-link="{ name: \'storyNew\' }">New Story</a>\n                        </li>\n                        <li>\n                            <a v-link="{ name: \'storyTags\' }">Story Tags</a>\n                        </li>\n                    </ul>\n                </li>\n                <li v-class="active: $route.path == \'categories\'">\n                    <a v-link="{ path: \'/categories\' }"><i class="fa fa-fw fa-filter"></i> Categories</a>\n                </li>\n                <li v-class="active: $route.path.indexOf(\'translator\') > 0">\n                    <a v-link="{ path: \'/translator\' }" data-toggle="collapse" data-target="#translator"><i\n                            class="fa fa-fw fa-pencil"></i> Translator <i class="fa fa-fw fa-caret-down"></i></a>\n                    <ul id="translator" class="collapse">\n                        <li>\n                            <a v-link="{ path: \'/translator/translations\' }">Translations</a>\n                        </li>\n                        <li>\n                            <a v-link="{ path: \'/translator/languages\' }">Languages</a>\n                        </li>\n                    </ul>\n                </li>\n                <li v-class="active: $route.path == \'users\'">\n                    <a v-link="{ path: \'/users\' }"><i class="fa fa-fw fa-filter"></i> Users</a>\n                </li>\n            </ul>\n        </div>\n        <!-- /.navbar-collapse -->\n    </nav>\n\n    <div id="page-wrapper">\n\n        <div class="container-fluid">\n            <router-view></router-view>\n\n        </div>\n        <!-- /.container-fluid -->\n\n    </div>\n    <!-- /#page-wrapper -->\n\n</div>\n<!-- /#wrapper -->';
},{}]},{},[1]);
