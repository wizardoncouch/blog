/**
 * Created by lex on 9/10/15.
 */


var app = Vue.extend({});

var LoginMixin = require('./views/admin/login');
var Login = Vue.extend({
    mixins: [LoginMixin]
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
//var StoryListMixin = require('./views/admin-stories');
var StoryList = Vue.extend({
    //mixins: [StoryListMixin]
    template: '<div class="foo">' +
    '<h2>This is Story List!</h2>' +
    '</div>'
});

//var StoryEditMixin = require('./views/admin-story-edit');
var StoryEdit = Vue.extend({
    //mixins: [StoryEditMixin]
    template: '<div class="foo">' +
    '<h2>This is Story Edit!</h2>' +
    '</div>'
});

var StoryTags = Vue.extend({
    //mixins: [StoryEditMixin]
    template: '<div class="foo">' +
    '<h2>This is Story Tags!</h2>' +
    '</div>'
});

var UsersList = Vue.extend({
    //mixins: [StoryEditMixin]
    template: '<div class="foo">' +
    '<h2>This is Users List!</h2>' +
    '</div>'
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
})
router.start(app, 'body');