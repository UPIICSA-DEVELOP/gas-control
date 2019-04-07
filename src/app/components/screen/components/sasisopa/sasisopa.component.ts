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
import {BrigadeElems, SasisopaDocument} from '@app/core/interfaces/interfaces';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {PdfVisorService} from '@app/core/components/pdf-visor/pdf-visor.service';
import {Constants} from '@app/core/constants.core';
import {HashService} from '@app/core/utilities/hash.service';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';

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
  private dateGeneration: string[];
  private _sasisopaDocs: any[];
  private _subscriptionLoader: Subscription;
  private _token: string;
  private _change: boolean;
  private _forms: FormData[];
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
    this.dateGeneration = [];
    this.zones = Constants.Zones;
    this.frequency = Constants.Frequency;
    this.priority = Constants.Level;
    this.dateSelected = undefined;
    this.date = undefined;
    this._change = false;
    this.maxDate = UtilitiesService.addSubtractDaysFromDate(new Date, 1, false);
    this.minDate = undefined;
    this.station = undefined;
    this._token = undefined;
    this.elementInView = 0;
    this.listCollaborators = [];
    this.brigade = [];
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
              this.initFormArray();
              this.elementInView = 0;
              break;
            default:
              this.elementInView = 0;
              this._change = false;
              break;
          }
        });
      }else{
        this.elementInView = 0;
      }
      this.getSasisopa();
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
    this._pdf.open({file: url, url: HashService.set("123456$#@$^@1ERF", url), notIsUrl: false, hideOptions: true})
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
  }

  private uploadFile(annexed: number, index: number):void{
    this._uploadFileService.upload(this._forms[index-1]).subscribe(response => {
      if(response){
        this._forms[index-1] = undefined;
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
          break;
        default:
          break;
      }
    });
  }

  private saveBrigade():void{
    const options ={
      id: this.station.id,
      brigadeElems: this.brigade
    };
    this._api.saveBrigade(options).subscribe(response => {
      switch(response.code){
        case 200:
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
          break;
        default:
          break;
      }
    });
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
        break;
      case 4:
        if(this._forms[4]){
          this.uploadFile(index,5);
          return;
        }
        break;
      case 6:
        if(this._forms[5]){
          this.uploadFile(index,6);
          return;
        }
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
        this.saveBrigade();
        break;
      case 5:
        this.saveEvidenceDate();
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
            this._sasisopaDocs = UtilitiesService.sortJSON(response.item.sasisopaDocuments, 'type', 'asc');
          }
          if(response.item.fullSasisopa){
            this.generate = true;
            this.dateGeneration = UtilitiesService.convertDate(response.item.fullSasisopa.date);
            const today = UtilitiesService.createPersonalTimeStamp(new Date());
            if(response.item.date < today.timeStamp){
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
  }

  public generateSasisopa():void{
    let error = false;
    if(this._sasisopaDocs.length < 12){
      error = true;
    }
    if(this.brigade.length === 0){
      error = true;
    }
    if(!this.date){
      error = true;
    }
    for(let i = 0; i<this.listCollaborators.length; i++){
      if(!this.listCollaborators[i].signature || !this.listCollaborators[i].signature.thumbnail){
        error = true;
      }
    }
    if(error){
      this._snackBarService.openSnackBar('Por favor, complete la información para generar el SASISOPA','OK',3000);
      return;
    }else{
      this._api.getFullSasisopa(this.station.id, false).subscribe(response =>{
        switch(response.code){
          case 200:
            this.generate = true;
            this.dateGeneration = UtilitiesService.convertDate(response.item.date);
            const today = UtilitiesService.createPersonalTimeStamp(new Date);
            if(response.item.date < today.timeStamp){
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
}
