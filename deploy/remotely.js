/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

'use-strict';

(function () {

  let environment = null;
  let setup = false, develop = true;

  const [,, ...args] = process.argv;

  if(args.length > 0){
    try{
      args.forEach((arg, index) => {
        if(arg === '-env'){
          environment = args[index + 1];
        }

        if(environment === 'prod'){
          develop = false;
        }

        if(arg === '-setup'){
          setup = true;
        }

      });
    }catch (e){
      throw e;
    }

  }else{
    console.log('Please assign -env option');
    throw 'Arguments is undefined';
  }


  const path = (develop)?'develop':'production';

  const nameApp = (develop)?'-Dev':'-Prod';

  console.log('Start for', (setup)?'setup':'deploy', 'in', path);

  const COMMANDS_FOR_SETUP = [
    'sudo unzip /var/www/html/inspector.com/deploy/dist.zip -d /var/www/html/inspector.com/'+path,
    'sudo npm install --unsafe-perm --prefix /var/www/html/inspector.com/'+path,
    'sudo rm -r /var/www/html/inspector.com/deploy/*',
    'sudo chmod -R 755 /var/www/html/inspector.com/'+path+'/',
    'pm2 start -i 4 /var/www/html/inspector.com/'+path+'/server.js --name Inspector'+nameApp
  ];

  const COMMANDS_FOR_DEPLOY = [
    'sudo rm -r /var/www/html/inspector.com/'+path+'/*',
    'sudo unzip /var/www/html/inspector.com/deploy/dist.zip -d /var/www/html/inspector.com/'+path,
    'sudo npm install --unsafe-perm --prefix /var/www/html/inspector.com/'+path,
    'sudo rm -r /var/www/html/inspector.com/deploy/*',
    'sudo chmod -R 755 /var/www/html/inspector.com/'+path+'/',
    'pm2 restart -i 4 /var/www/html/inspector.com/'+path+'/server.js --name Inspector'+nameApp,
    'pm2 reset all'
  ];

  const RemoteExec = require('remote-exec');

  const connection_options = {
    port: 22,
    username: 'ubuntu',
    privateKey: require('fs').readFileSync(require('path').resolve(__dirname, '../','nodeServer.pem'))
  };

  const hosts = [
    'ec2-52-7-252-27.compute-1.amazonaws.com'
  ];

  const cmds = (setup)?COMMANDS_FOR_SETUP:COMMANDS_FOR_DEPLOY;

  RemoteExec(hosts, cmds, connection_options, function(err){
    if (err) {
      console.log(err);
    } else {
      console.log((setup)?'Setup in':'Deploy in', environment, 'successful');
    }
  });


}());
