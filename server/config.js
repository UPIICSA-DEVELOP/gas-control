/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */


(function () {

  // Copy dependencies

  const gulp = require('gulp');
  gulp.src([__dirname + '/package.json']).pipe(gulp.dest('./dist'));

  // Create a nconfig.json

  const fs = require('fs');
  const path = require('path');


  let data = {
    ENV: 'dev',
    PORT: 8090,
    SERVER: 2,
    BACKEND_URL: 'https://schedule-maplander.appspot.com/_ah/api/communication/v1/'
  };

  if(process.env.NODE_ENV === 'prod'){
    data.ENV = 'prod';
    data.PORT = 9090;
    data.BACKEND_URL = 'https://inspector-backend.appspot.com/_ah/api/communication/v1/';
  }

  data = JSON.stringify(data);

  fs.writeFile(path.resolve(__dirname,  '../', 'dist/config.json'), data, function(err) {
    if(err) {
      console.error(err);
    }
  });

  // Create a apps.json

  const dir = (process.env.NODE_ENV === 'dev')?'/var/www/html/app.inspector.com/develop/':'/var/www/html/app.inspector.com/production/';

  let apps = {
    "apps": [
      {
        "name": "app-inspector-"+process.env.NODE_ENV,
        "script": "./server.js",
        "instances": 2,
        "exec_mode": "cluster",
        "cwd" : dir,
        "env": {
          "ENV": process.env.NODE_ENV,
          "PORT": process.env.NODE_ENV === 'dev' ? 8090 : 9090,
          "SERVER": "2"
        }
      }
    ]
  };

  apps = JSON.stringify(apps);

  fs.writeFile(path.resolve(__dirname, '../', 'dist/apps.json'), apps, function(err) {
    if(err) {
      console.error(err);
    }
  });

  console.log('Config finish');


})();
