import {BCData} from './pdf/utils';

export class BC{

  private _response: any;
  private _data: BCData;

  constructor(data: BCData){
    this._response = {
      code: 200,
      description: 'OK',
      item: null
    };
    this._data = data;
    this.parseInfo();
  }


  private parseInfo(): void{
    const path = require('path');
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    try {

      JSDOM.fromFile(path.resolve(__dirname, 'templates', 'bc.html')).then(jsdom => {
        const document = jsdom.window.document;
        document.getElementById('image').src = this._data.urlLogoThumbnail;

        const company = this._data.companyName;
        document.getElementById('company').textContent = company;
        if(company.length <= 24){
          document.getElementById('company').insertAdjacentHTML('afterbegin', '<br>');
        }

        const name = this._data.name + ' ' + this._data.lastName;
        document.getElementById('name').textContent = name;
        if(name.length <= 30){
          document.getElementById('name').insertAdjacentHTML('afterbegin', '<br>');
          document.getElementById('company-parent').style.top  = '20.11%';
        }

        document.getElementById('workPosition').textContent = this._data.workPosition;
        document.getElementById('phone').textContent = this._data.countryCode + this._data.whatsApp;
        document.getElementById('email').textContent = this._data.email;
        if(!this._data.website){
          document.getElementById('website').innerHTML = '';
        }else{
          document.getElementById('website-text').textContent = this._data.website;
        }
        this.makeScreenShot(jsdom.serialize());
      });

    }catch (e){
      console.error(e);
      this._response.code = 500;
      this._response.description = 'Internal server error';
      BC.finish(this._response);
    }

  }

  private makeScreenShot(html: string): void{
    const webShot = require('webshot');
    const renderStream = webShot(html, {siteType:'html', shotSize: { width: 900, height: 500 }});
    let chunks = [];
    renderStream.on('data', function(chunk) {
      chunks.push(chunk);
    });
    renderStream.on('end', function() {
      const result = Buffer.concat(chunks);
      this.uploadImage(result);
    });
  }

  private uploadImage(blob: any): void{
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
    }, (err,httpResponse,body) => {
      if(err){
        console.error(err);
        this._response.code = 500;
        this._response.description = 'Internal server error';
        BC.finish(this._response);
      }
      if(body.success === 'true'){
        this._data.cardUrl = body.mainUrl;
        this._data.cardUrlThumbnail = body.secondaryUrl;
        this.createBusinessCard();
      }else{
        this._response.code = 500;
        this._response.description = 'Internal server error';
        BC.finish(this._response);
      }
    });
  }

  private createBusinessCard(): void{
    const request = require('request');

    const body = {
      industryCode: this._data.industryCode,
      cardThumbnail: this._data.cardUrlThumbnail,
      cardUrl: this._data.cardUrl,
      countryCode: this._data.countryCode,
      companyName: this._data.companyName,
      email: this._data.email,
      lastName: this._data.lastName,
      name: this._data.name,
      urlLogo: this._data.urlLogo,
      urlLogoThumbnail: this._data.urlLogoThumbnail,
      website: this._data.website,
      whatsApp: this._data.whatsApp,
      workPosition: this._data.workPosition
    };

    request.post({
      url: 'https://business-card-74ca5.appspot.com/_ah/api/apibc/v1/createUserBCard',
      body: body,
      json: true
    }, (err,httpResponse,body) => {
      if(err){
        console.error(err);
        this._response.code = 500;
        this._response.description = 'Internal server error';
        BC.finish(this._response);
      }
      if(body.code === 200) {
        this._response.item = {
          id: body.ubcLite.id,
          userId: body.ubcLite.userId,
          cardThumbnail: this._data.cardUrlThumbnail,
          dynamicLink: body.ubcLite.dynamicLink,
          dynamicSignIn: body.ubcLite.dynamicSignIn
        };
        BC.finish(this._response);
      }else{
        this._response.code = 500;
        this._response.description = 'Internal server error';
        BC.finish(this._response);
      }
    });
  }

  private static finish(response: any){
    process.send(response);
  }

}

process.on('message', (data: BCData) => {
  new BC(data);
});
