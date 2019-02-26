

(function () {

  const response = {
    code: 200,
    description: 'OK'
  };

  process.on('message', (data) => {
    init(data);
  });

  function init(data) {
    const type = Number(data.attachedType);
    if(type > 0 && type < 7){
      let fileName = 'attached-' + type + '.html';
      if(type === 6){
        fileName = 'signatures.html';
      }
      parseHTML(type, fileName);
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
            const name = document.getElementById('name');
            const workPosition = document.getElementById('workPosition');
            const signature = document.getElementById('signature');
            name.textContent = 'Pedro Alejandro Lopez Arreola Hernandez';
            workPosition.textContent = 'CEO';
            signature.src = 'https://lh3.googleusercontent.com/IhHSqxjzSXuZpr8DDDJvKDWgl8Ctt48XwEqvX0tEPXiOyYTWlC_QzhcuRcOjS3EXaSiF_yn5MwF2XQ6a74zC-MEcHBAUR1I-';
            const item = document.getElementById('item-to-select');
            items += item.innerHTML;
          }
          const list = document.getElementById('list');
          list.innerHTML = items;
          makePDF(jsdom.serialize());
        });
        break;
      case 2: // Attached 2
        JSDOM.fromFile(path.resolve(__dirname, 'templates', fileName)).then(jsdom => {
          const document = jsdom.window.document;
          // List
          for(let x = 1; x < 21; x++){
            const title = document.getElementById('title');
            const capacity = document.getElementById('capacity');
            const typeFuel = document.getElementById('typeFuel');
            title.textContent = 'Tanque ' + x;
            capacity.textContent = '30 000 lt';
            typeFuel.textContent = 'Diésel';
            const item = document.getElementById('item-to-select');
            items += item.innerHTML;
          }
          const list = document.getElementById('list');
          list.innerHTML = items;
          makePDF(jsdom.serialize());
        });
        break;
      case 3: // Attached 3
        JSDOM.fromFile(path.resolve(__dirname, 'templates', fileName)).then(jsdom => {
          const document = jsdom.window.document;
          // List
          for(let x = 1; x < 21; x++){
            const name = document.getElementById('name');
            const workPosition = document.getElementById('workPosition');
            name.textContent = x + '. ' + 'Alejandro Lopez Arreola';
            workPosition.textContent = 'Cargo en la brigada: '+'CEO';
            const item = document.getElementById('item-to-select');
            items += item.innerHTML;
          }
          const list = document.getElementById('list');
          list.innerHTML = items;
          makePDF(jsdom.serialize());
        });
        break;
      case 5: // Attached
        JSDOM.fromFile(path.resolve(__dirname, 'templates', fileName)).then(jsdom => {
          const document = jsdom.window.document;

          makePDF(jsdom.serialize());
        });
        break;
      case 6: // Signatures
        JSDOM.fromFile(path.resolve(__dirname, 'templates', fileName)).then(jsdom => {
          const document = jsdom.window.document;

          makePDF(jsdom.serialize());
        });
        break;
      default:
        response.code = 404;
        response.description = 'Not Found, invalid option';
        finish(response);
        break;
    }
  }

  function makePDF(html) {
    const pdf = require('html-pdf');
    const options = {
      format: 'Letter',
      "border": {
        "top": "4.5mm",
        "right": "4.5mm",
        "bottom": "4.5mm",
        "left": "4.5mm"
      },
      "header": {
        "height": "17mm",
        "contents": `
          <div style="width: 100%; height: 100%;">
           <img style="width: 48px; position: absolute; right: 95px;" src="https://lh3.googleusercontent.com/oFh60mqDiisIc6tzMZ-Q5KJ-QvKugmUhh0yg6N5gdKuiEgTc96yfXIdksqWD8ODG0LOi2aAP9pz0Zzqm9rsXertP9pnNqo1mzQ">
         </div>
        `
      },
      "footer": {
        "height": "14mm",
        "contents": {
          default: `
          <span style="width: 100%; text-align: center; display: block;">
            <span style="display: inline-block; width: 50%; text-align: center;">
              <span style="color: #002364;">Razón social</span>
              <br>
              <span style="color: #194592;">Cum assimilatio resistere, omnes cobaltumes</span>
            </span>
            <span style="display: inline-block; width: 49%; text-align: center;">
              <span style="color: #002364;">No. de permiso CRE</span>
              <br>
              <span style="color: #194592;">Silva salvus lumen est.</span>
            </span>
          </span>
          `,
        }
      }
    };
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
