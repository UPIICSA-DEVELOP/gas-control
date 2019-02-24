const gulp = require('gulp');
const del = require('del');

gulp.task('clean', function () {
  return del(['./dist/browser', './dist/server', './dist/server.js', './dist/bot.js', './dist/sitemap.js']);
});

gulp.task('clean:source', function () {
  return del([
    './dist/browser/main.js',
    './dist/browser/polyfills.js',
    './dist/browser/runtime.js',
    './dist/browser/vendor.js',
    './dist/browser/styles.css'
  ]);
});

gulp.task('copy:endpoints', function() {
  return gulp.src(['./endpoints/**/*'])
    .pipe(gulp.dest('./dist/endpoints'));
});


