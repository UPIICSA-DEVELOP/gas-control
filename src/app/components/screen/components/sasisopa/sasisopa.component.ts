/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {Subscription} from 'rxjs/Rx';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {ModalProceduresService} from '@app/components/screen/components/modal-procedures/modal-procedures.service';
import {Brigade, BrigadeElems, SasisopaDocument} from '@app/core/interfaces/interfaces';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {PdfVisorService} from '@app/core/components/pdf-visor/pdf-visor.service';
import {Constants} from '@app/core/constants.core';
import {HashService} from '@app/core/utilities/hash.service';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {environment} from '@env/environment';

@Component({
  selector: 'app-sasisopa',
  templateUrl: './sasisopa.component.html',
  styleUrls: ['./sasisopa.component.scss']
})
export class SasisopaComponent implements OnInit, OnDestroy {
  public elementInView: number;
  public listCollaborators: any[];
  public load: boolean;
  public station: any;
  public brigade: BrigadeElems[];
  public date: Date;
  public maxDate: Date;
  public minDate: Date;
  public listTasks: any[];
  public dateSelected: string;
  public zones: string[];
  public priority: string[];
  public frequency: string[];
  public generate: boolean;
  public isAvailable: boolean;
  public sasisopaDocs: any[];
  public docFile: any[];
  public errors: boolean[];
  public dateGeneration: string[];
  public isDevelop: boolean;
  private _subscriptionLoader: Subscription;
  private _token: string;
  private _change: boolean;
  private _forms: FormData[];
  private _invalid: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data,
    private _matDialogRef: MatDialogRef<SasisopaComponent>,
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _proceduresService: ModalProceduresService,
    private _uploadFileService: UploadFileService,
    private _pdf: PdfVisorService,
    private _dialogService: DialogService,
    private _snackBarService: SnackBarService
  ) {
    this.isDevelop = environment.develop;
    this.docFile = [null, null, null, null, null, null, null, null, null, null, null, null];
    this.sasisopaDocs = [null, null, null, null, null, null, null, null, null, null, null, null];
    this.errors = [false, false, false, false,  false, false, false, false];
    this.dateGeneration = [];
    this.zones = Constants.Zones;
    this.frequency = Constants.Frequency;
    this.priority = Constants.Level;
    this.dateSelected = undefined;
    this.date = undefined;
    this._change = false;
    this._invalid = false;
    this.maxDate = UtilitiesService.addSubtractDaysFromDate(new Date, 1, false);
    this.minDate = undefined;
    this.station = undefined;
    this._token = undefined;
    this.elementInView = 0;
    this.listCollaborators = [];
    this.brigade = [{name: undefined, lastName: undefined, position: undefined}];
    this.listTasks = [];
    this._forms = [];
    this.isAvailable = false;
    this.generate = false;
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load=>{this.load = load});
    this.getStation();
    this.getStationCollaborators();
    this.getSasisopa();
    this.initFormArray();
  }

  ngOnDestroy() {
    this._subscriptionLoader.unsubscribe();
  }

  public changeElementOnView(type: number): void{
    this.elementInView = type;
    this.resetErrors();
  }

  public close():void{
    if(this.elementInView !== 0){
      if(this._change){
        this._dialogService.confirmDialog(
          '¿Desea salir sin guarda cambios?',
          '',
          'ACEPTAR',
          'CANCELAR'
        ).afterClosed().subscribe(response =>{
          switch(response.code){
            case 1:
              this._change = false;
              this.initFormArray();
              this.getSasisopa();
              this.elementInView = 0;
              break;
          }
        });
      }else{
        this.elementInView = 0;
        this.getSasisopa();
      }
    }else{
      this._matDialogRef.close();
    }
  }

  public openModalProcedures(): void{
    this._proceduresService.open({utils:this._data.utils.procedures, proceduresSelected: [], notVisibleChecks: true})
  }

  public openSasisopaTemplate(isAnnexedFive: boolean): void{
    let url;
    if(isAnnexedFive){
      url = this._data.utils.sasisopaTemplates[1].fileCS.thumbnail;
    }else{
      url = this._data.utils.sasisopaTemplates[0].fileCS.thumbnail;
    }
    const user = LocalStorageService.getItem(Constants.UserInSession);
    switch (user.role){
      case 1:
      case 2:
      case 7:
        this._pdf.open({urlOrFile: HashService.set("123456$#@$^@1ERF", url)});
        break;
      case 3:
      case 4:
      case 5:
      case 6:
        this._pdf.open({urlOrFile: HashService.set("123456$#@$^@1ERF", url), hideDownload: true});
        break;
    }
  }

  public addRemoveBrigadeElem(isAdd: boolean, index?: number): void{
    if(isAdd){
      this.brigade.push({name: '', lastName: '', position: ''});
    }else{
      if(this.brigade.length>1){
        this.brigade.splice(index, 1);
      }
    }
  }

  public getStationTasks(datePrevious?: number):void{
    this._change = true;
    if(datePrevious){
      this._change = false;
      this.date = UtilitiesService.generateArrayDate(datePrevious, false, false);
    }
    const date = UtilitiesService.createPersonalTimeStamp(this.date);
    this.dateSelected = date.textDate;
    this._api.listTask({
      stationTaskId: this.station.stationTaskId,
      startDate: date.timeStamp,
      status: '4',
      endDate: date.timeStamp,
      firstOpen: false,
      type: '',
      cursor: this._token
    }).subscribe(response => {
      switch (response.code){
        case 200:
          if(this._token === response.nextPageToken){
            this._token = null;
          }else{
            this._token = response.nextPageToken;
          }
          this.listTasks = this.buildListTasks(response.items);
          break;
        default:
          this.listTasks = [];
          break;
      }
    });
  }

  public loadFile(ev: UploadFileResponse, annexed: number, type: number): void {
    this._change = true;
    let form = new FormData();
    form.append('path', 'Sasisopa');
    form.append('fileName', 'SASISOPA'+annexed+'-'+new Date().getTime()+'.pdf');
    form.append('file', ev.file);
    this._forms[type-1] = form;
    this.docFile[type-1] = ev.file;
  }

  private uploadFile(annexed: number, index: number):void{
    this._uploadFileService.upload(this._forms[index-1]).subscribe(response => {
      if(response){
        this._forms[index-1] = undefined;
        this.docFile[index-1] = undefined;
        const doc: SasisopaDocument = {
          annexed: annexed,
          file: response.item,
          stationId: this.station.id,
          type: index
        };
        this.saveSasisopaDocument(doc);
      }
    });
  }

  private saveSasisopaDocument(element: any): void{
    this._api.saveSasisopaDocument(element).subscribe(response => {
      switch(response.code){
        case 200:
          this._change = false;
          this.sasisopaDocs[element.type - 1] = element;
          this.saveChanges(element.annexed);
          break;
        default:
          break;
      }
    });
  }

  private saveBrigade():void{
    const options: Brigade ={
      id: this.station.id,
      brigadeElems: this.brigade
    };
    this._api.saveBrigade(options).subscribe(response => {
      switch(response.code){
        case 200:
          this._change = false;
          this.saveChanges(3);
          break;
        default:
          break;
      }
    });
  }

  private saveEvidenceDate():void{
    const evidenceDate = UtilitiesService.createPersonalTimeStamp(this.date);
    this._api.saveEvidenceDate(this.station.id, evidenceDate.timeStamp).subscribe(response => {
      switch(response.code){
        case 200:
          this._change = false;
          break;
        default:
          break;
      }
    });
  }

  public validateBrigade():void{
    for(let i = 0; i<this.brigade.length; i++){
      if(!this.brigade[i].name || !this.brigade[i].lastName || !this.brigade[i].position){
        this._snackBarService.openSnackBar('Por favor, complete los campos','OK',3000);
        return;
      }
    }
    this.saveBrigade();
  }

  public saveChanges(index: number):void{
    switch (index){
      case 2:
        if(this._forms[0]){
          this.uploadFile(index,1);
          return;
        }
        if(this._forms[1]){
          this.uploadFile(index,2);
          return;
        }
        this._snackBarService.openSnackBar('Información actualizada','OK',3000);
        break;
      case 4:
        if(this._forms[4]){
          this.uploadFile(index,5);
          return;
        }
        this._snackBarService.openSnackBar('Información actualizada','OK',3000);
        break;
      case 6:
        if(this._forms[5]){
          this.uploadFile(index,6);
          return;
        }
        this._snackBarService.openSnackBar('Información actualizada','OK',3000);
        break;
      case 7:
        if(this._forms[6]){
          this.uploadFile(index + 2,7);
          return;
        }
        if(this._forms[7]){
          this.uploadFile(index + 2,8);
          return;
        }
        this._snackBarService.openSnackBar('Información actualizada','OK',3000);
        break;
      case 8:
        if(this._forms[8]){
          this.uploadFile(index + 2, 9);
          return;
        }
        if(this._forms[9]){
          this.uploadFile(index + 2, 10);
          return;
        }
        if(this._forms[10]){
          this.uploadFile(index + 2, 11);
          return;
        }
        this._snackBarService.openSnackBar('Información actualizada','OK',3000);
        break;
      case 9:
        if(this._forms[11]){
          this.uploadFile(index + 2, 12);
          return;
        }
        break;
      case 3:
        if(this._forms[2]){
          this.uploadFile(index, 3);
          return;
        }
        if(this._forms[3]){
          this.uploadFile(index,4);
          return;
        }
        this._snackBarService.openSnackBar('Información actualizada','OK',3000);
        break;
      case 5:
        this.saveEvidenceDate();
        this._snackBarService.openSnackBar('Información actualizada','OK',3000);
        break;
    }
  }

  private getSasisopa():void{
    this._api.getSasisopa(this._data.stationId).subscribe(response => {
      switch (response.code){
        case 200:
          if(response.item.brigade){
            this.brigade = response.item.brigade.brigadeElems;
          }
          if(response.item.evidenceDate){
            this.date = UtilitiesService.generateArrayDate(response.item.evidenceDate.date,false, false);
            const date = UtilitiesService.createPersonalTimeStamp(this.date);
            this.getStationTasks(date.timeStamp);
          }
          if(response.item.sasisopaDocuments){
            const sasisopaDocs = UtilitiesService.sortJSON(response.item.sasisopaDocuments, 'type', 'asc');
            for(let i = 0; i < this.sasisopaDocs.length; i++){
              for(let j = 0; j < sasisopaDocs.length; j++){
                if(sasisopaDocs[j].type === i + 1){
                  this.sasisopaDocs[i] = sasisopaDocs[j];
                }
              }
            }
          }
          if(response.item.fullSasisopa){
            this.generate = true;
            this.dateGeneration = UtilitiesService.convertDate(response.item.fullSasisopa.date);
            const today = UtilitiesService.createPersonalTimeStamp(new Date());
            if(response.item.fullSasisopa.date <= today.timeStamp){
              this.isAvailable = true;
            }
          }
          break;
        default:
          break;
      }
    })
  }

  private getStationCollaborators():void{
    this._api.listCollaborators(this._data.stationId,'false').subscribe(response=>{
      switch (response.code){
        case 200:
          const list = UtilitiesService.sortJSON(response.items, 'role', 'asc');
          for(let i = 0; i < 3; i++){
            if(list[i]){
              this.listCollaborators.push(list[i]);
            }
          }
          break;
        default:
          break;
      }
    });
  }

  private getStation(): void{
    this._api.getStation(this._data.stationId).subscribe(response => {
      switch (response.code){
        case 200:
          this.station = response.item;
          this.getStationTaskEntity(response.item.stationTaskId);
          break;
        default:
          this.station = null;
          break;
      }
    });
  }

  private getStationTaskEntity(stationTaskId): void{
    this._api.getStationTask(stationTaskId).subscribe(response =>{
      switch (response.code){
        case 200:
          const startDate = response.item.creationDate;
          this.minDate = UtilitiesService.generateArrayDate(startDate, false, false);
          break;
        default:
          this.minDate = UtilitiesService.addSubtractDaysFromDate(new Date(), 7, false);
          break;
      }
    });
  }

  private buildListTasks(listTask: any): any[]{
    let newList = [];
    if(!listTask){
      return newList;
    }
    listTask.forEach(item =>{
      this._data.utils.taskTemplates.forEach(origin => {
        if(item.type == origin.id){
          newList.push({date: UtilitiesService.convertDate(item.date), origin: origin});
        }
      });
    });
    return newList;
  }

  private initFormArray():void {
    for(let i = 0; i < 12; i++){
      this._forms.push(undefined);
    }
    for(let i = 0; i < 12; i++){
      this.docFile[i] = null;
    }
  }

  public generateSasisopa():void{
    let error = false;
    for(let i = 0; i<this.listCollaborators.length; i++){
      if(!this.listCollaborators[i].signature || !this.listCollaborators[i].signature.thumbnail){
        this.errors[0] = true;
        error = true;
      }
    }
    if(!this.sasisopaDocs[0] || !this.sasisopaDocs[1]){
      this.errors[1] = true;
      error = true;
    }
    if(!this.sasisopaDocs[2] || !this.sasisopaDocs[3] || this.brigade.length === 0){
      this.errors[2] = true;
      error = true;
    }
    if(!this.sasisopaDocs[4]){
      this.errors[3] = true;
      error = true;
    }
    if(!this.date){
      this.errors[4] = true;
      error = true;
    }
    if(!this.sasisopaDocs[5]){
      this.errors[5] = true;
      error = true;
    }
    if(!this.sasisopaDocs[6] || !this.sasisopaDocs[7]){
      this.errors[6] = true;
      error = true;
    }
    if(!this.sasisopaDocs[11]){
      this.errors[7] = true;
      error = true;
    }
    if(error){
      return;
    }else{
      this._api.getFullPDF(this.station.id, false).subscribe(response =>{
        switch(response.code){
          case 200:
            this.generate = true;
            this.dateGeneration = UtilitiesService.convertDate(response.item.date);
            const today = UtilitiesService.createPersonalTimeStamp(new Date);
            if(response.item.date <= today.timeStamp){
              this.isAvailable = true;
            }
            break;
          default:
            this._snackBarService.openSnackBar('Ha ocurrido un error, por favor intente más tarde', 'OK', 3000);
            break;
        }
      });
    }
  }

  public seeSasisopa(): void{
    this._api.joinPDF(this.station.id, false).subscribe(response => {
      const user = LocalStorageService.getItem(Constants.UserInSession);
      switch (user.role){
        case 1:
        case 2:
        case 7:
          this._pdf.open({ urlOrFile: response, });
          break;
        case 3:
        case 4:
        case 5:
        case 6:
          this._pdf.open({urlOrFile: response, hideDownload: true });
          break;
      }
    });
  }

  private resetErrors(): void{
    for(let i = 0; i < 8; i++){
      this.errors[i] = false;
    }
  }

  public seeDocuments(type: number): void{
    const user = LocalStorageService.getItem(Constants.UserInSession);
    if(!this.docFile[type-1] && !this.sasisopaDocs[type-1]){
      this._snackBarService.openSnackBar('No se ha escaneado el documento', 'OK', 3000);
      return;
    }
    switch (user.role){
      case 1:
      case 2:
      case 7:
        this._pdf.open({urlOrFile: this.docFile[type-1] ? this.docFile[type-1]: HashService.set("123456$#@$^@1ERF",this.sasisopaDocs[type-1].file.thumbnail)});
         break;
      case 3:
      case 4:
      case 5:
      case 6:
        this._pdf.open({urlOrFile: this.docFile[type-1] ? this.docFile[type-1]: HashService.set("123456$#@$^@1ERF",this.sasisopaDocs[type-1].file.thumbnail), hideDownload: true});
        break;
    }
  }
}
