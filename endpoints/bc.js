(function () {

  const response = {
    code: 200,
    description: 'OK',
    ubcLite: null
  };

  const dataForBC  = {
    name: '',
    lastName: '',
    workPosition: '',
    countryCode: '',
    whatsApp: '',
    email: '',
    companyName: '',
    website: '',
    urlLogo: '',
    urlLogoThumbnail: '',
    cardUrl: '',
    cardUrlThumbnail: ''
  };

  process.on('message', (data) => {
    parseInfo(data);
  });

  function parseInfo(data) {
    const path = require('path');
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;

    try {
      dataForBC.name = data.name;
      dataForBC.lastName = data.lastName;
      dataForBC.companyName = data.company;
      dataForBC.workPosition = data.workPosition;
      dataForBC.whatsApp = data.phone;
      dataForBC.email = data.email;
      dataForBC.countryCode = data.countryCode;
      dataForBC.industryCode = data.industryCode;
      dataForBC.website = data.website || null;
      dataForBC.urlLogo = data.profileImage || 'https://www.googleapis.com/download/storage/v1/b/businesscardgcs/o/alex4%2F2019-02-25-193347461favicon.png?generation=1551123227641233&alt=media';
      dataForBC.urlLogoThumbnail = data.profileImageThumbnail || 'https://lh3.googleusercontent.com/-3ntbjcrEgMf8ekZz7lLWXZFQKTte5FeDr9xBzhAh5S5IhdVSjM4scB-Dz5U8-lhR-4hxYdDfgb0grvajnJo-LG78ZMFjDm4Qw';

      JSDOM.fromFile(path.resolve(__dirname, 'templates', 'bc.html')).then(jsdom => {
        const document = jsdom.window.document;
        document.getElementById('image').src = dataForBC.urlLogoThumbnail;
        document.getElementById('company').textContent = dataForBC.company;
        document.getElementById('name').textContent = dataForBC.name + ' ' + dataForBC.lastName;
        document.getElementById('workPosition').textContent = dataForBC.workPosition;
        document.getElementById('phone').textContent = dataForBC.countryCode + dataForBC.phone;
        if(!dataForBC.website){
          document.getElementById('website').innerHTML = '';
        }else{
          document.getElementById('website').getElementsByClassName('text')[0].textContent = dataForBC.website;
        }
        makeScreenShot(jsdom.serialize());
      });

    }catch (e){
      console.error(e);
      response.code = 500;
      response.description = 'Internal server error';
      finish(response);
    }


  }

  function makeScreenShot(html) {
    const webShot = require('webshot');
    const renderStream = webShot(html, {siteType:'html', shotSize: { width: 900, height: 500 }});
    let chunks = [];
    renderStream.on('data', function(chunk) {
      chunks.push(chunk);
    });
    renderStream.on('end', function() {
      const result = Buffer.concat(chunks);
      uploadImage(result);
    });
  }

  function uploadImage(blob) {
    const formData = {
      file: {
        value: blob,
        options: {
          filename: 'bc'+new Date().getTime()+'.png',
          contentType: 'image/png'
        }
      }
    };
    const request = require('request');
    request.post({
      url: 'https://business-card-74ca5.appspot.com/upload',
      formData: formData,
      json: true
    }, function (err,httpResponse,body) {
      if(err){
        console.error(err);
        response.code = 500;
        response.description = 'Internal server error';
        finish(response);
      }
      if(body.success === 'true'){
        dataForBC.cardUrl = body.mainUrl;
        dataForBC.cardUrlThumbnail = body.secondaryUrl;
        createBusinessCard();
      }else{
        response.code = 500;
        response.description = 'Internal server error';
        finish(response);
      }
    });
  }

  function createBusinessCard() {
    const request = require('request');

    const body = {
      industryCode: dataForBC.industryCode,
      cardThumbnail: dataForBC.cardThumbnail,
      cardUrl: dataForBC.cardUrl,
      countryCode: dataForBC.countryCode,
      companyName: dataForBC.companyName,
      email: dataForBC.email,
      lastName: dataForBC.lastName,
      name: dataForBC.name,
      urlLogo: dataForBC.urlLogo,
      urlLogoThumbnail: dataForBC.urlLogoThumbnail,
      website: dataForBC.website,
      whatsApp: dataForBC.phone,
      workPosition: dataForBC.workPosition
    };

    request.post({
      url: 'https://business-card-74ca5.appspot.com/_ah/api/apibc/v1/createUserBCard',
      body: body,
      json: true
    }, function (err,httpResponse,body) {
      if(err){
        console.error(err);
        response.code = 500;
        response.description = 'Internal server error';
        finish(response);
      }
      if(body.code === 200) {
        response.ubcLite = {
          id: body.ubcLite.id,
          userId: body.ubcLite.userId,
          cardThumbnail: dataForBC.cardUrlThumbnail,
          dynamicLink: body.ubcLite.dynamicLink,
          dynamicSignIn: body.ubcLite.dynamicSignIn
        };
        finish(response);
      }else{
        response.code = 500;
        response.description = 'Internal server error';
        finish(response);
      }
    });
  }

  function finish(response) {
    process.send(response);
  }

})();
