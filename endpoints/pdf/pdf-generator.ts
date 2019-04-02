

import {Commons} from './commons'
import {AttachedType, ReportType, TypeFuel, CreatePDFOptions, ParseHTMLOptions, PdfGeneratorData} from './utils';

class PdfGenerator{

  private static BACKEND_URL = 'https://schedule-maplander.appspot.com/_ah/api/communication/v1/';
  private static EMPTY_INPUT = 'N/A';
  private _commons: Commons;
  private _response: any;
  private _stationId: string;
  private _stationRFC: string;
  private _businessName: string;
  private _sasisopaOriginal: any;
  private _tanksList: any[];
  private _brigadeList: any[];
  private _collaboratorsList: any[];
  private _tasksList: any[];
  private _proceduresList: any[];
  private _sasisopaDocuments: any[];


  constructor(data: PdfGeneratorData){

    if(!data){
      return;
    }

    this._commons = new Commons();
    this._stationId = data.stationId;
    this._stationRFC = data.stationRFC;
    this._businessName = data.businessName;
    this._tanksList = data.listTanks;
    this._brigadeList = data.listBrigade;
    this._collaboratorsList = data.listCollaborators;
    this._tasksList = data.listTasks;
    this._proceduresList = data.listProcedures;
    this._sasisopaDocuments = data.sasisopaDocuments;
    this._sasisopaOriginal = data.sasisopaOriginalFile;
    this._response = {
      code: 200,
      description: 'OK'
    };
    console.log('PdfGenerator Initiated', new Date());
    this.init();
  }

  private init(): void{


    const buffers = [];

    let tmp_buffer_file = [];


    this.createPDF({option: AttachedType.Cover, titleCoverAttached: ''}).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 1}); // Cover attached 1
    }).then((buffer) => {
      tmp_buffer_file.push(buffer);
      return this.createPDF({option: AttachedType.Attached_1});  // Attached 1
    }).then(buffer => {
      tmp_buffer_file.push(buffer);
      return this._commons.joinPDF(tmp_buffer_file);
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 2}); // Cover attached 2
    }).then(buffer => {
      tmp_buffer_file = [];
      tmp_buffer_file.push(buffer);
      return this.createPDF({option: AttachedType.Attached_2}) // Attached 2
    }).then(buffer => {
      tmp_buffer_file.push(buffer);
      const urls = this.searchURLSByAttached(2);
      return this.downloadFilesByAttached(urls);
    }).then(response => {
      response.forEach(item => {
        tmp_buffer_file.push(item);
      });
      return this._commons.joinPDF(tmp_buffer_file);
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 3}); // Cover attached 3
    }).then(buffer => {
      tmp_buffer_file = [];
      tmp_buffer_file.push(buffer);
      return this.createPDF({option: AttachedType.Attached_3}); // Attached 3
    }).then(buffer => {
      tmp_buffer_file.push(buffer);
      const urls = this.searchURLSByAttached(3);
      return this.downloadFilesByAttached(urls);
    }).then(response => {
      response.forEach(item => {
        tmp_buffer_file.push(item);
      });
      return this._commons.joinPDF(tmp_buffer_file);
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 4}); // Cover attached 4
    }).then(buffer => {
      tmp_buffer_file = [];
      tmp_buffer_file.push(buffer);
      const urls = this.searchURLSByAttached(4);
      return this.downloadFilesByAttached(urls);
    }).then(response => {
      response.forEach(item => {
        tmp_buffer_file.push(item);
      });
      return this._commons.joinPDF(tmp_buffer_file);
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 5});// Cover attached 5
    }).then(buffer => {
      tmp_buffer_file = [];
      tmp_buffer_file.push(buffer);
      return this.createPDF({option: AttachedType.Attached_5}); // Attached 5
    }).then(buffer => {
      tmp_buffer_file.push(buffer);
      return this.createEvidenceByTasks();
    }).then(buffersEvidences => {
      buffersEvidences.forEach(bufferEvidence => {
        tmp_buffer_file.push(bufferEvidence);
      });
      return this._commons.joinPDF(tmp_buffer_file);
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 6});// Cover attached 6
    }).then(buffer => {
      tmp_buffer_file = [];
      tmp_buffer_file.push(buffer);
      const urls = this.searchURLSByAttached(6);
      return this.downloadFilesByAttached(urls);
    }).then(response => {
      response.forEach(item => {
        tmp_buffer_file.push(item);
      });
      return this._commons.joinPDF(tmp_buffer_file);
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 7}); // Cover attached 9
    }).then(buffer => {
      tmp_buffer_file = [];
      tmp_buffer_file.push(buffer);
      const urls = this.searchURLSByAttached(9);
      return this.downloadFilesByAttached(urls);
    }).then(response => {
      response.forEach(item => {
        tmp_buffer_file.push(item);
      });
      return this._commons.joinPDF(tmp_buffer_file);
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 8}); // Cover attached 10
    }).then(buffer => {
      tmp_buffer_file = [];
      tmp_buffer_file.push(buffer);
      const urls = this.searchURLSByAttached(10);
      return this.downloadFilesByAttached(urls);
    }).then(response => {
      response.forEach(item => {
        tmp_buffer_file.push(item);
      });
      return this._commons.joinPDF(tmp_buffer_file);
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Cover_Attached, titleCoverAttached: 9}); // Cover attached 11
    }).then(buffer => {
      tmp_buffer_file = [];
      tmp_buffer_file.push(buffer);
      const urls = this.searchURLSByAttached(11);
      return this.downloadFilesByAttached(urls);
    }).then(response => {
      response.forEach(item => {
        tmp_buffer_file.push(item);
      });
      return this._commons.joinPDF(tmp_buffer_file);
    }).then(buffer => {
      buffers.push(buffer);
      return this.createPDF({option: AttachedType.Signatures})  // Signatures
    }).then(buffer => {
      buffers.push(buffer);
      console.log('Files', buffers.length);
      return this.uploadFiles(buffers);
    }).then(response => {
      switch (response.code){
        case 200:
          console.log('PdfGenerator Finished', new Date());
          PdfGenerator.finish(this._response);
          break;
        default:
          console.error(response);
          this._response.code = 500;
          this._response.description = 'Internal Server Error ' + response.description;
          PdfGenerator.finish(this._response);
          break;
      }
    }).catch(error => {
      console.error(error);
      this._response.code = 500;
      this._response.description = 'Internal Server Error ' + error;
      PdfGenerator.finish(this._response);
    });

  }

  private createPDF(options: CreatePDFOptions): Promise<Buffer>{
    return new Promise<Buffer>((resolve, reject) => {
      let fileName, path = 'templates/attached';
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
          if(options.option > 10){
            fileName = 'report-' + (options.option - 10) + '.html';
            path = 'templates/report';
          }else{
            fileName = 'attached-' + options.option + '.html';
          }
          break;
      }
      this.parseHTML({option: options.option, fileName: fileName, path: path, titleCoverAttached: options.titleCoverAttached, task: options.task}).then(result => {
        return this._commons.buildPDF(result);
      }).then(buffer => {
        resolve(buffer);
      }).catch(error => {
        console.log('createPDF', error);
        reject(error);
      });
    });
  }

  private parseHTML(options: ParseHTMLOptions): Promise<any>{
    // Declarations
    const path = require('path');
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom, item: any = options.task || null;
    let items: any = '', list: any = '', newDate;

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
            case AttachedType.Cover:
              document.getElementById('businessName').textContent = this._businessName;
              resolve(jsdom.serialize());
              break;
            case AttachedType.Attached_1: // Attached 1
              this._collaboratorsList.forEach(user => {
                const name = document.getElementById('name');
                const workPosition = document.getElementById('workPosition');
                const signature = document.getElementById('signature');

                name.textContent = user.name + ' ' + user.lastName;
                workPosition.textContent = user.jobTitle;
                signature.src = user.signature.thumbnail;

                const item = document.getElementById('item-to-select');
                items += item.innerHTML;
              });
              list = document.getElementById('list');
              list.innerHTML = items;
              resolve(jsdom.serialize());
              break;
            case AttachedType.Attached_2: // Attached 2
              this._tanksList.forEach((tank, index) => {
                const tr = document.createElement('tr');
                const number = document.createElement('td');
                const capacity = document.createElement('td');
                const typeFuel = document.createElement('td');
                number.textContent = (index + 1);
                capacity.textContent = tank.capacity + ' lt';
                switch (tank.fuelType){
                  case TypeFuel.DIESEL:
                    typeFuel.textContent = 'Diesel';
                    break;
                  case TypeFuel.MAGNA:
                    typeFuel.textContent = 'Magna';
                    break;
                  case TypeFuel.PREMIUM:
                    typeFuel.textContent = 'Premium';
                    break;
                  default:
                    typeFuel.textContent = '';
                    break;
                }
                tr.appendChild(number);
                tr.appendChild(capacity);
                tr.appendChild(typeFuel);
                document.getElementById('table').appendChild(tr);
              });

              resolve(jsdom.serialize());
              break;
            case AttachedType.Attached_3: // Attached 3
              this._brigadeList.forEach((user, index) => {
                const name = document.getElementById('name');
                const workPosition = document.getElementById('workPosition');
                name.textContent = (index + 1) + '. ' + user.name + ' ' + user.lastName;
                workPosition.textContent = 'Cargo en la brigada: '+ user.position;
                const item = document.getElementById('item-to-select');
                items += item.innerHTML;
              });
              list = document.getElementById('list');
              list.innerHTML = items;
              resolve(jsdom.serialize());
              break;
            case AttachedType.Attached_5: // Attached
              resolve(jsdom.serialize());
              break;
            case AttachedType.Signatures: // Signatures

              for(let i = 0; i < this._collaboratorsList.length; i ++){
                const user = this._collaboratorsList[i];
                if(user.role === 4){
                  document.getElementById('signature-1-img').src = user.signature.thumbnail;
                  document.getElementById('name-1').textContent = user.name + ' ' + user.lastName;
                }else if(user.role === 5){
                  document.getElementById('signature-2-img').src = user.signature.thumbnail;
                  document.getElementById('name-2').textContent =  user.name + ' ' + user.lastName;
                }else if(user.role === 6){
                  document.getElementById('signature-3-img').src = user.signature.thumbnail;
                  document.getElementById('name-3').textContent = user.name + ' ' + user.lastName;
                  break;
                }
              }
              resolve(jsdom.serialize());
              break;
            case AttachedType.Cover_Attached: // Cover attached
              const title = document.getElementById('title');
              title.textContent = '“ANEXO ' + options.titleCoverAttached + '“';
              resolve(jsdom.serialize());
              break;




            case ReportType.Report_1: // OM Report

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


              document.getElementById('materials').textContent = item.toolsAndMaterials || PdfGenerator.EMPTY_INPUT;


              // Procedures [START]

              if(item.procedures && item.procedures.length > 0){
                ol = null;
                ol = document.createElement('ol');
                ol.setAttribute('type', '1');

                item.procedures.forEach(item => this._proceduresList.forEach(procedure => {

                  if(item === Number(procedure.id)){
                    const li = document.createElement('li');
                    li.innerHTML = procedure.name;
                    ol.appendChild(li);
                  }

                }));
                document.getElementById('list-procedures').appendChild(ol);
              }else{
                const p = document.createElement('p');
                p.innerText = PdfGenerator.EMPTY_INPUT;
                document.getElementById('list-procedures').appendChild(p);
              }

              // Procedures [END]

              document.getElementById('manager-authorization').textContent = item.description || PdfGenerator.EMPTY_INPUT;

              document.getElementById('observations').textContent = item.	observations || PdfGenerator.EMPTY_INPUT;

              if(item.evidence){
                document.getElementById('evidence').src = item.fileCS.thumbnail;
              }else{
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
            case ReportType.Report_2: // Compressor Report

              document.getElementById('li-date').textContent = newDate[0] + ' ' + newDate[1] + ' ' + newDate[2];
              document.getElementById('li-time-1').textContent = Commons.createTimeString(item.startTime.toString());
              document.getElementById('li-time-2').textContent = Commons.createTimeString(item.endTime.toString());
              document.getElementById('li-folio').textContent = Commons.formatFolio(item.folio.toString());

              document.getElementById('brand').textContent = item.brand || PdfGenerator.EMPTY_INPUT;
              document.getElementById('model').textContent = item.model || PdfGenerator.EMPTY_INPUT;
              document.getElementById('control').textContent = item.controlNumber || PdfGenerator.EMPTY_INPUT;

              document.getElementById('pressure').textContent = item.pressure;
              document.getElementById('purge').textContent = item.purge;
              document.getElementById('shooting').textContent = item.securityValve;

              document.getElementById('modify').textContent = item.modifications || PdfGenerator.EMPTY_INPUT;
              document.getElementById('observations').textContent = item.observations || PdfGenerator.EMPTY_INPUT;


              if(item.evidence){
                document.getElementById('evidence').src = item.fileCS.thumbnail;
              }else{
                document.getElementById('parent-evidence').style.display = 'none';
              }

              if(item.hwgReport){
                (async () => {
                  (async () => {
                    const data = await this.parseHTML({option: ReportType.Report_3, path: 'templates/report', fileName:'report-3.html',  task: item.hwgReport});
                    const doc = new JSDOM(data).window.document;
                    document.getElementById('report-3').appendChild(doc.getElementById('global-container'));
                    document.getElementById('signature').src = item.signature.thumbnail;
                    document.getElementById('signature-name').textContent = item.name;
                    resolve(jsdom.serialize());
                  })();
                })();
              }else{
                document.getElementById('signature').src = item.signature.thumbnail;
                document.getElementById('signature-name').textContent = item.name;
                resolve(jsdom.serialize());
              }

              break;
            case ReportType.Report_3: // HWG Report

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
            case ReportType.Report_4: // VRS Report

              document.getElementById('li-date').textContent = newDate[0] + ' ' + newDate[1] + ' ' + newDate[2];
              document.getElementById('li-folio').textContent = Commons.formatFolio(item.folio.toString());

              if(item.vrsDispensary.magna){
                li.innerHTML = 'Magna';
                ol.appendChild(li);
              }
              if(item.vrsDispensary.premium){
                li.innerHTML = 'Premium';
                ol.appendChild(li);
              }
              if(item.vrsDispensary.diesel){
                li.innerHTML = 'Diesel';
                ol.appendChild(li);
              }

              document.getElementById('list-dispensaries').appendChild(ol);


              document.getElementById('gun').textContent = item.vrsDispensary.fuelNozzle;
              document.getElementById('break').textContent = item.vrsDispensary.breakAway;
              document.getElementById('equipment').textContent = item.vrsDispensary.equipment;
              document.getElementById('hose-large').textContent = item.vrsDispensary.longHose;
              document.getElementById('hose-short').textContent = item.vrsDispensary.shortHose;

              // Tanks

              item.vrsTanks.forEach((tank, index) => {
                switch (tank.fuelType){
                  case TypeFuel.PREMIUM:
                    document.getElementById('gas').textContent = 'Premium';
                    break;
                  case TypeFuel.MAGNA:
                    document.getElementById('gas').textContent = 'Magna';
                    break;
                  case TypeFuel.DIESEL:
                    document.getElementById('gas').textContent = 'Diesel';
                    break;
                }
                document.getElementById('title-tank').textContent = 'Tanque ' + (index + 1);
                document.getElementById('adapter-steam').textContent = tank.capAndSteamAdapter;
                document.getElementById('adapter-fill').textContent = tank.capAndFillingAdapter;
                document.getElementById('over-fill').textContent = tank.overfillValve;
                document.getElementById('pressure').textContent = tank.vacuumPressureValve;
                document.getElementById('item-to-select').appendChild(document.createElement('br'));
                const item = document.getElementById('item-to-select');
                items += item.innerHTML;
              });
              document.getElementById('list-tanks').innerHTML = items;

              document.getElementById('alarm-svr').textContent = item.vrsAlarm;
              document.getElementById('alarm-emergency').textContent = item.emergencyStop;

              document.getElementById('observations').textContent = item.observations || PdfGenerator.EMPTY_INPUT;

              if(item.evidence){
                document.getElementById('evidence').src = item.fileCS.thumbnail;
              }else{
                document.getElementById('parent-evidence').style.display = 'none';
              }

              document.getElementById('signature').src = item.signature.thumbnail;
              document.getElementById('signature-name').textContent = item.name;


              resolve(jsdom.serialize());
              break;
            case ReportType.Report_5: // Scanned Report

              document.getElementById('li-date').textContent = newDate[0] + ' ' + newDate[1] + ' ' + newDate[2];
              document.getElementById('li-folio').textContent = Commons.formatFolio(item.folio.toString());

              if(item.hwgReport){
                (async () => {
                  const data = await this.parseHTML({option: ReportType.Report_3, path: 'templates/report', fileName:'report-3.html',  task: item.hwgReport});
                  const doc = new JSDOM(data).window.document;
                  document.getElementById('report-3').appendChild(doc.getElementById('global-container'));
                  resolve(jsdom.serialize());
                })();
              }else{
                resolve(jsdom.serialize());
              }

              break;
            case ReportType.Report_6: // HWC Report

              document.getElementById('li-date').textContent = newDate[0] + ' ' + newDate[1] + ' ' + newDate[2];
              document.getElementById('li-folio').textContent = Commons.formatFolio(item.folio.toString());

              document.getElementById('containers').textContent = item.waste;
              document.getElementById('quantity').textContent = item.quantity;
              document.getElementById('pz').textContent = item.unity;

              document.getElementById('company').textContent = item.carrierCompany;
              document.getElementById('destiny').textContent = item.finalDestination;
              document.getElementById('destiny').textContent = item.finalDestination;

              document.getElementById('signature').src = item.signature.thumbnail;
              document.getElementById('signature-name').textContent = item.name;


              resolve(jsdom.serialize());
              break;
            case ReportType.Report_7: // FR Report

              document.getElementById('li-date').textContent = newDate[0] + ' ' + newDate[1] + ' ' + newDate[2];
              document.getElementById('li-time-1').textContent = Commons.createTimeString(item.startTime.toString());
              document.getElementById('li-time-2').textContent = Commons.createTimeString(item.endTime.toString());
              document.getElementById('li-folio').textContent = Commons.formatFolio(item.folio.toString());

              document.getElementById('remission-number').textContent = item.remissionNumber;
              document.getElementById('remission').textContent = item.remission;
              document.getElementById('volumetric').textContent = item.volumetric;

              if(item.magna){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Magna';
                ol.appendChild(li);
              }
              if(item.premium){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Premium';
                ol.appendChild(li);
              }
              if(item.diesel){
                li = null;
                li = document.createElement('li');
                li.innerHTML = 'Diesel';
                ol.appendChild(li);
              }

              document.getElementById('list-gas').appendChild(ol);

              ol = null;
              ol = document.createElement('ol');
              ol.setAttribute('type', '1');
              li = null;
              li = document.createElement('li');
              li.innerHTML = item.receiveName;
              ol.appendChild(li);

              document.getElementById('list-personal').appendChild(ol);

              document.getElementById('signature').src = item.signature.thumbnail;
              document.getElementById('signature-name').textContent = item.name;


              resolve(jsdom.serialize());
              break;
            case ReportType.Report_8: // FE Report

              document.getElementById('li-date').textContent = newDate[0] + ' ' + newDate[1] + ' ' + newDate[2];
              document.getElementById('li-time-1').textContent = Commons.createTimeString(item.startTime.toString());
              document.getElementById('li-time-2').textContent = Commons.createTimeString(item.endTime.toString());
              document.getElementById('li-folio').textContent = Commons.formatFolio(item.folio.toString());


              item.fireExtinguishers.forEach(ext => {
                document.getElementById('area').textContent = ext.area;
                document.getElementById('capacity').textContent = ext.capacity;
                document.getElementById('expiration').textContent = ext.expiration;
                document.getElementById('manometer').textContent = ext.manometer;
                document.getElementById('hose').textContent = ext.hose;
                document.getElementById('belt').textContent = ext.belt;
                document.getElementById('collar').textContent = ext.collar;
                document.getElementById('secure').textContent = ext.safe;
                const item = document.getElementById('item-to-select');
                items += item.innerHTML;
              });

              document.getElementById('list-extinguisher').innerHTML = items;

              document.getElementById('signature').src = item.signature.thumbnail;
              document.getElementById('signature-name').textContent = item.name;


              resolve(jsdom.serialize());
              break;
            case ReportType.Report_9: // Incidence

              document.getElementById('li-date').textContent = newDate[0] + ' ' + newDate[1] + ' ' + newDate[2];
              document.getElementById('li-time-1').textContent = Commons.createTimeString(item.time.toString());
              document.getElementById('li-folio').textContent = Commons.formatFolio(item.folio.toString());

              document.getElementById('place').textContent = item.area;
              document.getElementById('description').textContent = item.description;

              if(item.procedures && item.procedures.length > 0 ){
                item.procedures.forEach(item => this._proceduresList.forEach(procedure => {
                  if(item === Number(procedure.id)){
                    const li = document.createElement('li');
                    li.innerHTML = procedure.name;
                  }
                }));
                document.getElementById('list-procedures').appendChild(ol);
              }else{
                const p = document.createElement('p');
                p.innerText = PdfGenerator.EMPTY_INPUT;
                document.getElementById('list-procedures').appendChild(p);
              }

              document.getElementById('evidence').src = item.fileCS.thumbnail;


              document.getElementById('signature').src = item.signature.thumbnail;
              document.getElementById('signature-name').textContent = item.name;


              resolve(jsdom.serialize());
              break;
          }

        });
      }catch (e){
        console.error('parseHTML',e.message);
        reject(e.message);
      }

    });
  }


  private async downloadFilesByAttached(urls: string[]): Promise<Buffer[]>{
    const buffers: Buffer[] = [];
    await Commons.asyncForEach(urls, async (url) => {
      const response = await this._commons.downloadFile(url);
      buffers.push(response);
    });
    return buffers;
  }

  private searchURLSByAttached(number: number): string[]{
    const files = [], urls = [];
    this._sasisopaDocuments.forEach(document => {
      if(document.annexed === number){
        files.push(document);
      }
    });
    Commons.bubbleSort(files, 'type');
    files.forEach(file => {
      urls.push(file.file.thumbnail);
    });
    return urls;
  }

  private async createEvidenceByTasks(): Promise<Buffer[]>{
    const buffers: Buffer[] = [];
    await Commons.asyncForEach(this._tasksList, async (item) => {
      const buffer = await this.createPDF({option: (item.typeReport + 10), task: item});
      buffers.push(buffer);
    });
    return buffers;
  }

 private async uploadFiles(files: Buffer[]): Promise<any>{
   let uploaded = [];
   await Commons.asyncForEach(files, async (file: Buffer, index: number) => {
     const formData = {
       file: {
         value: file,
         options: {
           filename: 'sasisopa-'+ new Date().getTime() + '.pdf',
           contentType: 'image/png'
         }
       },
       isImage: 'false',
       path: this._stationRFC + '/' + this._stationId + '/SASISOPA',
       fileName: 'sasisopa-'+ index +'-'+ new Date().getTime() + '.pdf'
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
   uploaded.splice(1, 0, this._sasisopaOriginal);
   const body = {id: this._stationId, files: uploaded};
   return await this._commons.request(PdfGenerator.BACKEND_URL + 'saveFullSasisopa', 'POST', body);
 }

  private static finish(response: any): void{
    process.send(response);
  }

}


process.on('message', (data: PdfGeneratorData) => {
  new PdfGenerator(data);
});
