/**
 * Created by lex on 9/10/15.
 */


var app = Vue.extend({});

var LoginMixin = require('./views/admin/login');
var Login = Vue.extend({
    mixins: [LoginMixin]
});

var WholePage = Vue.extend({
    template: require('./views/admin/template.html'),
    data: function () {
        return {
            logged: {
                name: '',
                avatar: ''
            }
        }
    },
    methods: {
        doLogout: function () {
            var self = this;
            $.ajax({
                url: '/api/1.0/auth/signout',
                method: 'GET',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", Cookies.get('AdminAuth'));
                }
            }).always(function () {
                localStorage.removeItem('AdminAuth');
                localStorage.removeItem('AdminRemember');
                localStorage.removeItem('AdminAvatar');
                localStorage.removeItem('AdminName');
                Cookies.expire('AdminAuth');
                self.$route.router.go({name: 'login'});
            });
        }
    },
    compiled: function () {
        this.logged.name = localStorage.getItem('AdminName');
        this.logged.avatar = localStorage.getItem('AdminAvatar');
    }
});

// Admin Dashboard
//var DashMixin = require('./views/admin-dashboard');
var Dashboard = Vue.extend({
    //mixins: [DashMixin]
    template: '<div class="row">' +
    '<div class="col-lg-12">' +
    '<h1 class="page-header">' +
    'Dashboard <small>Overview</small>' +
    '</h1>' +
    '</div>' +
    '</div>'
});
// Story Features
var StoriesMixin = require('./views/admin/stories');
var Stories = Vue.extend({
    mixins: [StoriesMixin]
});

var EditStoryMixin = require('./views/admin/story');
var EditStory = Vue.extend({
    mixins: [EditStoryMixin]
});

var StoryTags = Vue.extend({
    //mixins: [StoryEditMixin]
    template: '<div class="foo">' +
    '<h2>This is Story Tags!</h2>' +
    '</div>'
});

var Categories = Vue.extend({
    //mixins: [StoryEditMixin]
    template: '<div class="foo">' +
    '<h2>This is Categories!</h2>' +
    '</div>'
});

var Users = Vue.extend({
    //mixins: [StoryEditMixin]
    template: '<div class="foo">' +
    '<h2>This is Categories!</h2>' +
    '</div>'
});

var Settings = Vue.extend({
    //mixins: [StoryEditMixin]
    template: '<div class="foo">' +
    '<h2>This is Admin Settings!</h2>' +
    '</div>'
});

var SettingsMixin = require('./views/admin/settings');
var Settings = Vue.extend({
    mixins: [SettingsMixin]
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
                component: EditStory,
                auth: true
            },
            '/story/new': {
                name: 'storyNew',
                component: EditStory,
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
            },
            '/settings': {
                name: 'adminSettings',
                component: Settings,
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
    if (transition.to.auth) {
        if (auth) {
            if (remember == 0) {
                $.ajax({
                    url: '/api/1.0/auth/refresh',
                    method: 'GET',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", auth);
                    }
                }).done(function (data, text, xhr) {
                    var token = xhr.getResponseHeader('Authorization');
                    Cookies.set('AdminAuth', token);
                    transition.next();
                }).fail(function () {
                    localStorage.removeItem('AdminRemember');
                    localStorage.removeItem('AdminAvatar');
                    localStorage.removeItem('AdminName');
                    Cookies.expire('AdminAuth');
                    transition.redirect('/login');
                });
            } else {
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
})
router.start(app, 'body');