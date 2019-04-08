
export class Commons{

  private static PROXY_NAME = 'inSpector Proxy/1.0.0';

  public joinPDF(arrayBuffers: any[]): Promise<Buffer>{
    const hummus = require('hummus');
    const memoryStreams = require('memory-streams');
    return new Promise((resolve, reject) => {
      const outStream = new memoryStreams.WritableStream();
      try {
        const hummusOutStream = new hummus.PDFStreamForResponse(outStream);

        const firstPDF = new hummus.PDFRStreamForBuffer(arrayBuffers.shift());
        // This throws with "Unable to modify PDF file, make sure that output file target..."
        const pdfWriter = hummus.createWriterToModify(firstPDF, hummusOutStream);

        for (const pdf of arrayBuffers) {
          try {
            const stream = new hummus.PDFRStreamForBuffer(pdf);
            pdfWriter.appendPDFPagesFromPDF(stream)
          } catch (e) {
            outStream.end();
          }
        }
        pdfWriter.end();
        outStream.end();
        resolve(outStream.toBuffer());
      }
      catch(e){
        outStream.end();
        reject(e);
        throw new Error('Error during PDF combination: ' + e.message);
      }
    });
  }

  public static async splitPDF(buffer: Buffer, numPagesByFile?: number): Promise<Buffer[]>{
    const buffers: Buffer[] = [];
    const pdfjsLib = require('pdfjs-dist');
    const pdf = await pdfjsLib.getDocument(buffer);
    let numPages: number = (pdf.numPages - 1);
    let continueDoc: boolean = true;
    const pages = (!numPagesByFile)?20:numPagesByFile;
    let range = [0, pages - 1];
    const hummus = require('hummus');
    const memoryStreams = require('memory-streams');
    do {
      const outStream = new memoryStreams.WritableStream();
      try {
        const hummusOutStream = new hummus.PDFStreamForResponse(outStream);
        const pdf = new hummus.PDFRStreamForBuffer(buffer);
        const pdfWriter = hummus.createWriter(hummusOutStream);
        pdfWriter.appendPDFPagesFromPDF(pdf, {type: hummus.eRangeTypeSpecific, specificRanges: [range]});
        pdfWriter.end();
        outStream.end();
      }
      catch (e) {
        outStream.end();
        throw new Error('Error during PDF combination: ' + e.message);
      }
      buffers.push(outStream.toBuffer());
      range[0] = range[1] + 1;
      if (range[1] === numPages) {
        continueDoc = false;
      } else if ((range[1] + pages) > numPages) {
        const p = (range[1] + pages) - numPages;
        const f = pages - p;
        range[1] = range[1] + f;
      } else {
        range[1] = range[1] + pages;
      }
    } while (continueDoc);
    return buffers;
  }


  public buildPDF(html: any, pageSize?: string): Promise<Buffer>{
    return new Promise((resolve, reject) => {
      try {
        const puppeteer = require('puppeteer');
        (async () => {
          const browser = await puppeteer.launch({headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox']});
          const page = await browser.newPage();
          await page.setContent(html);
          const pdf = await page.pdf({
            format: pageSize ? pageSize : 'A4'
          });
          await browser.close();
          resolve(pdf);
        })();
      }catch (e){
        console.error('buildPDF', e.message);
        reject(e);
      }
    });
  }


  public request(url, method?: string, data?: any, form?: boolean, body?: boolean): Promise<any>{
    return new Promise((resolve, reject) => {
      const request = require('request');
      let options;
      if(method === 'POST'){
        if(form){
          options = {url: url, json: true, method: 'POST', formData: data, headers: {'User-Agent': Commons.PROXY_NAME} };
        }else{
          if(body){
            options = {url: url, json: true, method: 'POST', body: data,  headers: {'User-Agent': Commons.PROXY_NAME}};
          }else{
            options = {url: url, json: true, method: 'POST', form: data,  headers: {'User-Agent': Commons.PROXY_NAME}};
          }
        }
      }else{
        options = {url: url, json: true};
      }
      request(options, (err, res, body) => {
        if(err){
          reject(err);
        }
        resolve(body);
      });
    });
  }

  public downloadFile(url: string): Promise<any>{
    return new Promise((resolve, reject) => {
      const request = require('request');
      request({url: url, encoding:null, headers: {'User-Agent': Commons.PROXY_NAME}}, (err, res, body) => {
        if(err){
          console.error(err);
          reject(err);
        }
        resolve({response: res, body: body});
      });
    });
  }

  public static searchObject(array: any[], key: string, value: any): any{
    let obj = null;
    array.forEach(item => {
      if(item[key] === value){
        obj = item;
      }
    });
    return obj;
  }

  public static async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  public static bubbleSort(array: any[], key: string)
  {
    let swapped;
    do {
      swapped = false;
      for (let i=0; i < array.length-1; i++) {
        if (array[i][key] > array[i+1][key]) {
          let temp = array[i];
          array[i] = array[i+1];
          array[i+1] = temp;
          swapped = true;
        }
      }
    } while (swapped);
  }


  static createTimeString(date: string): string{
    try{
      if(date.length < 4){
        switch (date.length){
          case 1:
            date = '000' + date;
            break;
          case 2:
            date = '00' + date;
            break;
          case 3:
            date = '0' + date;
            break;
        }
      }
      let time;
      let hr;
      let min;
      time = Number(date);
      hr = date.slice(0,2);
      min = date.slice(2);
      if(hr>12){
        hr = hr-12
      }
      hr = hr.toString();
      if(hr === '00'){
        hr='12';
      }
      hr = hr.length===2?hr:'0'+hr;
      const format = (time >= 0 && time < 1200)? ' a.m.':' p.m.';
      return hr + ':' + min + format;
    }catch (e){
      console.error('createTimeString', e.message);
      return null;
    }
  }

  static convertDate(date: number): string[]{
    /**
     *
     * @return string[]
     *
     * Position 0: Day
     * Position 1: Month
     * Position 2: Year
     * */
    let result = [];
    try {
      const dateForSplit = "" + date;
      const year = dateForSplit.slice(0, 4);
      let month = dateForSplit.slice(4, 6);
      const day = dateForSplit.slice(6, 8);
      switch (month) {
        case '01':
          month = 'ene';
          break;
        case '02':
          month = 'feb';
          break;
        case '03':
          month = 'mar';
          break;
        case '04':
          month = 'abr';
          break;
        case '05':
          month = 'may';
          break;
        case '06':
          month = 'jun';
          break;
        case '07':
          month = 'jul';
          break;
        case '08':
          month = 'ago';
          break;
        case '09':
          month = 'sep';
          break;
        case '10':
          month = 'oct';
          break;
        case '11':
          month = 'nov';
          break;
        case '12':
          month = 'dic';
          break;
      }
      result.push(day.toString());
      result.push(month.toString());
      result.push(year.toString());
      return result;
    } catch (e) {
      console.error('convertDate', e.message);
      return null;
    }

  }

  public static formatFolio(value: string): string{
    try {
      switch (value.length){
        case 1:
          value = '00000'+value;
          break;
        case 2:
          value = '0000'+value;
          break;
        case 3:
          value = '000'+value;
          break;
        case 4:
          value = '00'+value;
          break;
        case 5:
          value = '0'+value;
          break;
      }
      return value;
    }catch (e){
      console.error('formatFolio', e.message);
      return null;
    }
  }

  static setEncrypt(keys: any, value: any): string{
    const CryptoJS = require('crypto-js');
    try{
      const key = CryptoJS.enc.Utf8.parse(keys);
      const iv = CryptoJS.enc.Utf8.parse(keys);
      const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
        {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
      return encrypted.toString();
    }catch (e){
      console.error(e);
      return null;
    }
  }

  static getDecrypt(keys: any, value: any): string{
    const CryptoJS = require('crypto-js');
    try{
      const key = CryptoJS.enc.Utf8.parse(keys);
      const iv = CryptoJS.enc.Utf8.parse(keys);
      const decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    }catch (e){
      console.error(e);
      return null;
    }
  }

}
