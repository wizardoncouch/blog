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
    'router': './vendor/bower_components/vue-router/',
    'bootstrap': './vendor/bower_components/bootstrap-sass/assets/',
    'fontawesome': './vendor/bower_components/font-awesome/',
    'cookies': './vendor/bower_components/cookies-js/',
    'bourbon': './vendor/bower_components/bourbon/app/assets/',
    'dropzone': './vendor/bower_components/dropzone/',
    'cropper': './vendor/bower_components/cropper/'
}
elixir(function (mix) {
    mix.sass("*.*", 'public/css/app.css', {includePaths: [paths.bootstrap + 'stylesheets', paths.fontawesome + 'scss', paths.bourbon + 'stylesheets']});
    mix.styles(['public/css/app.css', 'resources/assets/sass/vendor/scrollbar.min.css', paths.cropper + 'dist/cropper.css'], 'public/css/app.css', './');//.version('public/css/app.css');
    mix.copy(paths.bootstrap + 'fonts/bootstrap/**', 'public/fonts/bootstrap')
        .copy(paths.fontawesome + 'fonts/**', 'public/fonts/fontawesome')
        .copy('resources/assets/tinymce/**', 'public/tinymce');
    mix.scripts([
        paths.jquery + "dist/jquery.js",
        paths.bootstrap + "javascripts/bootstrap.js",
        paths.cookies + "dist/cookies.js",
        paths.vue + "dist/vue.js",
        paths.router + "dist/vue-router.js",
        paths.dropzone + "dist/dropzone.js",
        paths.cropper + "dist/cropper.js",
        "resources/assets/js/vendor/ie10-viewport-bug-workaround.js",
        "resources/assets/js/vendor/scrollbar.min.js",
        "resources/assets/js/vendor/modernizr.min.js",
        "resources/assets/js/vendor/chosen.js",
        "resources/assets/js/vendor/custom.js"
    ], 'public/js/vendor.js', './')
        .browserify('default.js', 'public/js/default.js')
        .browserify('user.js', 'public/js/user.js')
        .browserify('admin.js', 'public/js/admin.js')
        /*.version([
         'js/vendor.js',
         'js/default.js',
         'js/user.js',
         'js/admin.js'
         ])*/;
});
