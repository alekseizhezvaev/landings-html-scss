const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const del = require('del');
const browserSync = require('browser-sync').create();

gulp.task('clean', function () {
    return del(['dist', 'src/css/app.css']);
});

gulp.task('pug', function buildHTML() {
    return gulp.src('src/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./dist'))
});

gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(gulp.dest('src/css'))
});

gulp.task('static', function () {
    return gulp.src([
        'src/fonts/**/*',
        'src/img/**/*'
    ], { base: './src' })
        .pipe(gulp.dest('dist'))
});

gulp.task('dev', function browserDev(done) {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch('src/scss/**/*.scss', gulp.series('sass', 'pug', function (d) {
        browserSync.reload();
        d();
    }));
    gulp.watch('src/**/*.pug', gulp.series('pug', function (d) {
        browserSync.reload();
        d();
    }));
    done();
});


gulp.task("build", gulp.series("clean", "static", "sass", 'pug', 'dev'));