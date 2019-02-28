/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

'use-strict';

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');

function copyFiles(){
  const filesToMove = [
    './deep-links/apple-app-site-association',
    './deep-links/assetlinks.json'
  ];
  gulp.src(filesToMove).pipe(gulp.dest('./dist/.well-known'));
}

function createDirectory(){
  // path: .well-known
  const dir = path.resolve(__dirname, '../','dist/.well-known');
  if (!fs.existsSync(dir)){
    fs.mkdir(dir, function (error) {
      if(error){
        console.log('Error', error);
        return;
      }
      copyFiles();
    });
  }
}

createDirectory();
