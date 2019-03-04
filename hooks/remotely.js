/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

'use-strict';

(function () {
  let setup = false, environment = null;

  const [,, ...args] = process.argv;

  if(args.length > 0){
    try{
      args.forEach((arg, index) => {
        if(arg === '--env'){
          environment = args[index + 1];
        }

        if(arg === '--setup'){
          setup = true;
        }

      });
    }catch (e){
      throw e;
    }
  }else{
    throw 'Arguments required';
  }

  if(setup){
    const commands = [
      'sudo unzip /var/www/html/app.inspector.com/deploy/config/bundle.zip -d /var/www/html/app.inspector.com/deploy/config',
      'sudo rm -rf /var/www/html/app.inspector.com/deploy/config/bundle.zip',
      'sudo npm install --unsafe-perm --prefix /var/www/html/app.inspector.com/deploy/config'
    ];
    execute(commands);
  }else{
    let commands = null;
    if(environment === 'dev'){
     commands = [
        'sudo node /var/www/html/app.inspector.com/deploy/config/dev.js'
      ];
    }else{
      commands = [
        'sudo node /var/www/html/app.inspector.com/deploy/config/prod.js'
      ];
    }
    execute(commands);
  }


  function execute(commands) {
    const RemoteExec = require('remote-exec');

    const connection_options = {
      port: 22,
      username: 'ubuntu',
      privateKey: require('fs').readFileSync(require('path').resolve(__dirname, '../','nodeServer.pem'))
    };

    const hosts = [
      'ec2-52-7-252-27.compute-1.amazonaws.com'
    ];

    RemoteExec(hosts, commands, connection_options, function(err){
      if (err) {
        console.log(err);
      } else {
        console.log('Commands executed successful');
      }
    });
  }

}());
