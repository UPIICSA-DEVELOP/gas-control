const chalk = require('chalk');
const inquirer = require('inquirer');
const standardVersion = require('standard-version');
let type;


console.log(chalk.white.bold('╔══════════════════════════════════════════╗'));
console.log(chalk.white.bold('║' + '║'.padStart(43)));
console.log(chalk.white.bold('║              MapLander' + '║'.padStart(20)));
console.log(chalk.white.bold('║' + '║'.padStart(43)));
console.log(chalk.white.bold('║ Ready for this launch?' + '║'.padStart(20)));
console.log(chalk.white.bold('║' + '║'.padStart(43)));
console.log(chalk.white.bold('╚══════════════════════════════════════════╝'));
inquirer
  .prompt([
    {
      type : "list",
      name : "type",
      message : "Select the option that fits your modifications",
      choices: ['Major', 'Minor', 'Patch']
    }
  ])
  .then(answers => {
    switch (answers.type){
      case 'Major':
        type = 'major';
        break;
      case 'Minor':
        type = 'minor';
        break;
      case 'Patch':
        type = 'patch';
        break;
    }
    console.log(chalk.white.bold('║' + '║'.padStart(43)));
    console.log(chalk.white.bold('║' + '║'.padStart(43)));
    console.log(chalk.white.bold('║ Here we go!' + '║'.padStart(31)));
    console.log(chalk.white.bold('║' + '║'.padStart(43)));
    console.log(chalk.white.bold('║' + '║'.padStart(43)));
    increaseVersion();
  });

function increaseVersion() {
  standardVersion({
    infile: 'CHANGELOG.md',
    releaseAs: type
  }, function (err) {
    if (err) {
      console.log(`Increase version failed ${err}`);
    }
  });
}

