var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jpegtran = require('imagemin-jpegtran');
var gifsicle = require('imagemin-gifsicle');
var optipng = require('imagemin-optipng');
var sass = require('gulp-sass');
var inlineSource = require('gulp-inline-source');
var autoprefix = require('gulp-autoprefixer');





gulp.task('sass', function () {
    return gulp.src('src/css/**/*.scss')
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoprefix({browsers: ['last 2 versions'], cascade: false}))
      .pipe(gulp.dest('app/css'))
      .pipe(gulp.dest('src/css'));
  });


// minify html
gulp.task('minifyHTML', ['sass'], function () {
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
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant(), jpegtran(), optipng(), gifsicle()]
        }))
        .pipe(gulp.dest('app/img'));
});



// watcher
gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('src/*.html', ['reloadHTML']);
    gulp.watch('src/css/*.scss', ['reloadHTML']);
    gulp.watch('src/images/**', ['optimizeImages', 'reloadImages']);
});

gulp.task('reloadHTML', ['minifyHTML'], function () {
    browserSync.reload();
});

gulp.task('reloadImages', ['optimizeImages'], function(){
    browserSync.reload();
});


// Static server
gulp.task('browser-sync', ['optimizeImages','minifyHTML'], function () {
    browserSync.init({
        server: {
            baseDir: 'app',
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        }
    });
});

gulp.task('default', ['optimizeImages', 'minifyHTML', 'browser-sync', 'watch']);
gulp.task('build', ['optimizeImages', 'minifyHTML']);
