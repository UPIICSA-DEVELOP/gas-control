/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

'use-strict';

const gulp = require('gulp');

function copyFiles(){
  gulp.src([__dirname + '/package.json']).pipe(gulp.dest('./dist'));
}

copyFiles();
