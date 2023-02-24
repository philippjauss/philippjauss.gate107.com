var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jpegtran = require('imagemin-jpegtran');
var gifsicle = require('imagemin-gifsicle');
var optipng = require('imagemin-optipng');
var webp = require('gulp-webp');
const sass = require('gulp-sass')(require('node-sass'));
var inlineSource = require('gulp-inline-source');
var autoprefix = require('gulp-autoprefixer');
const workboxBuild = require('workbox-build');



gulp.task('service-worker', function() {
    return workboxBuild.injectManifest({
      swSrc: 'src/sw.js',
      swDest: 'app/sw.js',
      globDirectory: 'app',
      globPatterns: [
        '**\/*.{js,html,png,webp,jpg,json,ico}',
      ]
    });
  });


gulp.task('sass', function () {
    return gulp.src('src/css/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefix({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(gulp.dest('src/css'));
});


// minify html
gulp.task('minifyHTML', ['sass','service-worker'], function () {
    return gulp.src('src/*.html')
        .pipe(inlineSource())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('app'));
});

// optimize images
gulp.task('optimizeImages', function () {
    return gulp.src('src/img/**')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant(), jpegtran(), optipng(), gifsicle()]
        }))
        .pipe(gulp.dest('app/img'));
});

// create webp images
gulp.task('convertImages', ['optimizeImages'], function () {
    return gulp.src(['app/img/*.jpg', 'app/img/*.png'])
        .pipe(webp())
        .pipe(gulp.dest('app/img'));

});



// watcher
gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('src/*.html', ['reloadHTML']);
    gulp.watch('src/css/*.scss', ['reloadHTML']);
    gulp.watch('src/images/**', ['reloadImages']);
});

gulp.task('reloadHTML', ['minifyHTML'], function () {
    browserSync.reload();
});

gulp.task('reloadImages', ['convertImages'], function () {
    browserSync.reload();
});


// Static server
gulp.task('browser-sync', ['convertImages', 'minifyHTML'], function () {
    browserSync.init({
        server: {
            baseDir: 'app',
            serveStaticOptions: {
                extensions: ['html']
            },
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        }
    });
});

gulp.task('default', ['convertImages', 'minifyHTML', 'browser-sync', 'watch']);
gulp.task('build', ['convertImages', 'minifyHTML']);
