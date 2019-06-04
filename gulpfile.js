const gulp = require('gulp');
const del = require('del');
const zip = require('gulp-zip');

const paths = {
  dist: 'dist'
};

gulp.task('clean', function () {
  return del([paths.dist]);
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




