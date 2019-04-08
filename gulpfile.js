const gulp = require('gulp');
const del = require('del');
const zip = require('gulp-zip');

gulp.task('clean', function () {
  return del(['./dist']);
});

gulp.task('clean:zip', function () {
  return del(['./dist/dist.zip']);
});

gulp.task('templates', function() {
  return gulp.src([
    './endpoints/templates/**/**',
    './endpoints/docs/**/**',
  ]).pipe(gulp.dest('./dist/endpoints/templates'));
});

gulp.task('endpoints', ['templates'], function() {
  return gulp.src([
    './endpoints/*.json'
  ]).pipe(gulp.dest('./dist/endpoints'));
});

gulp.task('zip', () => {
  let file = null;
  const [,, ...args] = process.argv;
  if(args.length > 0){
    try{
      args.forEach((arg, index) => {
        if(arg === '--file'){
          file = args[index + 1];
        }
      });
    }catch (e){
      throw e;
    }
  }else{
    throw 'Arguments required';
  }

  if(!file){
    throw '--file is required';
  }
  return gulp.src([
    file + '/**',
    file + '/.*/**'
  ])
    .pipe(zip('bundle.zip'))
    .pipe(gulp.dest(file))
});




