import {Commons} from './commons';
import {CreatePDFOptions, ParseHTMLOptions, PDFSGMData} from '../commons/interfaces';
import {AttachedType, ReportType} from '../commons/enum';


export class PdfSGM{

  private static BACKEND_URL = 'https://schedule-maplander.appspot.com/_ah/api/communication/v1/';
  private static EMPTY_INPUT = 'N/A';

  private _commons: Commons;
  private _response: any;
  private _data: PDFSGMData;

  constructor(data: PDFSGMData){
    this._commons = new Commons();
    this._response = {
      code: 200,
      description: 'OK'
    };
    this._data = data;
    console.log('PdfSGM Initiated', new Date());
    this.init();
  }

  private init(): void{

    const word2pdf = require('word2pdf-promises');

    const finalPDF: Buffer[] = [];
    let tmp_pdf = [];

    this.buildCustomDocument().then(response => {
      return word2pdf.word2pdfBuffer(response);
    }).then(data => {
      finalPDF.push(data);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: '"Anexo 1"'});
    }).then(buffer => {
      tmp_pdf.push(buffer);
      return this.createEvidenceByTasks(this._data.taskListAnnexed1);
    }).then(buffers => {
      buffers.forEach(buffer => {
        tmp_pdf.push(buffer);
      });
      return this._commons.joinPDF(tmp_pdf);
    }).then(buffer => {
      finalPDF.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: '"Anexo 2"'});
    }).then(buffer => {
      tmp_pdf = [];
      tmp_pdf.push(buffer);
      return this.createEvidenceByTasks(this._data.taskListAnnexed2);
    }).then(buffers => {
      buffers.forEach(buffer => {
        tmp_pdf.push(buffer);
      });
      return this._commons.joinPDF(tmp_pdf);
    }).then(buffer => {
      finalPDF.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 'Hojas de Datos de Seguridad'});
    }).then(buffer => {
      tmp_pdf = [];
      tmp_pdf.push(buffer);
      return this.createSecuritySheets();
    }).then(buffers => {
      buffers.forEach(buffer => {
        tmp_pdf.push(buffer);
      });
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 'Manual del Equipo de Software'});
    }).then(buffer => {
      tmp_pdf.push(buffer);

      return this.createSoftwareManual();
    }).then(buffers => {
      buffers.forEach(buffer =>{
        tmp_pdf.push(buffer);
      });
      return this._commons.joinPDF(tmp_pdf);
    }).then(buffer => {
      finalPDF.push(buffer);
      return this.uploadFiles(finalPDF);
    }).then(response => {
      switch (response.code){
        case 200:
          console.log('PdfSGM Finished', new Date());
          PdfSGM.finish(this._response);
          break;
        default:
          this._response.code = 400;
          this._response.description = 'Bad request | ' + response.description;
          PdfSGM.finish(this._response);
          break;
      }
    }).catch(error => {
      throw error;
    });

  }

  private async buildCustomDocument(): Promise<Buffer>{
    const JSZip = require('jszip');
    const Docxtemplater = require('docxtemplater');
    const fs = require('fs');
    const path = require('path');
    const content = fs.readFileSync(path.resolve(__dirname, 'templates', 'sgm.docx'), 'binary');
    const zip = new JSZip(content);
    const doc = new Docxtemplater();
    doc.loadZip(zip);
    const software = Commons.searchObject(this._data.sgmDocuments, 'id', this._data.sgmSelection.software.toString());
    doc.setData({
      business_name: this._data.businessName || '',
      cre_permission: this._data.crePermission || '',
      address: this._data.address || '',
      software_catalogue: (software.name) ? software.name : ''
    });
    try {
      doc.render()
    } catch (error) {
      const e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
      };
      console.log(JSON.stringify({error: e}));
      throw error;
    }
    return doc.getZip().generate({type: 'nodebuffer'});
  }

  private createPDF(options: CreatePDFOptions): Promise<Buffer>{
    return new Promise<Buffer>((resolve, reject) => {
      let fileName, path = 'templates/attached';
      switch (options.option){
        case AttachedType.Cover_Attached:
          fileName = 'cover-attached.html';
          break;
        default:
          if(options.option > 10){
            fileName = 'report-' + (options.option - 10) + '.html';
            path = 'templates/report';
          }else{
            fileName = 'attached-' + options.option + '.html';
          }
          break;
      }
      this.parseHTML({option: options.option, fileName: fileName, path: path, titleCoverAttached: options.titleCoverAttached, task: options.task}).then(result => {
        return this._commons.buildPDF(result, 'letter');
      }).then(buffer => {
        resolve(buffer);
      }).catch(error => {
        const e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
        };
        console.log(JSON.stringify({error: e}));
        reject(error);
      });
    });
  }

  private async createEvidenceByTasks(taskList: any[]): Promise<Buffer[]>{
    const buffers: Buffer[] = [];
    await Commons.asyncForEach(taskList, async (item) => {
      const buffer = await this.createPDF({option: (Number(item.typeReport) + 10), task: item});
      buffers.push(buffer);
    });
    return buffers;
  }

  private parseHTML(options: ParseHTMLOptions): Promise<any>{
    const path = require('path');
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom, item: any = options.task || null;
    let newDate;

    return new Promise((resolve, reject) => {

      try{
        JSDOM.fromFile(path.resolve(__dirname, options.path, options.fileName)).then(jsdom => {
          const document = jsdom.window.document;
          let ol = document.createElement('ol');
          ol.setAttribute('type', '1');
          let li = document.createElement('li');
          if(item){
            newDate = Commons.convertDate(item.date);
          }
          switch (options.option){

            case AttachedType.Cover_Attached:
              const title = document.getElementById('title');
              title.textContent = options.titleCoverAttached;
              resolve(jsdom.serialize());
              break;
            case ReportType.Report_1: // OM Report

              document.getElementById('sub-title').textContent = item.name;

              document.getElementById('sheet').style.padding = '25mm !important';

              document.getElementById('li-date').textContent = newDate[0] + ' ' + newDate[1] + ' ' + newDate[2];
              document.getElementById('li-time-1').textContent = Commons.createTimeString(item.startTime.toString());
              document.getElementById('li-time-2').textContent = Commons.createTimeString(item.endTime.toString());
              document.getElementById('li-folio').textContent = Commons.formatFolio(item.folio.toString());

              document.getElementById('type-maintenance').textContent = item.maintenanceType;
              document.getElementById('activity').textContent = item.activityType;
              document.getElementById('type-personal').textContent = item.personnelType;

              // Personal [START]

              item.personnelNames.forEach(item => {
                li = null;
                li = document.createElement('li');
                li.innerHTML = item;
                ol.appendChild(li);
              });

              document.getElementById('list-personal').appendChild(ol);

              // Personal [END]
              // Equipment [START]

              ol = null;
              ol = document.createElement('ol');
              ol.setAttribute('type', '1');
              li = null;
              li = document.createElement('li');

              if(item.cottonClothes){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Ropa de algodón';
                ol.appendChild(li);
              }
              if(item.faceMask){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Cubre bocas';
                ol.appendChild(li);
              }
              if(item.gloves){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Guantes';
                ol.appendChild(li);
              }
              if(item.goggles){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Googles';
                ol.appendChild(li);
              }
              if(item.industrialShoes){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Zapato industrial';
                ol.appendChild(li);
              }
              if(item.kneepads){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Rodilleras';
                ol.appendChild(li);
              }
              if(item.protectiveGoggles){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Lentes de protección';
                ol.appendChild(li);
              }
              if(item.helmet){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Cascos';
                ol.appendChild(li);
              }

              document.getElementById('list-equipment').appendChild(ol);

              // Equipment [END]

              document.getElementById('materials').textContent = item.toolsAndMaterials || PdfSGM.EMPTY_INPUT;


              // Procedures [START]

              if(item.procedures && item.procedures.length > 0){
                ol = null;
                ol = document.createElement('ol');
                ol.setAttribute('type', '1');

                item.procedures.forEach(item => this._data.proceduresList.forEach(procedure => {

                  if(item === Number(procedure.id)){
                    const li = document.createElement('li');
                    li.innerHTML = procedure.name;
                    ol.appendChild(li);
                  }

                }));
                document.getElementById('list-procedures').appendChild(ol);
              }else{
                const p = document.createElement('p');
                p.innerText = PdfSGM.EMPTY_INPUT;
                document.getElementById('list-procedures').appendChild(p);
              }

              // Procedures [END]

              document.getElementById('manager-authorization').textContent = item.description || PdfSGM.EMPTY_INPUT;

              document.getElementById('observations').textContent = item.	observations || PdfSGM.EMPTY_INPUT;

              if(item.evidence){
                document.getElementById('evidence').src = item.fileCS.thumbnail;
              }else{
                document.getElementById('title-evidence').style.display = 'none';
                document.getElementById('parent-evidence').style.display = 'none';
              }

              if(item.hwgReport){
                (async () => {
                  const data = await this.parseHTML({option: ReportType.Report_3, path: 'templates/report', fileName:'report-3.html',  task: item.hwgReport});
                  const doc = new JSDOM(data).window.document;
                  document.getElementById('report-3').appendChild(doc.getElementById('global-container'));
                  document.getElementById('signature').src = item.signature.thumbnail;
                  document.getElementById('signature-name').textContent = item.name;
                  resolve(jsdom.serialize());
                })();
              }else{
                document.getElementById('signature').src = item.signature.thumbnail;
                document.getElementById('signature-name').textContent = item.name;
                resolve(jsdom.serialize());
              }

              break;
            case ReportType.Report_3: // HWG Report

              document.getElementById('sheet').style.padding = '25mm !important';

              document.getElementById('place').innerHTML = item.area;
              document.getElementById('place').style.fontWeight = 'normal';
              document.getElementById('residue').innerHTML = item.waste;
              document.getElementById('residue').style.fontWeight = 'normal';

              if(item.corrosive){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Corrisivo';
                ol.appendChild(li);
              }
              if(item.explosive){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Explosivo';
                ol.appendChild(li);
              }
              if(item.flammable){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Inflamable';
                ol.appendChild(li);
              }
              if(item.reactive){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Reactivo';
                ol.appendChild(li);
              }
              if(item.toxic){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Tóxico';
                ol.appendChild(li);
              }

              document.getElementById('list-qualities').appendChild(ol);

              document.getElementById('quantity').innerText = item.quantity;
              document.getElementById('unit').innerText = item.unity;
              document.getElementById('storage').innerText = item.temporaryStorage;

              resolve(jsdom.serialize());
              break;
          }

        });
      }catch (error){
        const e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
        };
        console.log(JSON.stringify({error: e}));
        reject(JSON.stringify({error: e}));
      }

    });
  }

  private async createSecuritySheets(): Promise<Buffer[]>{
    const urls: string[] = [];
    if(this._data.sgmSelection.magna){
      const document = Commons.searchObject(this._data.sgmDocuments, 'id', '11');
      if(document) {
        urls.push(document.fileCS.thumbnail);
      }
    }
    if(this._data.sgmSelection.premium){
      const document = Commons.searchObject(this._data.sgmDocuments, 'id', '12');
      if(document) {
        urls.push(document.fileCS.thumbnail);
      }
    }
    if(this._data.sgmSelection.diesel){
      const document = Commons.searchObject(this._data.sgmDocuments, 'id', '13');
      if(document) {
        urls.push(document.fileCS.thumbnail);
      }
    }
    return await this.downloadFiles(urls);
  }

  private async createSoftwareManual(): Promise<Buffer[]>{
    const urls: string[] = [];
    const manual = Commons.searchObject(this._data.sgmDocuments, 'id', this._data.sgmSelection.software.toString());
    if(manual){
      urls.push(manual.fileCS.thumbnail);
    }
    return await this.downloadFiles(urls);
  }

  private async downloadFiles(urls: string[]): Promise<Buffer[]>{
    const files: Buffer[] = [];
    await Commons.asyncForEach(urls, async (url) => {
      const file: any = await this._commons.downloadFile(encodeURI(url));
      files.push(file.body);
    });
    return files;
  }

  private async uploadFiles(files: Buffer[]): Promise<any>{
    let uploaded = [];
    await Commons.asyncForEach(files, async (file: Buffer, index: number) => {
      const formData = {
        file: {
          value: file,
          options: {
            filename: 'sgm-'+ new Date().getTime() + '.pdf',
            contentType: 'application/pdf'
          }
        },
        isImage: 'false',
        path: this._data.rfc + '/' + this._data.stationId + '/SGM',
        fileName: 'sgm-'+ index +'-'+ new Date().getTime() + '.pdf'
      };
      console.log(`Upload file ${index} started  | `, new Date());
      let response = await this._commons.request('https://schedule-maplander.appspot.com/upload', 'POST', formData, true);
      switch (response.code){
        case 200:
          uploaded.push(response.item);
          console.log(`Upload file ${index} finalize | `, new Date());
          break;
        default:
          console.error(response);
          return null;
      }
    });
    const body = {id: this._data.stationId, date: this._data.date, files: uploaded};
    return await this._commons.request(PdfSGM.BACKEND_URL + 'saveFullSgm', 'POST', body, false, true);
  }

  private static finish(response: any): void{
    process.send(response);
  }

}

process.on('message', (data: PDFSGMData) => {
  new PdfSGM(data);
});

