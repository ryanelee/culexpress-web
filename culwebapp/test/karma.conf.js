// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-12-02 using
// generator-karma 1.0.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/jquery-migrate/jquery-migrate.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/bootstrap-fileinput/js/fileinput.min.js',
      'bower_components/clipboard/dist/clipboard.js',
      'bower_components/moment/moment.js',
      'bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
      'bower_components/froala-wysiwyg-editor/js/froala_editor.min.js',
      'bower_components/froala-wysiwyg-editor/js/froala_editor.pkgd.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/align.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/char_counter.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/code_beautifier.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/code_view.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/colors.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/draggable.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/emoticons.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/entities.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/file.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/font_family.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/font_size.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/fullscreen.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/help.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/image.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/image_manager.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/inline_style.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/line_breaker.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/link.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/lists.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/paragraph_format.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/paragraph_style.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/print.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/quick_insert.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/quote.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/save.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/special_characters.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/table.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/url.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/video.min.js',
      'bower_components/froala-wysiwyg-editor/js/plugins/word_paste.min.js',
      'bower_components/froala-wysiwyg-editor/js/third_party/embedly.min.js',
      'bower_components/froala-wysiwyg-editor/js/third_party/image_aviary.min.js',
      'bower_components/froala-wysiwyg-editor/js/third_party/spell_checker.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      "app/scripts/**/*.js",
      "test/mock/**/*.js",
      "test/spec/**/*.js"
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      "PhantomJS"
    ],

    // Which plugins to enable
    plugins: [
      "karma-phantomjs-launcher",
      "karma-jasmine"
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
