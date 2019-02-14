'use strict';
const {Storage} = require('@google-cloud/storage');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const storage = new Storage();
let BUCKET = '';

console.log(chalk.blue.bold('██████████ MapLander ██████████'));

if(process.env.NODE_ENV === 'prod'){
  console.log(chalk.blue.bold('▬▬▬▬▬▬▬▬▬ Upload CDN for Production'));
  BUCKET = "maplander-public.appspot.com";
}else{
  console.log(chalk.blue.bold('▬▬▬▬▬▬▬▬▬ Upload CDN for Develop'));
  BUCKET = 'inspector-maplander-develop.appspot.com';
}

console.log(chalk.blue.bold(`▬▬▬▬▬▬▬▬▬ URL: ${BUCKET}`));

function upload(fileName, directory, directoryDestination) {
  storage
    .bucket(BUCKET)
    .upload(directory+fileName, {
      destination: directoryDestination+fileName,
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=0',
      },
    })
    .then(() => {
      console.log(chalk.blue.bold(`▬▬▬▬▬▬▬▬▬ ${fileName} uploaded`));
      makePublic(fileName);
    })
    .catch(err => {
      console.log(chalk.red.bold(`▬▬▬▬▬▬▬▬▬ Error | ` + err.message));
    });
}

function makePublic(fileName) {
  storage
    .bucket(BUCKET)
    .file('cdn/'+fileName)
    .makePublic()
    .then(() => {
      console.log(chalk.blue.bold(`▬▬▬▬▬▬▬▬▬ ${fileName} is now public.`));
    })
    .catch(err => {
      console.log(chalk.red.bold(`▬▬▬▬▬▬▬▬▬ Error | ` + err.message));
    });
}

function clear() {
  storage
    .bucket(BUCKET)
    .deleteFiles({ prefix: 'cdn/' }, function(err) {
      readSourceCodeFiles();
      readLibraryFiles();
    })
}

function readSourceCodeFiles(){
  const folder = './dist/browser/';
  fs.readdir(folder, (err, files) => {
    files.forEach(file => {
      if(path.extname(file) === '.js' || path.extname(file) === '.css'){
         upload(file, 'dist/browser/', 'cdn/');
      }
    });
  })
}

function readLibraryFiles(){
  const folder = './src/assets/';
  fs.readdir(folder, (err, files) => {
    files.forEach(file => {
      if(path.extname(file) === '.js' || path.extname(file) === '.json'){
        upload(file, 'src/assets/', 'cdn/');
      }
    });
  });
}

clear();
