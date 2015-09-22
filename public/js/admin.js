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

},{"./views/admin/login":3,"./views/admin/stories":5,"./views/admin/story":7,"./views/admin/template.html":8}],2:[function(require,module,exports){
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
module.exports = '<h2>\n    <span>Stories</span>\n    <a v-link="{ name : \'storyNew\' }" class="add-btn">Add New</a>\n</h2>\n\n<ul class="post-meta list-inline">\n    <li><a href="javascript:void(0);">All <span>(3)</span></a></li>\n    <li><a href="javascript:void(0);">Published <span>(3)</span></a></li>\n    <li><a href="javascript:void(0);" class="overlay-success">Featured <span>(3)</span></a></li>\n    <li><a href="javascript:void(0);" class="overlay-warning">Drafts <span>(3)</span></a></li>\n    <li><a href="javascript:void(0);" class="overlay-danger">Trash <span>(3)</span></a></li>\n</ul>\n\n<div class="form-inline">\n    <input class="form-control" placeholder="Search"/>\n\n    <select class="form-control">\n        <option>All Dates</option>\n        <option>August 2015</option>\n        <option>July 2015</option>\n    </select>\n</div>\n\n<div class="form-group">\n    <table id="table-post-list" class="table table-striped" data-sortable>\n        <thead>\n        <tr>\n            <th data-sortable="true">Title</th>\n            <th data-sortable="true" class="hidden-xs">Author</th>\n            <th data-sortable="true" class="hidden-xs">Date</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr v-repeat="row: stories">\n            <td class="post-title" data-value="Wedding of the Day">\n                <a v-link="{ name: \'storyEdit\', params: { id: row.id } }" class="title">\n                    {{row.title}} <i class="fa fa-star overlay-success" title="Featured"></i>\n                </a>\n\n                <div class="row-actions">\n                    <ul class="list-inline">\n                        <li>\n                            <a v-link="{ name: \'storyEdit\', params: { id: row.id } }"><i\n                                    class="fa fa-pencil"></i></a>\n                        </li>\n                        <li>\n                            <a href="/story/{{ row.id }}/{{ row.uri_title }}" class="overlay-link"><i\n                                    class="fa fa-eye"></i></a>\n                        </li>\n                        <li v-if="row.status != \'trashed\'">\n                            <a href="javascript:void(0)" class="overlay-danger"><i class="fa fa-trash"\n                                                                                   title="Delete entry"></i></a>\n                        </li>\n                    </ul>\n                    <ul class="visible-xs">\n                        <li>\n                            <i class="fa fa-fw fa-info-circle"></i> Status:\n                                    <span class="label" v-if="row.status.length > 0"\n                                          v-class=" label-warning: row.status == \'draft\' || row.status == \'new\',\n                                                    label-primary: row.status == \'published\',\n                                                    label-danger: row.status == \'trashed\'">\n                                        <strong>{{ ucword(row.status) }}</strong>\n                                    </span>\n                        </li>\n                        <li>\n                            <i class="fa fa-fw fa-user"></i> Author: <a href="javascript:void(0);"><strong>{{ row.author }}</strong></a>\n                        </li>\n                        <li>\n                            <i class="fa fa-fw fa-calendar"></i> Created at: <strong>{{ row.created}}</strong>\n                        </li>\n                    </ul>\n                </div>\n            </td>\n            <td class="post-date hidden-xs" data-value="{{row.author}}">\n                <a href="javascript:void(0);">{{row.author}}</a>\n            </td>\n            <td class="post-date hidden-xs" data-value="{{row.created_at}}">\n                <div style="display:block;margin-bottom:5px;">{{row.created}}</div>\n\n                <div>\n                    <span class="label" v-if="row.status.length > 0"\n                          v-class="label-warning: row.status == \'draft\' || row.status == \'new\',\n                          label-primary: row.status == \'published\',\n                          label-danger: row.status == \'trashed\'">\n                        <strong>{{ ucword(row.status) }}</strong>\n                    </span>\n                </div>\n            </td>\n        </tr>\n        </tbody>\n    </table>\n</div>';
},{}],5:[function(require,module,exports){
/**
 * Created by lex on 9/15/15.
 */
'use strict';

module.exports = {
    template: require('./stories-template.html'),
    data: function data() {
        return {
            stories: []
        };
    },
    compiled: function compiled() {
        var self = this;
        $.ajax({
            url: '/api/1.0/stories',
            method: 'GET'
        }).done(function (result) {
            self.stories = result.data;
        });
    },
    methods: {
        ucword: function ucword(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
};

},{"./stories-template.html":4}],6:[function(require,module,exports){
module.exports = '<div class="row">\n    <div class="col-sm-8 col-md-9">\n        <h2>\n            <span>{{ $route.params.id > 0 ? \'Edit Story\' : \'Add New Story\' }}</span>\n            <a v-link="{ name : \'storyList\' }" class="cancel-btn">Cancel</a>\n        </h2>\n\n        <div class="alert alert-danger" role="alert" v-if="hasError">\n            <div v-repeat="row: errors.values"><i class="fa fa-times"></i> &nbsp; {{ row }}</div>\n        </div>\n\n        <div class="form-group mg-20-b">\n            <input type="text" name="title" id="post-title" class="form-control input-lg" placeholder="Enter Title Here"\n                   v-model="story.title"/>\n        </div>\n\n        <div class="form-group">\n            <button class="btn btn-sm" data-toggle="modal" data-target="#modal-media" v-on="click:getFiles"><i\n                    class="fa fa-photo"></i> Add\n                Media\n            </button>\n            <textarea id="post-content" class="form-control" rows="10" cols="10" v-model="story.content"></textarea>\n        </div>\n        <div class="panel-group accordion">\n            <div class="panel panel-default">\n                <div class="panel-heading" role="tab">\n                    <h4 class="panel-title">\n                        <a class="text-capitalize pad-10-y" role="button" data-toggle="collapse"\n                           data-parent="#accordion"\n                           href="#additionalInformationCollapse" aria-expanded="true"\n                           aria-controls="additionalInformationCollapse">Additional Information</a>\n                    </h4>\n                </div>\n                <div id="additionalInformationCollapse" class="panel-collapse collapse in" role="tabpanel"\n                     aria-labelledby="headingOne">\n                    <div class="panel-body">\n                        <div class="checkbox mg-20-b">\n                            <input type="checkbox" id="publish-story" v-model="story.published"/>\n                            <label for="publish-story">Published</label>\n                        </div>\n                        <div class="checkbox mg-20-b">\n                            <input type="checkbox" id="story-featured" v-model="story.featured"/>\n                            <label for="story-featured">Featured</label>\n                        </div>\n                        <div class="mg-20-b">\n                            <textarea class="form-control" rows="3" cols="10" v-model="story.excerpt"\n                                      placeholder="Add optional story excerpt or summary."></textarea>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n    </div>\n    <div class="col-sm-4 col-md-3">\n\n\n        <aside id="admin-postbox">\n\n            <div class="panel-group accordion">\n\n                <div class="panel panel-default">\n                    <div class="panel-heading" role="tab" id="headingOne">\n                        <h4 class="panel-title">\n                            <a class="text-capitalize pad-10-y" role="button" data-toggle="collapse"\n                               data-parent="#accordion" href="#collapsePublish" aria-expanded="true"\n                               aria-controls="collapsePublish">Details</a>\n                        </h4>\n                    </div>\n                    <div id="collapsePublish" class="panel-collapse collapse in" role="tabpanel"\n                         aria-labelledby="headingOne">\n                        <div class="panel-body">\n                            <ul class="list-menu">\n                                <li>\n                                    <i class="fa fa-fw fa-info-circle"></i> Status:\n                                    <span class="label" v-if="story.status.length > 0"\n                                          v-class=" label-warning: story.status == \'draft\' || story.status == \'new\',\n                                                    label-primary: story.status == \'published\',\n                                                    label-danger: story.status == \'trashed\'">\n                                        <strong>{{ ucword(story.status) }}</strong>\n                                    </span> &nbsp;\n                                    <span v-if="story.featured == 1"\n                                          class="label label-success"><strong>Featured</strong></span>\n                                </li>\n                                <li>\n                                    <i class="fa fa-fw fa-user"></i> Author: <strong>{{ story.author }}</strong>\n                                </li>\n                                <li>\n                                    <i class="fa fa-fw fa-calendar"></i> Created at: <strong>{{ story.created\n                                    }}</strong>\n                                </li>\n                            </ul>\n                        </div>\n\n                    </div>\n                </div>\n                <!--/ .panel -->\n                <div class="panel panel-default">\n                    <div class="panel-heading" role="tab" id="headingCategory">\n                        <h4 class="panel-title">\n                            <a class="text-capitalize pad-10-y" role="button" data-toggle="collapse"\n                               data-parent="#accordion" href="#collapseCategory" aria-expanded="true"\n                               aria-controls="collapseCategory">Category</a>\n                        </h4>\n                    </div>\n                    <div id="collapseCategory" class="panel-collapse collapse in" role="tabpanel"\n                         aria-labelledby="headingCategory">\n                        <div class="panel-body">\n                            <select data-placeholder="Select Category" v-model="story.category_id" options="categories"\n                                    v-chosen="category: categories"></select>\n                        </div>\n                    </div>\n                </div>\n\n                <div class="panel panel-default">\n                    <div class="panel-heading" role="tab" id="headingKeywords">\n                        <h4 class="panel-title">\n                            <a class="text-capitalize pad-10-y" role="button" data-toggle="collapse"\n                               data-parent="#accordion" href="#collapseKeywords" aria-expanded="true"\n                               aria-controls="collapseCategories">Keywords</a>\n                        </h4>\n                    </div>\n                    <div id="collapseKeywords" class="panel-collapse collapse in" role="tabpanel"\n                         aria-labelledby="headingKeywords">\n                        <div class="panel-body">\n                            <select data-placeholder="Select Keywords" multiple v-model="story.keywords"\n                                    options="keywords"\n                                    v-chosen="keyword: keywords"></select>\n                        </div>\n                    </div>\n                </div>\n                <!--/ .panel -->\n\n                <div class="panel panel-default">\n                    <div class="panel-heading" role="tab" id="headingThree">\n                        <h4 class="panel-title">\n                            <a class="text-capitalize pad-10-y" role="button" data-toggle="collapse"\n                               data-parent="#accordion" href="#collapseFeaturedImage" aria-expanded="true"\n                               aria-controls="collapseFeaturedImage">Default Image</a>\n                        </h4>\n                    </div>\n                    <div id="collapseFeaturedImage" class="panel-collapse collapse in" role="tabpanel"\n                         aria-labelledby="headingThree">\n                        <div class="panel-body">\n                            <div class="open-modal-media" v-if="story.default_image.length == 0">\n                                <button class="btn btn-sm btn-link center-block upload-media-btn" data-toggle="modal"\n                                        data-target="#modal-media">Set Featured Image\n                                </button>\n                            </div>\n\n                            <div class="upload-media-attachment" v-if="story.default_image.length > 0">\n                                <div class="attachment-preview">\n                                    <div class="thumbnail">\n                                        <div class="centered">\n                                            <img v-attr="src: story.default_image" draggable="false" alt="">\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <!--/ .panel -->\n\n                <div class="panel panel-default">\n                    <button class="btn btn-sm btn-primary pull-left" v-on="click: saveStory">Save</button>\n                    <!--<button class="btn btn-sm btn-link pull-right overlay-danger" v-if="story.published == 1"-->\n                    <!--alt="Move to Trash">-->\n                    <!--Move to Trash-->\n                    <!--</button>-->\n                    <button class="btn btn-sm btn-link pull-right overlay-danger">\n                        <i class="fa fa-trash fa-2x"></i>\n                    </button>\n\n                </div>\n                <!--/ .panel -->\n\n            </div>\n\n        </aside>\n\n    </div>\n</div>\n\n<!-- Add to Collection Modal  -->\n<div class="modal fade media-frame" id="modal-media" tabindex="-1" role="dialog" aria-labelledby="modal-media-label">\n    <div class="modal-dialog modal-dialog-full-width" role="document">\n        <div class="modal-content">\n            <div class="modal-header">\n                <button type="button" class="close overlay-dark" data-dismiss="modal" aria-label="Close"><span\n                        aria-hidden="true">×</span></button>\n                <h4 class="modal-title" id="modal-media-label">Insert Media</h4>\n            </div>\n            <div class="modal-body">\n                <div class="row full-height">\n                    <div class="col-sm-8 col-md-9 col-lg-10 full-height dz" id="upload-file-zone">\n                        <div id="upload-file-preview">\n                        </div>\n                        <ul class="menu scrollable clearfix">\n                            <li class="attachment" role="checkbox" v-repeat="row: files | orderBy id reverse"\n                                v-class="selected: selected.files.indexOf($index) > -1,\n                                         active: selected.active != null && selected.active == $index">\n                                <div class="attachment-preview" v-on="click: fileSelect($index)">\n                                    <div class="thumbnail">\n                                        <div class="centered">\n                                            <img v-attr="src: row.thumb" draggable="false" alt="">\n                                        </div>\n                                    </div>\n                                </div>\n                                <a class="check" role="button" title="Deselect" tabindex="0"\n                                   v-on="click: fileDeselect($index)"><i class="icon"></i></a>\n                            </li>\n                        </ul>\n                    </div>\n\n                    <div class="col-sm-4 col-md-3 col-lg-2 full-height hidden-xs" v-if="selected.active != null">\n                        <div class="attachment-details scrollable">\n                            <h4>Media Details</h4>\n\n                            <div class="form-group form-group-default">\n                                <label>Title</label>\n                                <input type="text" class="form-control" placeholder="Title goes here" v-model="files[selected.active].title"/>\n                            </div>\n                            <div class="form-group form-group-default">\n                                <label>Width <small>px</small></label>\n                                <input type="text" class="form-control" placeholder="width in pixels" v-model="files[selected.active].data.width"/>\n                            </div>\n                            <div class="form-group form-group-default">\n                                <label>Height <small>px</small></label>\n                                <input type="text" class="form-control" placeholder="height in pixels" v-model="files[selected.active].data.height"/>\n                            </div>\n                            <div class="checkbox mg-20-b">\n                                <input type="checkbox" id="image-proportion"/>\n                                <label for="image-proportion">Constrain proportion</label>\n                            </div>\n                        </div>\n                    </div>\n\n                </div>\n            </div>\n            <!--/ .modal-body -->\n            <div class="modal-footer">\n                <div class="pull-sm-left">\n                    <button type="button" class="btn btn-primary" id="upload-file-btn">Upload Image</button>\n                </div>\n                <div class="pull-sm-right">\n                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\n                    <button type="button" class="btn btn-complete">Done</button>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<!--/ .modal -->\n';
},{}],7:[function(require,module,exports){
/**
 * Created by lexus on 9/16/15.
 */

'use strict';

module.exports = {
    template: require('./story-template.html'),
    data: function data() {
        return {
            tinymce_container: 'post-content',
            categories: [],
            keywords: [],
            files: [],
            selected: {
                files: [],
                active: null
            },
            story: {
                id: 0,
                category_id: 0,
                title: '',
                content: '',
                published: 0,
                excerpt: '',
                keywords: [],
                default_image: '',
                featured: 0,
                deleted_at: null,
                author: localStorage.getItem('AdminName'),
                created: 'Now',
                status: ''
            },
            uploadFileZone: null,
            hasError: false,
            errors: {
                fields: [],
                values: []
            }
        };
    },
    compiled: function compiled() {
        tinyMCE.execCommand('mceRemoveEditor', true, this.tinymce_container);
    },
    ready: function ready() {
        var token = $('meta[name="csrf-token"]').attr('content');
        var self = this;
        tinyMCE.settings = tinymceConfig['default'];
        tinyMCE.execCommand('mceAddEditor', true, self.tinymce_container);
        if (self.$route.params.id > 0) {
            self.getStory(self.$route.params.id);
        } else {
            self.story.status = 'new';
            self.getCategories();
            self.getKeywords();
        }
        self.uploadFileZone = new Dropzone('div#upload-file-zone', {
            paramName: "file",
            method: 'POST',
            acceptedFiles: 'image/*',
            autoProcessQueue: true,
            uploadMultiple: true,
            url: "/api/1.0/file/create",
            clickable: "#upload-file-btn",
            previewsContainer: '#upload-file-preview',
            maxFilesize: 20480,
            headers: {
                Authorization: Cookies.get('AdminAuth')
            },
            params: {
                _token: token,
                id: 0,
                type: 'story'
            }
        });
        self.uploadFileZone.on("complete", function (file) {
            console.log(file);
            if (file.xhr.code == 200) {
                self.uploadFileZone.removeFile(file);
                self.files.push(file.xhr);
                /* Maybe display some more file information on your page */
            }
        });
    },
    methods: {
        ucword: function ucword(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        getStory: function getStory(id) {
            var self = this;
            $.ajax({
                url: '/api/1.0/story/' + id,
                method: 'GET'
            }).done(function (result) {
                self.story = result.data;
                self.story.keywords = JSON.parse(self.story.keywords);
                var editor = tinyMCE.get(self.tinymce_container);
                if (editor !== null) {
                    editor.setContent(self.story.content);
                }
                self.getCategories();
                self.getKeywords();
            });
        },
        getCategories: function getCategories() {
            var self = this;
            $.ajax({
                url: '/api/1.0/categories',
                method: 'GET',
                data: {
                    filter: 'show'
                }
            }).done(function (result) {
                for (var i in result.data) {
                    self.categories.push({
                        value: result.data[i].id,
                        text: result.data[i].name
                    });
                }
            });
        },
        getKeywords: function getKeywords() {
            var self = this;
            $.ajax({
                url: '/api/1.0/keywords',
                method: 'GET'
            }).done(function (result) {
                for (var i in result.data) {
                    self.keywords.push(result.data[i].keyword);
                }
            });
        },
        getFiles: function getFiles() {
            var self = this;
            $.ajax({
                url: '/api/1.0/files',
                method: 'GET'
            }).done(function (result) {
                self.files = result.data;
            });
        },
        fileSelect: function fileSelect(index) {
            //add selected
            if (this.selected.files.indexOf(index) == -1) {
                this.selected.files.push(index);
            }
            //add active
            this.selected.active = index;
        },
        fileDeselect: function fileDeselect(index) {
            //remove active
            if (this.selected.active == index) {
                this.selected.active = null;
            }
            //remove selected
            var index = this.selected.files.indexOf(index);
            if (index > -1) {
                this.selected.files.splice(index, 1);
            }
        },
        saveStory: function saveStory() {
            this.validate();
            if (this.hasError === false) {
                var self = this;
                var data = {
                    title: self.story.title,
                    content: self.story.content,
                    category_id: self.story.category_id,
                    excerpt: self.story.excerpt,
                    keywords: JSON.stringify(self.story.keywords),
                    default_image: self.story.default_image,
                    published: self.story.published,
                    featured: self.story.featured
                };
                var url = '/api/1.0/story/create';
                if (self.story.id > 0) {
                    data.id = self.story.id;
                    url = '/api/1.0/story/update';
                }
                $.ajax({
                    url: url,
                    method: 'POST',
                    data: data,
                    beforeSend: function beforeSend(xhr) {
                        xhr.setRequestHeader("Authorization", Cookies.get('AdminAuth'));
                    }
                }).done(function (result) {
                    self.files = result.data;
                });
            }
        },
        validate: function validate() {
            this.errors.fields = [];
            this.errors.values = [];
            this.hasError = false;
            if (this.story.title.trim().length == 0) {
                this.hasError = true;
                this.errors.fields.push('title');
                this.errors.values.push('Story title is required.');
            }
        }
    }
};

},{"./story-template.html":6}],8:[function(require,module,exports){
module.exports = '<div class="page-container">\n\n    <!--/ Navigation -->\n    <header class="navbar navbar-admin navbar-fixed-top navbar-inverse fill-dark-menu" id="top" role="banner">\n        <div class="container-fluid">\n            <div class="navbar-header pull-left">\n                <button id="sidebar-toggle" class="navbar-toggle" type="button">\n                    <span class="icon-bar"></span>\n                    <span class="icon-bar"></span>\n                    <span class="icon-bar"></span>\n                </button>\n                <a href="/" class="navbar-brand">\n                    <img src="/images/logo-brandmark-light.svg" class="logo-brandmark logo-icon"\n                         alt="Bridal Gallery" width="50"/>\n                    <img src="/images/logo-wordmark-light.png" class="logo-wordmark logo-icon hidden-xs hidden-sm"\n                         alt="Bridal Gallery" width="215"/>\n                </a>\n            </div>\n\n            <nav id="wp-navbar-offset" class="navbar-offset pull-right">\n\n                <ul class="nav navbar-nav navbar-offset-nav">\n                    <li>\n                    </li>\n                    <li class="dropdown dropdown-profile">\n                        <a href="#" class="dropdown-toggle dropdown-avatar text-center" data-toggle="dropdown"\n                           role="button" aria-haspopup="true" aria-expanded="false" title="Megan Simpsons">\n                            <span class="avatar-name hidden-xs">{{logged.name}}</span><img\n                                v-attr="src: logged.avatar" class="avatar-thumb" width="30" height="30"\n                                v-attr="title: logged.name"/>\n                        </a>\n                        <ul class="dropdown-menu fill-dark-menu">\n                            <li><a href="page-profile.php">Profile</a></li>\n                            <li><a href="admin-profile-settings.php">Settings</a></li>\n                            <li><a href="javascript:void(0);" v-on="click: doLogout">Log Out</a></li>\n                        </ul>\n                    </li>\n                </ul>\n            </nav>\n\n        </div>\n    </header>\n    <div id="admin-content" class="content-area pad-20-y">\n        <main id="main" class="site-main" role="main">\n            <div class="container-fluid">\n                <div class="row">\n                    <div class="col-sm-12">\n                        <div class="post-editor">\n                            <router-view></router-view>\n                        </div>\n                        <!--/ .post-editor -->\n                    </div>\n                </div>\n            </div>\n        </main>\n    </div>\n    <!--/ #admin-content -->\n    <aside id="admin-sidebar">\n        <div class="scrollbarCustom">\n            <ul class="menu">\n\n                <li v-class="active: $route.path == \'/dashboard\'">\n                    <a v-link="{ name: \'dashboard\' }"><i class="fa fa-fw fa-tachometer"></i> <span>Dashboard</span></a>\n                </li>\n                <li class="has-submenu" v-class="active: $route.path.indexOf(\'/stor\') > -1">\n                    <a v-link="{ name: \'storyList\' }"><i class="fa fa-fw fa-book"></i> <span>Stories</span></a>\n\n                    <ul class="sub-menu">\n                        <li v-class="active: $route.path == \'/stories\'"><a\n                                v-link="{ name: \'storyList\' }"><i class="fa fa-fw fa-pencil"></i> <span\n                                class="hidden-xs">All Stories</span></a></li>\n                        <li v-class="active: $route.path == \'/story/tags\'"><a v-link="{ name: \'storyTags\' }"><i\n                                class="fa fa-fw fa-tags"></i> <span class="hidden-xs">Keywords</span></a>\n                        </li>\n                    </ul>\n                </li>\n                <li v-class="active: $route.path == \'/categories\'">\n                    <a v-link="{ name: \'categories\' }"><i class="fa fa-fw fa-share-alt"></i> <span>Categories</span></a>\n                </li>\n                <li class="has-submenu" v-class="active: $route.path.indexOf(\'/translator\') > -1">\n                    <a v-link="{ name: \'translations\' }"><i class="fa fa-fw fa-sort-alpha-asc"></i>\n                        <span>Translator</span></a>\n\n                    <ul class="sub-menu">\n                        <li v-class="active: $route.path == \'/translator/translations\'"><a\n                                v-link="{ name: \'translations\' }"><i class="fa fa-fw fa-random"></i> <span\n                                class="hidden-xs">Translations</span></a></li>\n                        <li v-class="active: $route.path == \'/translator/languages\'"><a\n                                v-link="{ name: \'languages\' }"><i class="fa fa-fw fa-globe"></i> <span\n                                class="hidden-xs">Languages</span></a>\n                        </li>\n                    </ul>\n                </li>\n                <li v-class="active: $route.path == \'/users\'">\n                    <a v-link="{ name: \'users\' }"><i class="fa fa-fw fa-users"></i> <span>Users</span></a>\n                </li>\n            </ul>\n        </div>\n    </aside>\n</div>';
},{}]},{},[1]);
