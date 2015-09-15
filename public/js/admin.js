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

var WholePage = Vue.extend({
    template: require('./views/admin/template.html'),
    data: function data() {
        return {
            logged: {
                name: '',
                avatar: ''
            }
        };
    },
    methods: {
        doLogout: function doLogout() {
            var self = this;
            $.ajax({
                url: '/api/1.0/auth/signout',
                method: 'GET',
                beforeSend: function beforeSend(xhr) {
                    xhr.setRequestHeader("Authorization", Cookies.get('AdminAuth'));
                }
            }).always(function () {
                localStorage.removeItem('AdminAuth');
                localStorage.removeItem('AdminRemember');
                localStorage.removeItem('AdminAvatar');
                localStorage.removeItem('AdminName');
                Cookies.expire('AdminAuth');
                self.$route.router.go({ name: 'login' });
            });
        }
    },
    compiled: function compiled() {
        this.logged.name = localStorage.getItem('AdminName');
        this.logged.avatar = localStorage.getItem('AdminAvatar');
    }
});

// Admin Dashboard
//var DashMixin = require('./views/admin-dashboard');
var Dashboard = Vue.extend({
    //mixins: [DashMixin]
    template: '<div class="row">' + '<div class="col-lg-12">' + '<h1 class="page-header">' + 'Dashboard <small>Overview</small>' + '</h1>' + '</div>' + '</div>'
});
// Story Features
//var StoryListMixin = require('./views/admin-stories');
var Stories = Vue.extend({
    //mixins: [StoryListMixin]
    template: '<div class="foo">' + '<h2>This is Stories!</h2>' + '</div>'
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

var Categories = Vue.extend({
    //mixins: [StoryEditMixin]
    template: '<div class="foo">' + '<h2>This is Categories!</h2>' + '</div>'
});

var Users = Vue.extend({
    //mixins: [StoryEditMixin]
    template: '<div class="foo">' + '<h2>This is Categories!</h2>' + '</div>'
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
        component: WholePage,
        subRoutes: {
            '/dashboard': {
                name: 'dashboard',
                component: Dashboard,
                auth: true
            },
            '/stories': {
                name: 'storyList',
                component: Stories,
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

            '/categories': {
                name: 'categories',
                component: Categories,
                auth: true
            },

            '/translator/translations': {
                name: 'translations',
                component: {
                    template: 'Translations'
                },
                auth: true
            },

            '/translator/languages': {
                name: 'languages',
                component: {
                    template: 'Languages'
                },
                auth: true
            },

            '/users': {
                name: 'users',
                component: Users,
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
    var auth = Cookies.get('AdminAuth');
    var remember = localStorage.getItem('AdminRemember');
    if (remember == 1) {
        auth = localStorage.getItem('AdminAuth');
    }
    if (transition.to.auth) {
        if (auth) {
            if (remember == 0) {
                $.ajax({
                    url: '/api/1.0/auth/refresh',
                    method: 'GET',
                    beforeSend: function beforeSend(xhr) {
                        xhr.setRequestHeader("Authorization", auth);
                    }
                }).done(function (data, text, xhr) {
                    var token = xhr.getResponseHeader('Authorization');
                    if (remember == 1) {
                        localStorage.setItem('AdminAuth', token);
                    } else {
                        Cookies.set('AdminAuth', token);
                    }
                    transition.next();
                }).fail(function () {
                    localStorage.removeItem('AdminAuth');
                    localStorage.removeItem('AdminRemember');
                    localStorage.removeItem('AdminAvatar');
                    localStorage.removeItem('AdminName');
                    Cookies.expire('AdminAuth');
                    transition.redirect('/login');
                });
            } else {
                Cookies.set('AdminAuth', auth);
                transition.next();
            }
        } else {
            transition.redirect('/login');
        }
    } else {
        if (transition.to.path == '/login' && auth) {
            transition.redirect('/dashboard');
        } else {
            transition.next();
        }
    }
});
router.start(app, 'body');

},{"./views/admin/login":3,"./views/admin/template.html":4}],2:[function(require,module,exports){
module.exports = '<div class="page-container page-form">\n\n    <div class="form-container">\n\n        <div class="container container-xs-width">\n            <div class="row row-sm-height">\n                <div class="col-sm-12">\n\n                    <a href="index.php" class="text-center">\n                        <img src="/images/logo-brandmark.svg" alt="logo" width="100" class="center-block"/>\n                    </a>\n\n                    <div class="alert alert-danger" role="alert" v-if="hasError">\n                        <div v-repeat="row: errors.values"><i class="fa fa-times"></i> &nbsp; {{ row }}</div>\n                    </div>\n\n                    <div class="row">\n\n                        <div class="col-sm-12">\n                            <div class="form-group form-group-default"\n                                 v-class="has-error: errors.fields.indexOf(\'user\') > -1">\n                                <label>Login</label>\n                                <input type="text" name="user" placeholder="Username or Email Address"\n                                       class="form-control" required="" aria-required="true" v-model="login.user" v-on="keyup: doLogin| key 13">\n                            </div>\n                        </div>\n\n                    </div>\n                    <!--/ .row -->\n\n                    <div class="row">\n\n                        <div class="col-sm-12">\n                            <div class="form-group form-group-default"\n                                 v-class="has-error: errors.fields.indexOf(\'password\') > -1">\n                                <label>Password</label>\n                                <input type="password" name="password" placeholder="Password" class="form-control"\n                                       required="" aria-required="true" v-model="login.password" v-on="keyup: doLogin| key 13">\n                            </div>\n                        </div>\n\n                    </div>\n                    <!--/ .row -->\n\n                    <div class="row">\n                        <div class="col-sm-6">\n\n                            <div class="checkbox ">\n                                <input type="checkbox" id="remember" v-model="login.remember" />\n                                <label for="remember">Keep Me Signed in</label>\n                            </div>\n\n                        </div>\n                        <div class="col-sm-6">\n                            <p class="text-sm-right small"><a v-link="{ path : \'forgotPassword\' }" class="text-info">Lost\n                                Password?</a></p>\n                        </div>\n                    </div>\n                    <!--/ .row -->\n\n                    <button class="btn btn-complete" type="button" v-on="click: doLogin">Login</button>\n\n                </div>\n                <!--/ .col-md-12 -->\n\n            </div>\n            <!--/ .row -->\n\n        </div>\n\n    </div>\n    <!--/ .form-container -->\n</div>';
},{}],3:[function(require,module,exports){
/**
 * Created by lex on 9/14/15.
 */
'use strict';

module.exports = {
    template: require('./login-template.html'),
    data: function data() {
        return {
            login: {
                user: 'footless.hero',
                password: 'password',
                remember: false
            },
            hasError: false,
            errors: {
                fields: [],
                values: []
            }
        };
    },
    methods: {
        doLogin: function doLogin() {
            this.validate();
            if (this.hasError === false) {
                var self = this;
                $.ajax({
                    url: '/api/1.0/auth/signin',
                    method: 'POST',
                    data: self.login
                }).done(function (response) {
                    if (response.code == 200) {
                        var token = 'Bearer ' + response.token;
                        if (self.login.remember == true) {
                            localStorage.setItem('AdminAuth', token);
                        } else {
                            Cookies.set('AdminAuth', token);
                        }
                        var remember = self.login.remember == true ? 1 : 0;
                        localStorage.setItem('AdminRemember', remember);
                        localStorage.setItem('AdminName', response.data.first_name + ' ' + response.data.last_name);
                        localStorage.setItem('AdminAvatar', response.data.avatar);
                        self.$route.router.go({ name: 'dashboard' });
                    } else {
                        self.hasError = true;
                        self.login.password = '';
                        if ('data' in response) {
                            for (var i in response.data) {
                                self.errors.fields.push(i);
                                self.errors.values.push(response.data[i]);
                            }
                        }
                        if ('text' in response) {
                            self.errors.values.push(response.text);
                        }
                    }
                });
            }
        },
        validate: function validate() {
            this.errors.fields = [];
            this.errors.values = [];
            this.hasError = false;
            if (this.login.user.trim().length == 0) {
                this.hasError = true;
                this.errors.fields.push('user');
                this.errors.values.push('email or username field is required.');
            }
            if (this.login.password.trim().length == 0) {
                this.hasError = true;
                this.errors.fields.push('password');
                this.errors.values.push('password field is required.');
            }
            if (this.hasError) {
                this.login.password = '';
            }
        }

    }

};

},{"./login-template.html":2}],4:[function(require,module,exports){
module.exports = '<div id="wrapper">\n\n    <!-- Navigation -->\n    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">\n        <!-- Brand and toggle get grouped for better mobile display -->\n        <div class="navbar-header">\n            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">\n                <span class="sr-only">Toggle navigation</span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n            </button>\n            <a href="/" class="navbar-brand">\n                <img src="/images/logo-brandmark-light.svg" class="logo-brandmark logo-icon"\n                     alt="Bridal Gallery" width="50"/>\n                <img src="/images/logo-wordmark-light.png" class="logo-wordmark logo-icon hidden-xs hidden-sm"\n                     alt="Bridal Gallery" width="215"/>\n            </a>\n        </div>\n        <!-- Top Menu Items -->\n        <ul class="nav navbar-right top-nav">\n            <li class="dropdown">\n                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-envelope"></i> <b\n                        class="caret"></b></a>\n                <ul class="dropdown-menu message-dropdown">\n                    <li class="message-preview">\n                        <a href="#">\n                            <div class="media">\n                                    <span class="pull-left">\n                                        <img class="media-object" src="http://placehold.it/50x50" alt="">\n                                    </span>\n\n                                <div class="media-body">\n                                    <h5 class="media-heading"><strong>John Smith</strong>\n                                    </h5>\n\n                                    <p class="small text-muted"><i class="fa fa-clock-o"></i> Yesterday at 4:32 PM</p>\n\n                                    <p>Lorem ipsum dolor sit amet, consectetur...</p>\n                                </div>\n                            </div>\n                        </a>\n                    </li>\n                    <li class="message-preview">\n                        <a href="#">\n                            <div class="media">\n                                    <span class="pull-left">\n                                        <img class="media-object" src="http://placehold.it/50x50" alt="">\n                                    </span>\n\n                                <div class="media-body">\n                                    <h5 class="media-heading"><strong>John Smith</strong>\n                                    </h5>\n\n                                    <p class="small text-muted"><i class="fa fa-clock-o"></i> Yesterday at 4:32 PM</p>\n\n                                    <p>Lorem ipsum dolor sit amet, consectetur...</p>\n                                </div>\n                            </div>\n                        </a>\n                    </li>\n                    <li class="message-preview">\n                        <a href="#">\n                            <div class="media">\n                                    <span class="pull-left">\n                                        <img class="media-object" src="http://placehold.it/50x50" alt="">\n                                    </span>\n\n                                <div class="media-body">\n                                    <h5 class="media-heading"><strong>John Smith</strong>\n                                    </h5>\n\n                                    <p class="small text-muted"><i class="fa fa-clock-o"></i> Yesterday at 4:32 PM</p>\n\n                                    <p>Lorem ipsum dolor sit amet, consectetur...</p>\n                                </div>\n                            </div>\n                        </a>\n                    </li>\n                    <li class="message-footer">\n                        <a href="#">Read All New Messages</a>\n                    </li>\n                </ul>\n            </li>\n            <li class="dropdown">\n                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-bell"></i> <b\n                        class="caret"></b></a>\n                <ul class="dropdown-menu alert-dropdown">\n                    <li>\n                        <a href="#">Alert Name <span class="label label-default">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-primary">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-success">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-info">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-warning">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-danger">Alert Badge</span></a>\n                    </li>\n                    <li class="divider"></li>\n                    <li>\n                        <a href="#">View All</a>\n                    </li>\n                </ul>\n            </li>\n            <li class="dropdown">\n                <a href="#" class="dropdown-toggle text-center" data-toggle="dropdown" role="button"\n                   aria-haspopup="true" aria-expanded="false" title="Megan Simpsons">\n                    <span class="avatar-name hidden-xs">{{ logged.name }}</span>\n                    &nbsp;\n                    <img v-attr="src: logged.avatar" class="avatar-thumb" width="18" height="18"\n                         v-attr="title: logged.name "/>\n                </a>\n                <ul class="dropdown-menu">\n                    <li>\n                        <a href="#"><i class="fa fa-fw fa-user"></i> Profile</a>\n                    </li>\n                    <li>\n                        <a href="#"><i class="fa fa-fw fa-envelope"></i> Inbox</a>\n                    </li>\n                    <li>\n                        <a href="#"><i class="fa fa-fw fa-gear"></i> Settings</a>\n                    </li>\n                    <li class="divider"></li>\n                    <li>\n                        <a href="javascript:void(0);" v-on="click: doLogout"><i class="fa fa-fw fa-power-off"></i> Log Out</a>\n                    </li>\n                </ul>\n            </li>\n        </ul>\n        <!-- Sidebar Menu Items - These collapse to the responsive navigation menu on small screens -->\n        <div class="collapse navbar-collapse navbar-ex1-collapse">\n            <ul class="nav navbar-nav side-nav">\n                <li v-class="active: $route.path == \'/dashboard\'">\n                    <a v-link="{ name: \'dashboard\' }"><i class="fa fa-fw fa-dashboard"></i> Dashboard</a>\n                </li>\n                <li>\n                    <a href="javascript:void(0);" data-toggle="collapse" data-target="#stories"><i\n                            class="fa fa-fw fa-thumb-tack"></i> Stories <i class="fa fa-fw fa-caret-down"></i></a>\n                    <ul id="stories" class="collapse">\n                        <li v-class="active : $route.path == \'/stories\'">\n                            <a v-link="{ name: \'storyList\' }">All Stories</a>\n                        </li>\n                        <li v-class="active : $route.path == \'/story/new\'">\n                            <a v-link="{ name: \'storyNew\' }">New Story</a>\n                        </li>\n                        <li v-class="active : $route.path == \'/story/tags\'">\n                            <a v-link="{ name: \'storyTags\' }">Story Tags</a>\n                        </li>\n                    </ul>\n                </li>\n                <li v-class="active : $route.path == \'/categories\'">\n                    <a v-link="{ name: \'categories\' }"><i class="fa fa-fw fa-filter"></i> Categories</a>\n                </li>\n                <li>\n                    <a href="javascript:void(0);" data-toggle="collapse" data-target="#translator"><i\n                            class="fa fa-fw fa-pencil"></i> Translator <i class="fa fa-fw fa-caret-down"></i></a>\n                    <ul id="translator" class="collapse">\n                        <li v-class="active : $route.path == \'/translator/translations\'">\n                            <a v-link="{ name: \'translations\' }">Translations</a>\n                        </li>\n                        <li v-class="active : $route.path == \'/translator/languages\'">\n                            <a v-link="{ name: \'languages\' }">Languages</a>\n                        </li>\n                    </ul>\n                </li>\n                <li v-class="active : $route.router.name == \'users\'">\n                    <a v-link="{ name: \'users\' }"><i class="fa fa-fw fa-filter"></i> Users</a>\n                </li>\n            </ul>\n        </div>\n        <!-- /.navbar-collapse -->\n    </nav>\n\n    <div id="page-wrapper">\n\n        <div class="container-fluid">\n            <router-view></router-view>\n\n        </div>\n        <!-- /.container-fluid -->\n\n    </div>\n    <!-- /#page-wrapper -->\n\n</div>\n<!-- /#wrapper -->';
},{}]},{},[1]);
