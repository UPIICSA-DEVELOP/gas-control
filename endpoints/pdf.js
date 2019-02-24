

(function () {

  const types = [
    'attached-1.html',
    'attached-2.html',
    'attached-3.html',
    'attached-4.html',
    'attached-5.html'
  ];

  const response = {
    code: 200,
    description: 'OK'
  };

  process.on('message', (data) => {
    init(data);
  });

  function init(data) {
    const type = Number(data.attachedType);
    if(type > 0 && type < 6){
      const obj = types[type - 1];
      if(obj){
        parseHTML(type, obj);
      }else{
        response.description = 'Internal Server Error: Error occurred, try again';
        response.code = 500;
        finish(response);
      }
    }else{
      response.description = 'Bad request: attachedType is a invalid type [1-5], consult https://inspector-maplander-develop.appspot.com/endpoints/v1/api-docs';
      response.code = 400;
      finish(response);
    }

  }


  function parseHTML(type, fileName) {
    const path = require('path');
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    let items = '';
    switch (type){
      case 1: // Attached 1
        JSDOM.fromFile(path.resolve(__dirname, 'templates', fileName)).then(jsdom => {
          const document = jsdom.window.document;
          // List
          for(let x = 0; x < 20; x++){
            const item = document.getElementById('item');
            const name = item.getElementsByClassName('name')[0];
            const workPosition = item.getElementsByClassName('workPosition')[0];
            name.textContent = 'Alejandro Lopez Arreola';
            workPosition.textContent = 'CEO';
            //TODO: Add signature src
            items += item.innerHTML;
          }
          // Footer
          const businessName = document.getElementsByClassName('businessName')[0];
          businessName.textContent = 'ALX Developer S.A de C.V';
          const cre = document.getElementsByClassName('cre')[0];
          cre.textContent = '23EU293J 237 SJC';
          // Adding items to list
          const list = document.getElementById('list');
          list.innerHTML = items;
          makePDF(jsdom.serialize());
        });
        break;
      case 2: // Attached 2
        JSDOM.fromFile(path.resolve('templates', fileName)).then(jsdom => {
          const document = jsdom.window.document;
          // List
          for(let x = 1; x < 21; x++){
            const item = document.getElementById('item');
            const title = item.getElementsByClassName('title')[0];
            const capacity = item.getElementsByClassName('capacity')[0];
            const typeFuel = item.getElementsByClassName('typeFuel')[0];
            title.textContent = 'Tanque ' + x;
            capacity.textContent = '30 000 lt';
            typeFuel.textContent = 'Diésel';
            items += item.innerHTML;
          }
          // Footer
          const businessName = document.getElementsByClassName('businessName')[0];
          businessName.textContent = 'ALX Developer S.A de C.V';
          const cre = document.getElementsByClassName('cre')[0];
          cre.textContent = '23EU293J 237 SJC';
          // Adding items to list
          const list = document.getElementById('list');
          list.innerHTML = items;
          makePDF(jsdom.serialize());
        });
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
    }
  }

  function makePDF(html) {
    const pdf = require('html-pdf');
    const options = { format: 'Letter' };
    pdf.create(html, options).toBuffer(function(err, buffer){
      if(err){
        response.code = 500;
        response.description = 'Internal Server Error: Error occurred, try again';
        finish(response);
      }else{
        response.file = buffer.toString('binary');
        finish(response);
      }
    });
  }


  function finish(response) {
    process.send(response);
  }

})();
