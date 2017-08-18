var gulp = require('gulp');

var angularFilesort = require('gulp-angular-filesort');
var angularTranslate = require('gulp-angular-translate');
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var csslint = require('gulp-csslint');
var del = require('del');
var inject = require('gulp-inject');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var karma = require('karma').server;
var open = require('gulp-open');
var prettify = require('gulp-jsbeautifier');
var pug = require('gulp-pug');
var reload = browserSync.reload;
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var shell = require('gulp-shell');
var sortJSON = require('gulp-json-sort').default;
var source = require('vinyl-source-stream');
var templateCache = require('gulp-angular-templatecache');

var injectConfig = {
    css: [
        './app/.www/assets/lib/**/*.css',
        './app/.www/assets/**/*.css',
        '!./app/.www/assets/**/*.min.css'
    ],
    cssmin: [
        './app/.www/app.min.css'
    ],
    js: [
        './app/.www/assets/lib/**/*.js',
        './app/.www/components/app.js',
        './app/.www/components/**/*.js',
        '!./app/.www/components/**/*-test.js',
        '!./app/.www/**/app.min.js'
    ],
    jsmin: [
        './app/.www/config/env.js',
        './app/.www/app.min.js'
    ]
};

gulp.task('default', ['serve']);

gulp.task('watch:js', function(done) {
    runSequence('build:js', 'build:browserify', done);
});

gulp.task('watch:pug', function(done) {
    runSequence('build:pug', 'build:templates', done);
});

gulp.task('build', function(done) {
    runSequence('translations', 'build:clean', 'build:sass', 'build:pug', 'build:translate', 'build:translate:fix', 'build:material:fix', 'build:img', 'build:js', 'build:img', 'build:lib', 'build:browserify', 'build:templates', 'build:css', 'build:index', done);
});

// Build the application in our development environment and start a local dev server with a file watch to handle automated builds, sass and pug compilation, front-end dependencies, file clean-up, etc. - http://localhost:3000
gulp.task('serve', ['build'], function() {
    browserSync.init({
        server: './app/.www/',
        port: 3000
    });
    gulp.watch('./app/components/**/*.js', ['watch:js']);
    gulp.watch('./app/components/**/*.pug', ['watch:pug']);
    gulp.watch('./app/assets/**/*.scss', ['build:sass']);
    gulp.watch('./app/.www/assets/**/*.css', ['build:css']);
    gulp.watch('./app/.www/index.html', ['build:index']);
    gulp.watch("./gulpfile.js", ['build:gulpfile']);
    gulp.watch("./translations/*.json", ['build']);
    gulp.watch([
        './app/.www/assets/**/*.css',
        './app/.www/components/**/*.js',
        './app/.www/components/**/*.html',
        './app/.www/index.html',
        './app/.www/reports/**/*.html'
    ]).on('change', reload);
    console.log("Running development server...");
});

// Browserify
gulp.task('build:browserify', function() {
    return browserify('./app/components/app.js')
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./app/.www/components/'))
        .pipe(browserSync.stream());
})

// Clean out the build folder for a new build
gulp.task('build:clean', function() {
    return del([
        './app/.www/**/*'
    ]);
});

// Gulpfile specific build task
gulp.task('build:gulpfile', function() {
    return gulp.src('./gulpfile.js')
        .pipe(prettify())
        .pipe(gulp.dest("./"));
});

// index.html specific build task
gulp.task('build:index', function() {
    return gulp.src("./app/.www/index.html")
        .pipe(inject(
            gulp.src(injectConfig.js, {
                read: false
            }), {
                relative: true
            }))
        .pipe(inject(
            gulp.src(injectConfig.css, {
                read: false
            }), {
                relative: true
            }))
        .pipe(prettify())
        .pipe(gulp.dest('./app/.www/'))
        .pipe(browserSync.stream());
});

// JavaScript specific build task
gulp.task('build:js', function() {
    return gulp.src(["./app/components/**/*.js", "!./app/components/**/*-test.js"], {
            base: "./app/components/"
        })
        .pipe(prettify())
        .pipe(jshint({
            esversion: 6
        }))
        .pipe(jshint.reporter())
        .pipe(gulp.dest("./app/.www/components/"))
        .pipe(browserSync.stream());
});

gulp.task('build:img', function() {
    return gulp.src(['./app/assets/images/**/*'], {
            base: './app/assets/images'
        })
        .pipe(gulp.dest('./app/.www/assets/images'))
});

gulp.task('build:lib', function() {
    return gulp.src(['./app/assets/lib/**/*'], {
            base: './app/assets/lib'
        })
        .pipe(gulp.dest('./app/.www/assets/lib'))
        .pipe(browserSync.stream());
});

// Compile pug into html & auto-reload in browsers during development
gulp.task('build:pug', function() {
    return gulp.src(['./app/**/*.pug'], {
            base: './app/'
        })
        .pipe(pug())
        .pipe(gulp.dest('./app/.www/'))
        .pipe(browserSync.stream());
});

// Image specific build task
gulp.task('build:img', function() {
    return gulp.src(['./app/assets/images/**/*'], {
            base: './app/assets/images'
        })
        .pipe(gulp.dest('./app/.www/assets/images'))
        .pipe(browserSync.stream());
});

// CSS specific build task
gulp.task('build:css', ['build:css:copy'], function() {
    return gulp.src(["./app/.www/assets/css/**/*.css", '!./app/.www/assets/**/angular-*.css'], {
            base: './app/.www/assets/css'
        })
        .pipe(autoprefixer())
        .pipe(prettify())
        .pipe(csslint())
        .pipe(gulp.dest('./app/.www/assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('build:css:copy', function() {
    return gulp.src("./node_modules/angular-material/angular-material.css")
        .pipe(gulp.dest('./app/.www/assets/css'))
        .pipe(browserSync.stream());
});

// Compile sass into CSS & auto-reload in browsers during development
gulp.task('build:sass', function() {
    return gulp.src('./app/assets/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./app/.www/assets/css'))
        .pipe(browserSync.stream());
});

// View template specific build task
gulp.task('build:templates', function() {
    return gulp.src(["./app/.www/components/**/*.html"], {
            base: "./app/.www/components"
        })
        .pipe(prettify())
        .pipe(gulp.dest("./app/.www/components"))
        .pipe(templateCache('templates.js', {
            standalone: true,
            root: 'components'
        }))
        .pipe(gulp.dest('./app/.www/components/templates'))
        .pipe(browserSync.stream());
});

// Create Angular 'translations' module from json files stored in the 'translations' folder
gulp.task('build:translate', function() {
    return gulp.src('./translations/*.json')
        .pipe(angularTranslate())
        .pipe(gulp.dest('./app/.www/components/translations'))
        .pipe(browserSync.stream());
});

// The gulp-angular-translate module doesn't add the pascalprecht.translate to translations.js so we gonna do it
gulp.task('build:translate:fix', function() {
    return gulp.src('./app/.www/components/translations/translations.js')
        .pipe(replace('angular.module("translations", [])', 'angular.module("translations", [\'pascalprecht.translate\'])'))
        .pipe(gulp.dest('./app/.www/components/translations'));
});

// The gulp-angular-translate module doesn't add the pascalprecht.translate to translations.js so we gonna do it
gulp.task('build:material:fix', function() {
    return gulp.src('./node_modules/angular-material/angular-material.js')
        .pipe(replace('var messages = getMessagesElement(element);', 'var messages = getMessagesElement(element), inputContainer = getInputElement(element), input =  angular.element(inputContainer[0].querySelector(\'input\'));'))
        .pipe(replace('if (messages.hasClass(\'md-auto-hide\')) {', 'if (messages.hasClass(\'md-auto-hide\') && input.hasClass(\'ng-untouched\')) {'))
        .pipe(gulp.dest('./node_modules/angular-material/'));
});

// Sort translation json
gulp.task('translations', function() {
    return gulp.src('./translations/*.json')
        .pipe(sortJSON({
            space: 2
        }))
        .pipe(gulp.dest('./translations/'));
});

gulp.task('test', function() {
    runSequence('test:karma', 'test:protractor', 'test:copy');
});

// Run tests in development environment
gulp.task('test:init', ['build'], function() {
    runSequence('test:karma', 'test:protractor', 'test:copy', 'test:browser');
});

gulp.task('test:browser', function() {
    return gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:3000/reports/karma.html'
        }));
        // .pipe(open({
        //     uri: 'http://localhost:3000/reports/e2e/htmlReport.html'
        // }));
});

// Clean out the test results folder
gulp.task('test:clean', function() {
    return del([
        './app/.www/reports/**/*'
    ]);
});

// Copy test results into our development environment for viewing in the browser
gulp.task('test:copy', ['test:clean'], function() {
    return gulp.src(['./tests/www/reports/**/*'], {
            base: './tests/www/reports'
        })
        .pipe(gulp.dest('./app/.www/reports'));
});

// Karma test runner
gulp.task('test:karma', ['build:browserify'], function(done) {
    karma.start({
        configFile: __dirname + '/tests/www/karma/karma.conf.js',
        singleRun: true
    }, function() {
        done();
    });
});

// Protractor test runner
gulp.task('test:protractor', function() {
    return gulp.src('./app')
        .pipe(shell(['protractor tests/www/protractor/protractor.conf.js'], {
            cwd: './',
            ignoreErrors: true
        }));
});