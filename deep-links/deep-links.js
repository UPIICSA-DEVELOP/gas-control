/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

'use-strict';

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');

const android_dev = [{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.maplander.inspector.develop",
    "sha256_cert_fingerprints":
      ["91:23:5E:4A:DC:D3:80:B4:5D:C1:38:2C:79:FE:F7:CA:18:01:07:56:EE:38:A3:62:D4:10:2A:A5:C4:6F:10:8A"]
  }
}];

const android_prod = [{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.maplander.inspector",
    "sha256_cert_fingerprints":
      ["13:18:8B:A9:B0:9B:6F:E8:98:D6:D2:CB:B3:0E:5F:27:22:8F:68:71:51:0A:3A:1D:78:54:B6:53:EC:17:D4:63"]
  }
}];


function copyFiles(){
  const filesToMove = [
    './deep-links/apple-app-site-association'
  ];
  gulp.src(filesToMove).pipe(gulp.dest('./dist/.well-known'));
  createAndroidLink();
}

function createAndroidLink() {
  const data = (process.env.NODE_ENV === 'dev')?android_dev:android_prod;
  fs.writeFile(path.resolve(__dirname,  '../', 'dist/.well-known/assetlinks.json'), JSON.stringify(data), function(err) {
    if (err) {
      console.error(err);
    }
  });
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
