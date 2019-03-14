
export interface ParseHTMLOptions{
  option: AttachedType,
  fileName: string,
  titleCoverAttached?: any
}

export interface CreatePDFOptions{
  option: AttachedType,
  titleCoverAttached?: any
}

export enum AttachedType{
  Cover = 0,
  Attached_1 = 1,
  Attached_2 = 2,
  Attached_3 = 3,
  Attached_5 = 5,
  Signatures = 6,
  Cover_Attached = 7
}

class PdfGenerator{

  private _response: any;
  private _countNumPages: number;

  constructor(){
    this._countNumPages = 59;
    this._response = {
      code: 200,
      description: 'OK'
    };
    this.init();
  }

  private init(): void{


    const buffers = [];

    this.createPDF({option: 0, titleCoverAttached: ''}).then(buffer => {
      buffers.push(buffer);
      return this.downloadFile('https://storage.googleapis.com/schedule-maplander.appspot.com/cdn/SASISOPA%20INSPECTOR%20(contenido).pdf'); // Download big attached
    }).then(response => {
      buffers.push(response);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 1}); // Cover attached 1
    }).then((res) => {
      buffers.push(res);
      return this.createPDF({option: AttachedType.Attached_1});  // Attached 1
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 2}); // Cover attached 2
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Attached_2}) // Attached 2
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 3}); // Cover attached 3
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Attached_3}); // Attached 3
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 4}); // Cover attached 4
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 5});// Cover attached 5
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Attached_5}); // Attached 5
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 6});// Cover attached 6
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 7});// Cover attached 7
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 8}); // Cover attached 8
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 9}); // Cover attached 9
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 10}); // Cover attached 10
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 11}); // Cover attached 11
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Signatures})  // Signatures
    }).then(buffer => {
      buffers.push(buffer);
      return this.joinPDF(buffers);
    }).then(finalBuffer => {
      this._response.file = finalBuffer.toString('binary');
      PdfGenerator.finish(this._response);
    });
  }


  private createPDF(options: CreatePDFOptions): Promise<any>{
    return new Promise((resolve) => {
      let fileName;
      switch (options.option){
        case AttachedType.Cover:
          fileName = 'cover.html';
          break;
        case AttachedType.Signatures:
          fileName = 'signatures.html';
          break;
        case AttachedType.Cover_Attached:
          fileName = 'cover-attached.html';
          break;
        default:
          fileName = 'attached-' + options.option + '.html';
          break;
      }
      this.parseHTML({option: options.option, fileName: fileName, titleCoverAttached: options.titleCoverAttached}).then((result) => {
        return this.buildPDF(result);
      }).then((buffer) => {
        resolve(buffer);
      });
    });
  }

  private parseHTML(options: ParseHTMLOptions): Promise<any>{
    return new Promise((resolve) => {
      const path = require('path');
      const jsdom = require("jsdom");
      const { JSDOM } = jsdom;
      let items = '';
      switch (options.option){
        case AttachedType.Cover:
          JSDOM.fromFile(path.resolve(__dirname, 'templates', options.fileName)).then(jsdom => {
            const document = jsdom.window.document;
            document.getElementById('businessName').textContent = 'ALX Developer S de R.L de C.V';
            resolve(jsdom.serialize());
          });
          break;
        case AttachedType.Attached_1: // Attached 1
          JSDOM.fromFile(path.resolve(__dirname, 'templates', options.fileName)).then(jsdom => {
            const document = jsdom.window.document;
            // List
            for(let x = 0; x < 20; x++){
              const name = document.getElementById('name');
              const workPosition = document.getElementById('workPosition');
              const signature = document.getElementById('signature');
              name.textContent = 'Pedro Alejandro Lopez Arreola Hernandez Caballero del Monte (jajaja)';
              workPosition.textContent = 'CEO';
              signature.src = 'https://lh3.googleusercontent.com/IhHSqxjzSXuZpr8DDDJvKDWgl8Ctt48XwEqvX0tEPXiOyYTWlC_QzhcuRcOjS3EXaSiF_yn5MwF2XQ6a74zC-MEcHBAUR1I-';
              const item = document.getElementById('item-to-select');
              items += item.innerHTML;
            }
            const list = document.getElementById('list');
            list.innerHTML = items;
            resolve(jsdom.serialize());
          });
          break;
        case AttachedType.Attached_2: // Attached 2
          JSDOM.fromFile(path.resolve(__dirname, 'templates', options.fileName)).then(jsdom => {
            const document = jsdom.window.document;
            // List
            for(let x = 1; x < 21; x++){
              const tr = document.createElement('tr');
              const number = document.createElement('td');
              const capacity = document.createElement('td');
              const typeFuel = document.createElement('td');
              number.textContent = x;
              capacity.textContent = '30 000 lt';
              typeFuel.textContent = 'Diésel';
              tr.appendChild(number);
              tr.appendChild(capacity);
              tr.appendChild(typeFuel);
              document.getElementById('table').appendChild(tr);
            }
            resolve(jsdom.serialize());
          });
          break;
        case AttachedType.Attached_3: // Attached 3
          JSDOM.fromFile(path.resolve(__dirname, 'templates', options.fileName)).then(jsdom => {
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
            resolve(jsdom.serialize());
          });
          break;
        case AttachedType.Attached_5: // Attached
          JSDOM.fromFile(path.resolve(__dirname, 'templates', options.fileName)).then(jsdom => {
            resolve(jsdom.serialize());
          });
          break;
        case AttachedType.Signatures: // Signatures
          JSDOM.fromFile(path.resolve(__dirname, 'templates', options.fileName)).then(jsdom => {
            const document = jsdom.window.document;

            document.getElementById('signature-1-img').src = 'https://lh3.googleusercontent.com/IhHSqxjzSXuZpr8DDDJvKDWgl8Ctt48XwEqvX0tEPXiOyYTWlC_QzhcuRcOjS3EXaSiF_yn5MwF2XQ6a74zC-MEcHBAUR1I-';
            document.getElementById('name-1').textContent = 'Hola';

            document.getElementById('signature-2-img').src = 'https://lh3.googleusercontent.com/IhHSqxjzSXuZpr8DDDJvKDWgl8Ctt48XwEqvX0tEPXiOyYTWlC_QzhcuRcOjS3EXaSiF_yn5MwF2XQ6a74zC-MEcHBAUR1I-';
            document.getElementById('name-2').textContent = 'Hola 2';

            document.getElementById('signature-3-img').src = 'https://lh3.googleusercontent.com/IhHSqxjzSXuZpr8DDDJvKDWgl8Ctt48XwEqvX0tEPXiOyYTWlC_QzhcuRcOjS3EXaSiF_yn5MwF2XQ6a74zC-MEcHBAUR1I-';
            document.getElementById('name-3').textContent = 'Hola 3';


            resolve(jsdom.serialize());
          });
          break;
        case AttachedType.Cover_Attached: // Cover attached
          JSDOM.fromFile(path.resolve(__dirname, 'templates', options.fileName)).then(jsdom => {
            const document = jsdom.window.document;
            const title = document.getElementById('title');
            title.textContent = '“ANEXOS ' + options.titleCoverAttached + '“';
            resolve(jsdom.serialize());
          });
          break;
      }
    });
  }

  private buildPDF(html: any): Promise<any>{
    return new Promise((resolve, reject) => {
      try {
        const puppeteer = require('puppeteer');
        (async () => {
          const browser = await puppeteer.launch({headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox']});
          const page = await browser.newPage();
          await page.setContent(html);
          const pdf = await page.pdf({
            format: 'A4',
            displayHeaderFooter: true,
            headerTemplate: '<p></p>',
            footerTemplate: '<p></p>'
          });
          await browser.close();
          resolve(pdf);
        })();
      }catch (e){
        reject(e);
      }
    });
  }

  private joinPDF(arrayBuffers: any[]): Promise<any>{
    const hummus = require('hummus');
    const memoryStreams = require('memory-streams');
    return new Promise(resolve => {
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
        throw new Error('Error during PDF combination: ' + e.message);
      }
    });
  }

  private downloadFile(url: string): Promise<any>{
    return new Promise((resolve, reject) => {
      const request = require('request');
      request({url: url, encoding:null}, (err, res, body) => {
        if(err){
          reject(err);
        }
        console.log('Status download', res.statusCode);
        resolve(body);
      });
    });
  }

  private static finish(response: any): void{
    process.send(response);
  }

}


process.on('message', () => {
  new PdfGenerator();
});
