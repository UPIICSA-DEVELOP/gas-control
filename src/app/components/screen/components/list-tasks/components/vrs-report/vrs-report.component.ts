/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VRSReport, VRSTank} from '@app/core/interfaces/interfaces';
import {ImageVisorService} from '@app/core/components/image-visor/image-visor.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {Subscription} from 'rxjs/Rx';
import {Constants} from '@app/core/constants.core';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';

@Component({
  selector: 'app-vrs-report',
  templateUrl: './vrs-report.component.html',
  styleUrls: ['./vrs-report.component.scss']
})
export class VrsReportComponent implements OnInit, OnDestroy {
  private _taskId: string;
  public task: any;
  @Input() set taskVrsInfo(taskObj: any){
    if(taskObj){
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getVRSReport();
    }
  }
  public load: boolean;
  public vrsForm: FormGroup;
  public vrsReport: VRSReport;
  public date: any[];
  public taskItems: any[];
  public tanks: VRSTank[];
  public editable: boolean;
  public name: string;
  public error: boolean;
  public errorTank: boolean[];
  public evidenceThumbnail: string;
  public signatureThumbnail: string;
  private _evidence: FormData;
  private _signature: FormData;
  private _signatureElement: any;
  private _evidenceElement: any;
  private _loads: boolean[];
  private _indexTask: number;
  private _copyTask: VRSReport;
  private _subscriptionShared: Subscription;
  private _subscriptionLoader: Subscription;
  constructor(
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _formBuilder: FormBuilder,
    private _imageVisor: ImageVisorService,
    private _snackBarService: SnackBarService,
    private _uploadFileService: UploadFileService,
    private _signatureService: SignaturePadService,
    private _sharedService: SharedService

  ) {
    this.date = [];
    this.taskItems = [];
    this._indexTask = 0;
    this.tanks = [{capAndFillingAdapter: undefined,capAndSteamAdapter: undefined,fuelType: 0, overfillValve: undefined, vacuumPressureValve:undefined}];
    this.errorTank = [false];
    this.editable = false;
    this._loads = [false, false];
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load=>{this.load = load});
    this.initVrsForm();
    this.getNotifications();
  }

  ngOnDestroy():void{
    this._subscriptionShared.unsubscribe();
    this._subscriptionLoader.unsubscribe();
  }

  private getNotifications():void{
    this._subscriptionShared = this._sharedService.getNotifications().subscribe(response=>{
      switch (response.type){
        case SharedTypeNotification.EditTask:
          if(response.value === 4){
            this.startEditReport();
          }
          break;
      }
    })
  }

  private initVrsForm():void{
    this.vrsForm = this._formBuilder.group({
      magna: [false, []],
      premium: [false, []],
      fuelNozzle: ['', [Validators.required]],
      longHose: ['', [Validators.required]],
      breakAway: ['', [Validators.required]],
      shortHose: ['', [Validators.required]],
      equipment: ['', [Validators.required]],
      vrsAlarm: ['', [Validators.required]],
      emergencyStop: ['', [Validators.required]],
      observations: ['', []]
    });
  }

  private resetElements(): void{
    this.vrsReport = undefined;
    this.vrsForm.reset();
    this.vrsForm.disable();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    if(this.task.original.status !== 4 && user.role ===7){
      this.startEditReport(true);
    }
  }

  private patchForm(task: any):void{
    this.vrsReport = {
      date: task.date || undefined,
      emergencyStop: task.emergencyStop || undefined,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      id: task.id || undefined,
      name: task.name || undefined,
      observations: task.observations || undefined,
      signature: task.signature || undefined,
      taskId: task.taskId || undefined,
      vrsAlarm: task.vrsAlarm || undefined,
      vrsDispensary: task.vrsDispensary || undefined,
      vrsTanks: task.vrsTanks || undefined
    };
    this.vrsForm.patchValue({
      magna: this.vrsReport.vrsDispensary.magna,
      premium: this.vrsReport.vrsDispensary.premium,
      fuelNozzle: this.vrsReport.vrsDispensary.fuelNozzle,
      longHose: this.vrsReport.vrsDispensary.longHose,
      breakAway: this.vrsReport.vrsDispensary.breakAway,
      shortHose: this.vrsReport.vrsDispensary.shortHose,
      equipment: this.vrsReport.vrsDispensary.equipment,
      vrsAlarm: this.vrsReport.vrsAlarm,
      emergencyStop: this.vrsReport.emergencyStop,
      observations: this.vrsReport.observations
    });
    if(this.vrsReport.vrsTanks) {
      this.tanks = this.vrsReport.vrsTanks;
    }
    this.date = UtilitiesService.convertDate(this.vrsReport.date);
    this.vrsForm.disable();
  }

  private getVRSReport(): void{
    this._api.getTaskInformation(this._taskId, 4).subscribe(response=>{
      switch (response.code){
        case 200:
          if(response.items){
            this.taskItems = UtilitiesService.sortJSON(response.items,'folio','desc');
            this._indexTask = 0;
            this.patchForm(this.taskItems[0]);
          }else{
            this.resetElements();
          }
          break;
        default:
          this.resetElements();
          break;
      }
    });
  }

  public seeEvidence():void{
    if(this.task.original.status !== 4){
      return;
    }
    if(this.taskItems[this._indexTask].fileCS){
      this._imageVisor.open(this.taskItems[this._indexTask].fileCS);
    }else{
      this._snackBarService.openSnackBar('Esta tarea no cuenta con evidencia', 'OK',3000);
    }
  }

  public changeTask(ev: any){
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }

  private startEditReport(isNewLoad?: boolean):void{
    let today: any = new Date();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    today = UtilitiesService.createPersonalTimeStamp(today);
    this.date = UtilitiesService.convertDate(today.timeStamp);
    this.editable = true;
    this.name = user.completeName;
    if(!isNewLoad){
      this._copyTask = this.vrsReport;
      if(this.vrsReport.fileCS){
        this._evidenceElement = this.vrsReport.fileCS;
        this.evidenceThumbnail = this.vrsReport.fileCS.thumbnail;
      }
      this.vrsReport.folio = undefined;
      this.vrsReport.date = undefined;
      this.vrsReport.signature = undefined;
    }
    this.vrsForm.enable();
  }

  public loadEvidence(ev: UploadFileResponse): void {
    this.evidenceThumbnail = ev.url;
    this._loads[0] = true;
    this._evidence = new FormData();
    this._evidence.append('path', 'Task'+this._taskId);
    this._evidence.append('fileName', 'evidence-'+this._taskId + new Date().getTime() + '.png');
    this._evidence.append('isImage', 'true');
    this._evidence.append('file', ev.blob);
  }

  public deleteEvidence(): void {
    this.evidenceThumbnail = undefined;
    this._loads[0] = false;
    this._evidence = undefined;
    this._evidenceElement = undefined
  }

  public loadSignature(): void {
    this._signatureService.open().afterClosed().subscribe(response => {
      switch (response.code) {
        case 1:
          this.signatureThumbnail = response.base64;
          this._loads[1] = true;
          this._signature = new FormData();
          this._signature.append('fileName', 'signature-' + new Date().getTime() + '.png');
          this._signature.append('isImage', 'true');
          this._signature.append('file', response.blob);
          break;
      }
    });
  }

  public addRemoveTank(isAdd: boolean, index?: number): void{
    if(isAdd){
      this.tanks.push({capAndFillingAdapter: undefined,capAndSteamAdapter: undefined,fuelType: 0, overfillValve: undefined, vacuumPressureValve:undefined});
      this.errorTank.push(false);
    }else{
      this.tanks.splice(index, 1);
      this.errorTank.splice(index, 1);
    }
  }

  public validateForm(value: any):void{
    let error = false;
    for(let i = 0; i<this.tanks.length; i++){
      if(!this.tanks[i].vacuumPressureValve || !this.tanks[i].overfillValve || !this.tanks[i].fuelType || !this.tanks[i].capAndSteamAdapter || !this.tanks[i].capAndFillingAdapter){
        this.errorTank[i] = true;
        error = true;
      }
    }
    if(!value.magna && !value.premium){
      this.error = true;
    }
    if(this.error || this.vrsForm.invalid || error){
      this._snackBarService.openSnackBar('Por favor, complete los campos','OK',3000);
      return;
    }
    if(!this._signature){
      this._snackBarService.openSnackBar('Por favor, registre su firma','OK',3000);
      return;
    }
    if(this._loads[0]) {
      this.uploadFile(1);
      return;
    }
    if(this._loads[1]){
      this.uploadFile(2);
      return;
    }
    this.saveReport(value);
  }

  private saveReport(value: any):void{
    let date: any = new Date();
    date = UtilitiesService.createPersonalTimeStamp(date);
    this.vrsReport = {
      date: date.timeStamp,
      emergencyStop: value.emergencyStop,
      fileCS: this._evidenceElement,
      name: this.name,
      observations: value.observations,
      signature: this._signatureElement,
      taskId: this._taskId,
      vrsTanks: this.tanks,
      vrsAlarm: value.vrsAlarm,
      vrsDispensary: {
        breakAway: value.breakAfter,
        diesel: false,
        equipment: value.equipment,
        fuelNozzle: value.fuelNozzle,
        longHose: value.longHose,
        magna: value.magna,
        premium: value.premium,
        shortHose: value.shortHose
      }
    };
    if(this._copyTask){
      this.vrsReport.id = this._copyTask.id;
    }
    this._api.createTask(this.vrsReport, 4).subscribe(response=>{
      switch (response.code){
        case 200:
          this._sharedService.setNotification({type: SharedTypeNotification.FinishEditTask, value: response.item.station});
          break;
        default:
          console.error(response);
          break;
      }
    })
  }

  private uploadFile(type: number):void{
    switch (type){
      case 1:
        this._uploadFileService.upload(this._evidence).subscribe(response=>{
          if (response){
            this._evidenceElement = {
              blobName: response.item.blobName,
              thumbnail: response.item.thumbnail
            };
            this._loads[0] = false;
            this.validateForm(this.vrsForm.value);
          }
        });
        break;
      case 2:
        this._uploadFileService.upload(this._signature).subscribe(response=>{
          if (response){
            this._signatureElement = {
              blobName: response.item.blobName,
              thumbnail: response.item.thumbnail
            };
            this._loads[1] = false;
            this.validateForm(this.vrsForm.value);
          }
        });
        break;
      default:
        break;
    }
  }

  public changeFuelType(ev: any){
    this.error = false;
  }

  public changeTankInfo(ev: any, index: number){
    this.errorTank[index] = false;
  }

}
