/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

(function () {
  const path = require('path');
  let filePath = null, destination = null;

  const [,, ...args] = process.argv;

  if(args.length > 0){
    try{
      args.forEach((arg, index) => {
        if(arg === '--filePath'){
          filePath = args[index + 1];
        }
        if(arg === '--destination'){
          destination = args[index + 1];
        }
      });
    }catch (e){
      throw e;
    }
  }else{
    throw 'Arguments required';
  }

  if(!filePath || !destination){
    throw '--filePath and --destination arguments required';
  }else{
    upload(path.resolve(__dirname, '../', filePath), destination);
  }


  function upload(file, destination) {

    const spawn = require('child_process').spawn;
    const pathPem = path.resolve(__dirname, '../','nodeServer.pem');

    const dest = 'ubuntu@ec2-52-7-252-27.compute-1.amazonaws.com:'+destination;

    const executor = spawn("scp", ['-i', pathPem, file, dest]);

    executor.stderr.on('data', function(data) {

    });

    executor.stdout.on('data', function(data) {

    });

    executor.stdout.on('end', function(data) {

    });

    executor.on('close', function(code) {
      if (code !== 0) {
        console.log('File copied failed: ' + code);
      }else{
        console.log("File copied successful");
      }
    });


  }
}());


