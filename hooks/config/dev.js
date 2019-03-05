(function () {
  const shell = require('shelljs');

  console.log('Init deploy for develop');

  try {
    shell.exec('sudo rm -rf /var/www/html/app.inspector.com/develop/*');
    shell.exec('sudo unzip /var/www/html/app.inspector.com/deploy/bundle.zip -d /var/www/html/app.inspector.com/develop');
    shell.exec('sudo npm i --unsafe-perm --prefix /var/www/html/app.inspector.com/develop');
    shell.exec('sudo rm -rf /var/www/html/app.inspector.com/deploy/bundle.zip');
    shell.exec('sudo chmod -R 755 /var/www/html/app.inspector.com/develop/');
    shell.exec('sudo pm2 startOrReload /var/www/html/app.inspector.com/develop/apps.json');
  }catch (e){
    throw 'Error' + e;
  }

  console.log('Finish deploy for develop');

})();
