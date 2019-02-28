const gulp = require('gulp');
const del = require('del');
const zip = require('gulp-zip');

gulp.task('clean', function () {
  return del(['./dist']);
});

gulp.task('clean:zip', function () {
  return del(['./dist/dist.zip']);
});

gulp.task('copy:endpoints', function() {
  return gulp.src(['./endpoints/**/*'])
    .pipe(gulp.dest('./dist/endpoints'));
});

gulp.task('zip', () => {
  return gulp.src('./dist/**')
    .pipe(zip('./dist.zip'))
    .pipe(gulp.dest('./dist/'))
});




