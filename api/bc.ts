import {BCData} from './commons/interfaces';
import {APIError, DefaultResponse} from './commons/class';

export class BC{


  /**
   *
   * @deprecated
   *
   * */

  private static DEFAULT_PROFILE_IMAGE = {
    original: 'https://www.googleapis.com/download/storage/v1/b/businesscardgcs/o/alex4%2F2019-02-25-193347461favicon.png?generation=1551123227641233&alt=media',
    thumbnail: 'https://lh3.googleusercontent.com/-3ntbjcrEgMf8ekZz7lLWXZFQKTte5FeDr9xBzhAh5S5IhdVSjM4scB-Dz5U8-lhR-4hxYdDfgb0grvajnJo-LG78ZMFjDm4Qw'
  };
  private _data: any;

  constructor(){
  }

  /**
   *
   * @deprecated
   *
   * */
  public async init(data: BCData): Promise<DefaultResponse | APIError>{
    this._data = {
      name: data.name || '',
      lastName: data.lastName || '',
      workPosition: data.workPosition || '',
      countryCode: data.countryCode || '',
      whatsApp: data.phone || '',
      email: data.email || '',
      companyName: data.company || '',
      industryCode: data.industryCode || '',
      website: data.website || '',
      urlLogo: data.profileImage || BC.DEFAULT_PROFILE_IMAGE.original,
      urlLogoThumbnail: data.profileImageThumbnail || BC.DEFAULT_PROFILE_IMAGE.thumbnail,
      cardUrl: data.cardUrl || '',
      cardUrlThumbnail: data.cardUrlThumbnail || '',
      bCardId: data.bCardId
    };
    return await this.createBC();
  }


  private async createBC(): Promise<DefaultResponse | APIError>{

    let response, bCard, newBCardFile, bCardIdNotExist = false;

    try {
      response = await this.parseInfo();

      response = await this.makeScreenShot(response);

      response = await this.uploadImage(response);

      newBCardFile = response;

      const body = {
        industryCode: this._data.industryCode,
        cardUrl: newBCardFile.mainUrl,
        cardThumbnail: newBCardFile.secondaryUrl,
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

      if(this._data.bCardId){
        response = await this.getBusinessCard(this._data.bCardId);
        switch(response.code){
          case 1:
            bCard = response.bCard;
            bCard.name.text = this._data.name;
            bCard.email.text = this._data.email;
            bCard.lastName.text = this._data.lastName;
            bCard.whatsApp.text = this._data.whatsApp;
            bCard.companyName.text = this._data.companyName;
            bCard.webSite.text = this._data.website;
            bCard.workPosition.text = this._data.workPosition;
            bCard.logo.thumbnail = this._data.urlLogoThumbnail;
            bCard.cardUrl = newBCardFile.mainUrl;
            bCard.cardThumbnail = newBCardFile.secondaryUrl;
            response = await this.updateBusinessCard(bCard);
            break;
          case 3:
            bCardIdNotExist = true;
            response  = await this.createBusinessCard(body);
            break;
          default:
            return new APIError('Bad Request ' + JSON.stringify(response), 400);
        }
      }else{
        response  = await this.createBusinessCard(body);
      }


      let item;

      if(this._data.bCardId && !bCardIdNotExist){

        switch (response.code){
          case 1:
            item = {
              id: response.bCard.id,
              userId: response.bCard.userId,
              cardThumbnail: body.cardThumbnail,
              dynamicLink: response.bCard.dynamicLink,
              dynamicSignIn: undefined
            };
            break;
          default:
            return new APIError('Bad Request ' + JSON.stringify(response), 400);
        }

      }else{
        item = {
          id: response.ubcLite.id,
          userId: response.ubcLite.userId,
          cardThumbnail: body.cardThumbnail,
          dynamicLink: response.ubcLite.dynamicLink,
          dynamicSignIn: response.ubcLite.dynamicSignIn
        };
      }

      return new DefaultResponse(item);

    } catch (e) {
      return new APIError(e, 500);
    }


  }

  private async parseInfo(): Promise<string | Error>{
    const path = require('path');
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    let jsDom;
    try {

      jsDom =  await JSDOM.fromFile(path.resolve(__dirname, 'templates', 'bc.html'));
      const document = jsDom.window.document;
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

      return jsDom.serialize();

    }catch (e){
      return new Error(e.message);
    }

  }

  private makeScreenShot(html: string): Promise<Buffer | Error>{
    const webShot = require('webshot');
    const renderStream = webShot(html, {siteType:'html', shotSize: { width: 900, height: 500 }});
    return new Promise<Buffer>((resolve, reject) => {
      let chunks = [];
      renderStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      renderStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      renderStream.on('error', () => {
       reject(new Error('An error occurred'));
      });
    });
  }

  private uploadImage(blob: Buffer): Promise<any>{
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
    return new Promise<any>((resolve, reject) => {
      request.post({
        url: 'https://business-card-74ca5.appspot.com/upload',
        formData: formData,
        json: true
      }, (err,httpResponse,body) => {
        if(err){
          reject(new Error(err));
        }
        if(httpResponse.statusCode === 200){
         resolve(body);
        }else{
          reject(new Error('An error occurred'));
        }
      });
    });
  }

  private createBusinessCard(body: any): Promise<any>{
    const request = require('request');
    return new Promise<any>((resolve, reject) => {
      request.post({
        url: 'https://business-card-74ca5.appspot.com/_ah/api/apibc/v1/createUserBCard',
        body: body,
        json: true
      }, (err,httpResponse,body) => {
        if(err){
          reject(new Error('An error occurred'));
        }
        if(httpResponse.statusCode === 200) {
          resolve(body);
        }else{
          reject(new APIError('An error occurred ' + JSON.stringify(body), 400));
        }
      });
    });
  }

  private async updateBusinessCard(body: any): Promise<any>{
    const request = require('request');
    return new Promise<any>((resolve, reject) => {
      request.put({
        url: 'https://business-card-74ca5.appspot.com/_ah/api/communicationchannel/v1/updateBCard',
        json: body
      }, (err,httpResponse,body) => {
        if(err){
          reject(new Error('An error occurred'));
        }
        if(httpResponse.statusCode === 200) {
          resolve(body);
        }else{
          reject(new APIError('An error occurred ' + JSON.stringify(body), 400));
        }
      });
    });
  }

  private async getBusinessCard(id: string): Promise<any>{
    const request = require('request');
    return new Promise<any>((resolve, reject) => {
      request.get({
        url: `https://business-card-74ca5.appspot.com/_ah/api/communicationchannel/v1/getBCard?id=${id}`,
        json: true
      }, (err,httpResponse,body) => {
        if(err){
          reject(new Error('An error occurred'));
        }
        if(httpResponse.statusCode === 200) {
          resolve(body);
        }else{
          reject(new APIError('An error occurred ' + JSON.stringify(body), 400));
        }
      });
    });
  }



}

process.on('message', (data: BCData) => {
  const bc = new BC();
  bc.init(data).then(response => {
    process.send(response);
    process.exit(0);
  }).catch(error => {
    process.send(error);
    process.exit(0);
  });
});
