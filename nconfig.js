'use strict';
const chalk = require('chalk');


function createConfig() {
  const fs = require('fs');
  const path = require('path');
  let data = {
    ENV: 'dev',
    PORT: 8899
  };

  if(process.env.NODE_ENV === 'prod'){
    data.ENV = 'prod';
    data.PORT = 8080;
  }

  data = JSON.stringify(data);

  fs.writeFile(path.resolve(__dirname, 'dist/config.json'), data, function(err) {
    if(err) {
      console.log(chalk.red.bold(`▬▬▬▬▬▬▬▬▬ Error | ` + err));
    }
    console.log(chalk.yellow.bold(`▬▬▬▬▬▬▬▬▬ Node Config was saved!`));
  });
}

createConfig();
