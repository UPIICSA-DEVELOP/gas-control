/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

const path = require('path'), fs = require('fs');

const PATHS = {
  dev: '/var/www/html/app.inspector.com/develop/',
  prod: '/var/www/html/app.inspector.com/production/'
};

(function () {

  function apps() {
    let apps = {
      apps: [
        {
          name: "app-inspector-"+process.env.NODE_ENV,
          script: "./server.js",
          exec_mode: "fork",
          cwd : PATHS[process.env.NODE_ENV]
        }
      ]
    };
    fs.writeFile(path.resolve(__dirname, '../', 'dist/apps.json'), JSON.stringify(apps), function(err) {
      if(err) {
        return console.error(err);
      }
    });
  }

  function packageJson() {
    const file = fs.readFileSync(path.resolve(__dirname, '../', 'package.json'), 'utf8');
    const data = JSON.parse(file.toString());
    delete data.devDependencies;
    delete data.scripts;
    fs.writeFile(path.resolve(__dirname, '../', 'dist', 'package.json'), JSON.stringify(data), (err) => {
      if(err){
        return console.error(err);
      }
    });
  }


  function init() {
    apps();
    packageJson();
    console.info(`Configuration created at ${new Date()}`);
  }

  init();

})();
