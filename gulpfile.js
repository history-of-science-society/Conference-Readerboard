'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');


sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css/'));
});


gulp.task('autoprefixer', () =>
    gulp.src('src/css/main.css')
        .pipe(autoprefixer({
            browsers: ['last 2 version']
        }))
        .pipe(gulp.dest('dist/css/'))
);

gulp.task('nano', () =>
    gulp.src('dist/css/main.css')
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css/min/'))
)


gulp.task('watch', function () {
    gulp.watch('./src/sass/**/*.scss', gulp.series('sass'));
});