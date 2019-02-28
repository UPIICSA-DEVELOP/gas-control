/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

'use-strict';

(function () {
  const spawn = require('child_process').spawn;
  const path = require('path');

  const pathPem = path.resolve(__dirname, '../','nodeServer.pem');
  const pathFile = path.resolve(__dirname, '../','dist', 'dist.zip');

  const executor = spawn("scp", ["-i", pathPem, pathFile, "ubuntu@ec2-52-7-252-27.compute-1.amazonaws.com:/var/www/html/inspector.com/deploy"]);

  executor.stderr.on('data', function(data) {
    console.log(data.toString());
  });

  executor.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  executor.stdout.on('end', function(data) {
    console.log("Distribution copied successful");
  });

  executor.on('close', function(code) {
    if (code !== 0) {
      console.log('Distribution copied failed: ' + code);
    }
  });
}());


