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
module.exports = '<h2 class="page-header">\n    <span>Stories</span>\n    <a v-link="{ name : \'storyNew\' }" class="add-story-h2">Add New</a>\n</h2>\n\n<ul class="post-meta list-inline">\n    <li><a href="javascript:void(0);">All <span>(3)</span></a></li>\n    <li><a href="javascript:void(0);">Published <span>(3)</span></a></li>\n    <li><a href="javascript:void(0);" class="overlay-success">Featured <span>(3)</span></a></li>\n    <li><a href="javascript:void(0);" class="overlay-warning">Drafts <span>(3)</span></a></li>\n    <li><a href="javascript:void(0);" class="overlay-danger">Trash <span>(3)</span></a></li>\n</ul>\n\n<div class="form-inline">\n    <div class="form-group">\n        <input class="form-control" placeholder="Search"/>\n    </div>\n\n    <div class="form-group">\n        <select class="form-control">\n            <option>All Dates</option>\n            <option>August 2015</option>\n            <option>July 2015</option>\n        </select>\n\n        <button class="btn btn-sm btn-complete">Filter</button>\n    </div>\n</div>\n\n<div class="form-group">\n    <table id="table-post-list" class="table table-striped" data-sortable>\n        <thead>\n        <tr>\n            <th data-sortable="true">Title</th>\n            <th data-sortable="true" class="hidden-xs">Date</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr v-repeat="row: stories">\n            <td class="post-title" data-value="Wedding of the Day">\n                <a v-link="/story/edit/{{row.id}}" class="title">{{row.title}}</a>\n\n                <div class="row-actions">\n                    <ul class="list-inline">\n                        <li><a v-link="/story/edit/{{row.id}}">Edit</a></li>\n                        <li><a href="single.php">View</a></li>\n                        <li v-if="row.featured == 0 && row.deleted_at == null"><a href="" class="overlay-success">Feature</a>\n                        </li>\n                        <li v-if="row.deleted_at == null"><a href="" class="overlay-danger">Trash</a></li>\n                    </ul>\n                </div>\n            </td>\n            <td class="post-date hidden-xs" data-value="{{row.created_at}}">\n                <span title="2015/07/02 8:46:55 am" style="display:block;margin-bottom:5px;">{{row.created_at}}</span>\n\n                <div>\n                    <span v-if="row.status == \'published\' || row.status == \'draft\'" class="label"\n                          v-class="label-warning: row.status == \'draft\', label-primary: row.status == \'published\'">{{row.status.charAt(0).toUpperCase() + row.status.slice(1)}}</span>\n                    <span v-if="row.featured == 1 && row.deleted_at == null" class="label label-success">Featured</span>\n                    <span v-if="row.deleted_at != null" class="label label-danger">Deleted</span>\n                </div>\n            </td>\n        </tr>\n        </tbody>\n    </table>\n</div>';
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
    ready: function ready() {
        this.getStories();
    },
    methods: {
        getStories: function getStories() {
            var self = this;
            $.ajax({
                url: '/api/1.0/stories',
                method: 'GET'
            }).done(function (result) {
                //self.stories = result.data.items;
            });
        }
    }
};

},{"./stories-template.html":4}],6:[function(require,module,exports){
module.exports = '<div class="row">\n    <div class="col-sm-8 col-md-9">\n        <h2 class="page-header">\n            <span>{{ $route.params.id > 0 ? \'Edit Story\' : \'Add New Story\' }}</span>\n            <a v-link="{ name : \'storyList\' }" class="cancel-story-h2">Cancel</a>\n        </h2>\n\n        <div class="form-group mg-20-b">\n            <input type="text" name="title" id="post-title" class="form-control input-lg" placeholder="Enter Title Here"\n                   v-model="story.title"/>\n        </div>\n\n        <div class="form-group">\n            <button class="btn btn-sm" data-toggle="modal" data-target="#modal-media"><i class="fa fa-photo"></i> Add\n                Media\n            </button>\n            <textarea id="post-content" class="form-control" rows="10" cols="10" v-model="story.content"></textarea>\n        </div>\n        <div class="panel-group accordion">\n            <div class="panel panel-default">\n                <div class="panel-heading" role="tab">\n                    <h4 class="panel-title">\n                        <a class="text-capitalize pad-10-y" role="button" data-toggle="collapse"\n                           data-parent="#accordion"\n                           href="#additionalInformationCollapse" aria-expanded="true"\n                           aria-controls="additionalInformationCollapse">Additional Information</a>\n                    </h4>\n                </div>\n                <div id="additionalInformationCollapse" class="panel-collapse collapse in" role="tabpanel"\n                     aria-labelledby="headingOne">\n                    <div class="panel-body">\n                        <div class="checkbox mg-20-b">\n                            <input type="checkbox" id="story-featured" v-model="story.featured"/>\n                            <label for="story-featured">Featured</label>\n                        </div>\n                        <div class="mg-20-b">\n                            <textarea class="form-control" rows="3" cols="10" v-model="story.excerpt"\n                                      placeholder="Add optional story excerpt or summary."></textarea>\n                        </div>\n                        <div class="checkbox mg-20-b">\n                            <input type="checkbox" id="publish-story" v-model="story.published"/>\n                            <label for="publish-story">Published</label>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div>\n            <button class="btn btn-sm btn-primary pull-left">Save</button>\n            <button class="btn btn-sm btn-link pull-right overlay-danger">Move to Trash</button>\n            <button class="btn btn-sm btn-link pull-right overlay-danger" alt="Delete Permanently">\n                Delete\n            </button>\n        </div>\n    </div>\n    <div class="col-sm-4 col-md-3">\n\n\n        <aside id="admin-postbox">\n\n            <div class="panel-group accordion">\n\n                <div class="panel panel-default">\n                    <div class="panel-heading" role="tab" id="headingOne">\n                        <h4 class="panel-title">\n                            <a class="text-capitalize pad-10-y" role="button" data-toggle="collapse"\n                               data-parent="#accordion" href="#collapsePublish" aria-expanded="true"\n                               aria-controls="collapsePublish">Details</a>\n                        </h4>\n                    </div>\n                    <div id="collapsePublish" class="panel-collapse collapse in" role="tabpanel"\n                         aria-labelledby="headingOne">\n                        <div class="panel-body">\n                            <ul class="list-menu">\n                                <li>\n                                    <i class="fa fa-fw fa-pencil"></i> Status:\n                                    <span class="label"\n                                          v-class=" label-warning: story.published  == 0,\n                                                    label-primary: story.published == 1,\n                                                    label-danger: story.deleted_at != null">\n                                        <strong>{{ status }}</strong>\n                                    </span> &nbsp;\n                                    <span v-if="story.featured == 1 && story.published == 1"\n                                          class="label label-success"><strong>Featured</strong></span>\n                                </li>\n                                <li>\n                                    <i class="fa fa-fw fa-user"></i> Author: <strong>{{ story.author }}</strong>\n                                </li>\n                                <li>\n                                    <i class="fa fa-fw fa-calendar"></i> Created at: <strong>{{ story.created }}</strong>\n                                </li>\n                            </ul>\n                        </div>\n\n                    </div>\n                </div>\n                <!--/ .panel -->\n                <div class="panel panel-default">\n                    <div class="panel-heading" role="tab" id="headingCategory">\n                        <h4 class="panel-title">\n                            <a class="text-capitalize pad-10-y" role="button" data-toggle="collapse"\n                               data-parent="#accordion" href="#collapseCategory" aria-expanded="true"\n                               aria-controls="collapseCategory">Category</a>\n                        </h4>\n                    </div>\n                    <div id="collapseCategory" class="panel-collapse collapse in" role="tabpanel"\n                         aria-labelledby="headingCategory">\n                        <div class="panel-body">\n                            <div class="tablist">\n                                <div class="dropdown">\n                                    <button class="btn btn-default dropdown-toggle" type="button"\n                                            id="dropdownCategoriesMenu" data-toggle="dropdown"\n                                            aria-haspopup="true" aria-expanded="false">\n                                        {{ indicators.category }}\n                                        <span class="caret"></span>\n                                    </button>\n\n                                    <ul class="dropdown-menu" aria-labelledby="dropdownCategoriesMenu">\n                                        <li v-repeat="row:categories"><a href="javascript:void(0);"\n                                                                         v-on="click: modifyCategory($index)">{{row.name}}</a>\n                                        </li>\n                                    </ul>\n                                </div>\n                            </div>\n                            <!--/ .tablist-->\n\n                        </div>\n                    </div>\n                </div>\n\n                <div class="panel panel-default">\n                    <div class="panel-heading" role="tab" id="headingKeywords">\n                        <h4 class="panel-title">\n                            <a class="text-capitalize pad-10-y" role="button" data-toggle="collapse"\n                               data-parent="#accordion" href="#collapseKeywords" aria-expanded="true"\n                               aria-controls="collapseCategories">Keywords</a>\n                        </h4>\n                    </div>\n                    <div id="collapseKeywords" class="panel-collapse collapse in" role="tabpanel"\n                         aria-labelledby="headingKeywords">\n                        <div class="panel-body">\n                            <div class="form-group">\n                                <p class="help-block">Separated by comma(<b>,</b>)</p>\n                                <input type="text" id="post-keywords" v-model="story.keywords" class="form-control"/>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <!--/ .panel -->\n\n                <div class="panel panel-default">\n                    <div class="panel-heading" role="tab" id="headingThree">\n                        <h4 class="panel-title">\n                            <a class="text-capitalize pad-10-y" role="button" data-toggle="collapse"\n                               data-parent="#accordion" href="#collapseFeaturedImage" aria-expanded="true"\n                               aria-controls="collapseFeaturedImage">Default Image</a>\n                        </h4>\n                    </div>\n                    <div id="collapseFeaturedImage" class="panel-collapse collapse in" role="tabpanel"\n                         aria-labelledby="headingThree">\n                        <div class="panel-body">\n                            <div class="open-modal-media" v-if="false">\n                                <button class="btn btn-sm btn-link center-block upload-media-btn" data-toggle="modal"\n                                        data-target="#modal-media">Set Featured Image\n                                </button>\n                            </div>\n\n                            <div class="upload-media-attachment">\n                                <div class="attachment-preview">\n                                    <div class="thumbnail">\n                                        <div class="centered">\n                                            <img src="/images/gallery-02.jpg" draggable="false" alt="">\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <!--/ .panel -->\n\n            </div>\n\n        </aside>\n\n    </div>\n</div>\n\n<!-- Add to Collection Modal  -->\n<div class="modal fade media-frame" id="modal-media" tabindex="-1" role="dialog" aria-labelledby="modal-media-label">\n    <div class="modal-dialog modal-dialog-full-width" role="document">\n        <div class="modal-content">\n            <div class="modal-header">\n                <button type="button" class="close overlay-dark" data-dismiss="modal" aria-label="Close"><span\n                        aria-hidden="true">×</span></button>\n                <h4 class="modal-title" id="modal-media-label">Insert Media</h4>\n            </div>\n            <div class="modal-body">\n                <ul class="nav nav-tabs" role="tablist">\n                    <li role="presentation" class=""><a href="#upload-files" aria-controls="upload-files" role="tab"\n                                                        data-toggle="tab" aria-expanded="false">Add Files</a></li>\n                    <li role="presentation" class="active"><a href="#media-library" aria-controls="upload-files"\n                                                              role="tab" data-toggle="tab" aria-expanded="false">Media\n                        Library</a></li>\n                </ul>\n\n                <div class="tab-content">\n                    <div role="tabpanel" class="tab-pane mg-20-y" id="upload-files">\n                        <div class="pad-20 text-center table-row" id="photo-uploader">\n\n                            <div class="file-upload-button table-cell">\n                                <h4>Drop files anywhere to upload</h4>\n\n                                <p>Or,</p>\n                                <button class="btn btn-primary" id="upload-ideabook-photos-btn">Upload Photo</button>\n                                <input type="file" name="image-upload" class="hide" id="upload-ideabook-photos-input">\n                            </div>\n\n                        </div>\n                    </div>\n                    <!--/ .upload-files -->\n                    <div role="tabpanel" class="tab-pane mg-20-y active" id="media-library">\n                        <div class="row full-height">\n                            <div class="col-sm-8 col-md-9 col-lg-10 full-height">\n                                <ul class="menu scrollable clearfix">\n                                    <li class="attachment" role="checkbox">\n                                        <div class="attachment-preview">\n                                            <div class="thumbnail">\n                                                <div class="centered">\n                                                    <img src="./images/gallery-01.jpg" draggable="false" alt="">\n                                                </div>\n                                            </div>\n                                        </div>\n                                        <a class="check" role="button" title="Deselect" tabindex="0"><i\n                                                class="icon"></i></a>\n                                    </li>\n                                    <li class="attachment selected" role="checkbox">\n                                        <div class="attachment-preview">\n                                            <div class="thumbnail">\n                                                <div class="centered">\n                                                    <img src="./images/gallery-02.jpg" draggable="false" alt="">\n                                                </div>\n                                            </div>\n                                        </div>\n                                        <a class="check" role="button" title="Deselect" tabindex="0"><i\n                                                class="icon"></i></a>\n                                    </li>\n                                    <li class="attachment" role="checkbox">\n                                        <div class="attachment-preview">\n                                            <div class="thumbnail">\n                                                <div class="centered">\n                                                    <img src="./images/gallery-03.jpg" draggable="false" alt="">\n                                                </div>\n                                            </div>\n                                        </div>\n                                        <a class="check" role="button" title="Deselect" tabindex="0"><i\n                                                class="icon"></i></a>\n                                    </li>\n                                    <li class="attachment" role="checkbox">\n                                        <div class="attachment-preview">\n                                            <div class="thumbnail">\n                                                <div class="centered">\n                                                    <img src="./images/gallery-04.jpg" draggable="false" alt="">\n                                                </div>\n                                            </div>\n                                        </div>\n                                        <a class="check" role="button" title="Deselect" tabindex="0"><i\n                                                class="icon"></i></a>\n                                    </li>\n                                </ul>\n                            </div>\n\n                            <div class="col-sm-4 col-md-3 col-lg-2 full-height hidden-xs">\n                                <div class="attachment-details scrollable">\n                                    <h4>Attachment Details</h4>\n\n                                    <div class="form-group form-group-default">\n                                        <label>Title</label>\n                                        <input type="text" class="form-control" placeholder="Title goes here"/>\n                                    </div>\n                                    <div class="form-group form-group-default">\n                                        <label>Caption</label>\n                                        <textarea class="form-control no-resize" placeholder="Say something awesome"\n                                                  rows="5" cols="5"/></textarea>\n                                    </div>\n                                    <div class="form-group form-group-default">\n                                        <label>Alt Text</label>\n                                        <input type="text" class="form-control" placeholder="Alt goes here"/>\n                                    </div>\n                                    <div class="form-group form-group-default">\n                                        <label>Description</label>\n                                        <textarea class="form-control no-resize" placeholder="Say something awesome"\n                                                  rows="5" cols="5"/></textarea>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n\n                    </div>\n                    <!--/ .media-library-->\n                </div>\n            </div>\n            <!--/ .modal-body -->\n            <div class="modal-footer">\n                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\n                <button type="button" class="btn btn-complete">Insert</button>\n            </div>\n        </div>\n    </div>\n</div>\n<!--/ .modal -->\n';
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
            story: {
                id: 0,
                title: '',
                content: '',
                published: 0,
                excerpt: '',
                keywords: '',
                default_image: '',
                featured: 0,
                deleted_at: null,
                author: localStorage.getItem('AdminName'),
                created: 'Now'
            },
            status: 'New',
            category: ''
        };
    },
    ready: function ready() {
        tinyMCE.settings = tinymceConfig['default'];
        tinyMCE.execCommand('mceAddEditor', true, this.tinymce_container);
        this.getCategories();
    },
    compiled: function compiled() {
        tinyMCE.execCommand('mceRemoveEditor', true, this.tinymce_container);
    },
    methods: {
        getCategories: function getCategories() {
            var self = this;
            $.ajax({
                url: '/api/1.0/category/all',
                method: 'GET'
            }).done(function (result) {
                self.categories = result.data;
                for (var i in self.categories) {
                    if (self.categories[i].id == self.story.category_id) {
                        self.category = self.categories[i].name;
                    }
                }
            });
        }
    }
};

},{"./story-template.html":6}],8:[function(require,module,exports){
module.exports = '<div id="wrapper">\n\n    <!-- Navigation -->\n    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">\n        <!-- Brand and toggle get grouped for better mobile display -->\n        <div class="navbar-header">\n            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">\n                <span class="sr-only">Toggle navigation</span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n            </button>\n            <a href="/" class="navbar-brand">\n                <img src="/images/logo-brandmark-light.svg" class="logo-brandmark logo-icon"\n                     alt="Bridal Gallery" width="50"/>\n                <img src="/images/logo-wordmark-light.png" class="logo-wordmark logo-icon hidden-xs hidden-sm"\n                     alt="Bridal Gallery" width="215"/>\n            </a>\n        </div>\n        <!-- Top Menu Items -->\n        <ul class="nav navbar-right top-nav">\n            <li class="dropdown">\n                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-envelope"></i> <b\n                        class="caret"></b></a>\n                <ul class="dropdown-menu message-dropdown">\n                    <li class="message-preview">\n                        <a href="#">\n                            <div class="media">\n                                    <span class="pull-left">\n                                        <img class="media-object" src="http://placehold.it/50x50" alt="">\n                                    </span>\n\n                                <div class="media-body">\n                                    <h5 class="media-heading"><strong>John Smith</strong>\n                                    </h5>\n\n                                    <p class="small text-muted"><i class="fa fa-clock-o"></i> Yesterday at 4:32 PM</p>\n\n                                    <p>Lorem ipsum dolor sit amet, consectetur...</p>\n                                </div>\n                            </div>\n                        </a>\n                    </li>\n                    <li class="message-preview">\n                        <a href="#">\n                            <div class="media">\n                                    <span class="pull-left">\n                                        <img class="media-object" src="http://placehold.it/50x50" alt="">\n                                    </span>\n\n                                <div class="media-body">\n                                    <h5 class="media-heading"><strong>John Smith</strong>\n                                    </h5>\n\n                                    <p class="small text-muted"><i class="fa fa-clock-o"></i> Yesterday at 4:32 PM</p>\n\n                                    <p>Lorem ipsum dolor sit amet, consectetur...</p>\n                                </div>\n                            </div>\n                        </a>\n                    </li>\n                    <li class="message-preview">\n                        <a href="#">\n                            <div class="media">\n                                    <span class="pull-left">\n                                        <img class="media-object" src="http://placehold.it/50x50" alt="">\n                                    </span>\n\n                                <div class="media-body">\n                                    <h5 class="media-heading"><strong>John Smith</strong>\n                                    </h5>\n\n                                    <p class="small text-muted"><i class="fa fa-clock-o"></i> Yesterday at 4:32 PM</p>\n\n                                    <p>Lorem ipsum dolor sit amet, consectetur...</p>\n                                </div>\n                            </div>\n                        </a>\n                    </li>\n                    <li class="message-footer">\n                        <a href="#">Read All New Messages</a>\n                    </li>\n                </ul>\n            </li>\n            <li class="dropdown">\n                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-bell"></i> <b\n                        class="caret"></b></a>\n                <ul class="dropdown-menu alert-dropdown">\n                    <li>\n                        <a href="#">Alert Name <span class="label label-default">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-primary">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-success">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-info">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-warning">Alert Badge</span></a>\n                    </li>\n                    <li>\n                        <a href="#">Alert Name <span class="label label-danger">Alert Badge</span></a>\n                    </li>\n                    <li class="divider"></li>\n                    <li>\n                        <a href="#">View All</a>\n                    </li>\n                </ul>\n            </li>\n            <li class="dropdown">\n                <a href="#" class="dropdown-toggle text-center" data-toggle="dropdown" role="button"\n                   aria-haspopup="true" aria-expanded="false" title="Megan Simpsons">\n                    <span class="avatar-name">{{ logged.name }}</span>\n                    &nbsp;\n                    <img v-attr="src: logged.avatar" class="avatar-thumb" width="18" height="18"\n                         v-attr="title: logged.name "/>\n                </a>\n                <ul class="dropdown-menu">\n                    <li>\n                        <a href="#"><i class="fa fa-fw fa-user"></i> Profile</a>\n                    </li>\n                    <li>\n                        <a href="#"><i class="fa fa-fw fa-envelope"></i> Inbox</a>\n                    </li>\n                    <li>\n                        <a href="#"><i class="fa fa-fw fa-gear"></i> Settings</a>\n                    </li>\n                    <li class="divider"></li>\n                    <li>\n                        <a href="javascript:void(0);" v-on="click: doLogout"><i class="fa fa-fw fa-power-off"></i> Log Out</a>\n                    </li>\n                </ul>\n            </li>\n        </ul>\n        <!-- Sidebar Menu Items - These collapse to the responsive navigation menu on small screens -->\n        <div class="collapse navbar-collapse navbar-ex1-collapse">\n            <ul class="nav navbar-nav side-nav">\n                <li v-class="active: $route.path == \'/dashboard\'">\n                    <a v-link="{ name: \'dashboard\' }"><i class="fa fa-fw fa-dashboard"></i> Dashboard</a>\n                </li>\n                <li>\n                    <a href="javascript:void(0);" data-toggle="collapse" data-target="#stories"><i\n                            class="fa fa-fw fa-thumb-tack"></i> Stories <i class="fa fa-fw fa-caret-down"></i></a>\n                    <ul id="stories" class="collapse in">\n                        <li v-class="active : $route.path == \'/stories\'">\n                            <a v-link="{ name: \'storyList\' }">All Stories</a>\n                        </li>\n                        <li v-class="active : $route.path == \'/story/tags\'">\n                            <a v-link="{ name: \'storyTags\' }">Story Tags</a>\n                        </li>\n                    </ul>\n                </li>\n                <li v-class="active : $route.path == \'/categories\'">\n                    <a v-link="{ name: \'categories\' }"><i class="fa fa-fw fa-filter"></i> Categories</a>\n                </li>\n                <li>\n                    <a href="javascript:void(0);" data-toggle="collapse" data-target="#translator"><i\n                            class="fa fa-fw fa-pencil"></i> Translator <i class="fa fa-fw fa-caret-down"></i></a>\n                    <ul id="translator" class="collapse in">\n                        <li v-class="active : $route.path == \'/translator/translations\'">\n                            <a v-link="{ name: \'translations\' }">Translations</a>\n                        </li>\n                        <li v-class="active : $route.path == \'/translator/languages\'">\n                            <a v-link="{ name: \'languages\' }">Languages</a>\n                        </li>\n                    </ul>\n                </li>\n                <li v-class="active : $route.router.name == \'users\'">\n                    <a v-link="{ name: \'users\' }"><i class="fa fa-fw fa-filter"></i> Users</a>\n                </li>\n            </ul>\n        </div>\n        <!-- /.navbar-collapse -->\n    </nav>\n\n    <div id="page-wrapper">\n\n        <div class="container-fluid post-editor">\n            <router-view></router-view>\n\n        </div>\n        <!-- /.container-fluid -->\n\n    </div>\n    <!-- /#page-wrapper -->\n\n</div>\n<!-- /#wrapper -->';
},{}]},{},[1]);
