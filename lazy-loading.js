/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

const fs = require('fs'), path = require('path');

(function () {

  const tags = [
    '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">',
    '<link rel="stylesheet" href="styles.css">'
  ];

  let index = fs.readFileSync(path.resolve(__dirname, 'dist/browser/index.html'), 'utf8').toString();

  tags.forEach(tag => {
    index = index.replace(tag, '');
  });

  const script = `
  <script>
  (function () {
    const urls = [
      'https://fonts.googleapis.com/icon?family=Material+Icons',
      'styles.css'
    ];
    urls.forEach(url => {
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      const insert = document.getElementsByTagName('link')[0];
      insert.parentNode.insertBefore(link, insert);
    })
  })();
  </script>
  `;

  index = index.replace('<!-- lazy -->', script);

  fs.unlinkSync(path.resolve(__dirname, 'dist/browser/index.html'));

  fs.writeFile(path.resolve(__dirname, 'dist/browser/index.html'), index, (err) => {
    if(err){
      return console.error(err);
    }
  });



})();


