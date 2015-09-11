var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

var paths = {
    'jquery': './vendor/bower_components/jquery/',
    'vue': './vendor/bower_components/vue/',
    'resource': './vendor/bower_components/vue-resource/',
    'router': './vendor/bower_components/vue-router/',
    'bootstrap': './vendor/bower_components/bootstrap-sass/assets/',
    'fontawesome': './vendor/bower_components/font-awesome/',
    'cookies': './vendor/bower_components/cookies-js/',
    'bourbon': './vendor/bower_components/bourbon/app/assets/',
    'tagsinput': './vendor/bower_components/bootstrap-tagsinput/',
    'typeahead': './vendor/bower_components/bootstrap3-typeahead/',
}
elixir(function (mix) {
    mix.sass("*.*", 'public/css/app.css', {includePaths: [paths.bootstrap + 'stylesheets', paths.fontawesome + 'scss', paths.bourbon + 'stylesheets']});
    mix.styles(['public/css/app.css', 'public/css/scrollbar.min.css', paths.tagsinput + 'dist/bootstrap-tagsinput.css'], 'public/css/app.css', './').version('public/css/app.css');
    mix.copy(paths.bootstrap + 'fonts/bootstrap/**', 'public/fonts/bootstrap')
        .copy(paths.fontawesome + 'fonts/**', 'public/fonts/fontawesome');
    mix.scripts([
        paths.jquery + "dist/jquery.js",
        paths.bootstrap + "javascripts/bootstrap.js",
        paths.cookies + "dist/cookies.js",
        paths.vue + "dist/vue.js",
        paths.resource + "dist/vue-resource.js",
        paths.router + "dist/vue-router.js",
        paths.tagsinput + "dist/bootstrap-tagsinput.js",
        paths.typeahead + "bootstrap3-typeahead.js",
        "resources/assets/js/vendor/ie10-viewport-bug-workaround.js",
        "resources/assets/js/vendor/scrollbar.min.js",
        "resources/assets/js/vendor/modernizr.min.js",
        "resources/assets/js/vendor/custom.js"
    ], 'public/js/vendor.js', './')
        .browserify('default.js', 'public/js/default.js')
        .browserify('user.js', 'public/js/user.js')
        .browserify('admin.js', 'public/js/admin.js')
        .version([
            'js/vendor.js',
            'js/default.js',
            'js/user.js',
            'js/admin.js'
        ]);
});
