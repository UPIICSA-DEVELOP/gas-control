(function () {

  const response = {
    code: 200,
    description: 'OK'
  };

  process.on('message', (data) => {
    parseInfo(data);
  });

  function parseInfo(data) {
    const path = require('path');
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const userInfo = {
      imageUrl:  data.imageUrl || 'https://inspector-maplander-develop.appspot.com/favicon.png',
      company:  data.company || '',
      name:  data.name || '',
      workPosition: data.workPosition || '',
      phone:  data.phone || '',
      email:  data.email || '',
      website:  data.website || ''
    };
    JSDOM.fromFile(path.resolve(__dirname, 'templates', 'bc.html')).then(jsdom => {
      const document = jsdom.window.document;
      document.getElementById('image').src = userInfo.imageUrl;
      document.getElementById('company').textContent = userInfo.company;
      document.getElementById('name').textContent = userInfo.name;
      document.getElementById('workPosition').textContent = userInfo.workPosition;
      document.getElementById('phone').textContent = userInfo.phone;
      if(userInfo.website === ''){
        document.getElementById('website').innerHTML = '';
      }else{
        document.getElementById('website').getElementsByClassName('text')[0].textContent = userInfo.website;
      }
      makeScreenShot(jsdom.serialize());
    });
  }

  function makeScreenShot(html) {
    const webshot = require('webshot');
    const renderStream = webshot(html, {siteType:'html', shotSize: { width: 900, height: 500 }});
    let chunks = [];
    renderStream.on('data', function(chunk) {
      chunks.push(chunk);
    });
    renderStream.on('end', function() {
      const result = Buffer.concat(chunks);
      response.image = result.toString('binary');
      finish(response);
    });
  }

  function finish(response) {
    process.send(response);
  }

})();
