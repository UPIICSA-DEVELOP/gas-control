/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FEReport, FireExtinguisher} from '@app/core/interfaces/interfaces';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {ApiService} from '@app/core/services/api/api.service';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {Subscription} from 'rxjs/Rx';
import {Constants} from '@app/core/constants.core';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';

@Component({
  selector: 'app-fe-report',
  templateUrl: './fe-report.component.html',
  styleUrls: ['./fe-report.component.scss']
})
export class FeReportComponent implements OnInit, OnDestroy {
  private _taskId: string;
  public task: any;
  @Input() set taskFeInfo(taskObj: any){
    if(taskObj){
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getFEReport();
    }
  }
  public load: boolean;
  public feForm: FormGroup;
  public feReport: FEReport;
  public date: any[];
  public taskItems: any[];
  public editable: boolean;
  public name: string;
  public extinguisher: FireExtinguisher[];
  public signatureThumbnail: string;
  public extinguisherErrors: boolean[];
  private _signature: FormData;
  private _signatureElement: any;
  private _load: boolean;
  private _copyTask: FEReport;
  private _indexTask: number;
  private _subscriptionShared: Subscription;
  private _subscriptionLoader: Subscription;
  constructor(
    private _api:ApiService,
    private _apiLoader: ApiLoaderService,
    private _formBuilder: FormBuilder,
    private _snackBarService: SnackBarService,
    private _sharedService: SharedService,
    private _signatureService: SignaturePadService,
    private _uploadFileService: UploadFileService
  ) {
    this.date = [];
    this._indexTask = 0;
    this.taskItems = [];
    this.editable = false;
    this._load = false;
    this.extinguisherErrors = [false];
    this.extinguisher = [
      {
        area: undefined,
        belt: undefined,
        capacity: undefined,
        collar: undefined,
        expiration: undefined,
        hose: undefined,
        manometer: undefined,
        safe: undefined,
        unity: undefined
      }]
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load=>{this.load = load});
    this.initFeReport();
    this.getNotifications();
  }

  ngOnDestroy(): void{
    this._subscriptionLoader.unsubscribe();
    this._subscriptionShared.unsubscribe();
  }

  private getNotifications():void{
    this._subscriptionShared = this._sharedService.getNotifications().subscribe(response=>{
      switch (response.type){
        case SharedTypeNotification.EditTask:
          if(response.value === 8){
            this.startEditReport();
          }
          break;
        default:
          break;
      }
    })
  }

  private initFeReport(): void {
    this.feForm = this._formBuilder.group({
      startTime: ['',[Validators.required]],
      endTime:['',[Validators.required]]
    });
  }

  private resetElements(): void{
    this.feReport = undefined;
    this.feForm.reset();
    this.feForm.disable();
    if (this.task.original.status === 3){
      this.startEditReport(true);
    }
  }

  private patchForm(task: any): void {
    this.feReport = {
      date: task.date || undefined,
      endTime: task.endTime || undefined,
      fireExtinguishers: task.fireExtinguishers || undefined,
      folio: task.folio || undefined,
      id: task.id || undefined,
      name: task.name || undefined,
      signature: task.signature || undefined,
      startTime: task.startTime || undefined,
      taskId: task.taskId || undefined
    };
    this.feForm.patchValue({
      startTime: this.feReport.startTime,
      endTime: this.feReport.endTime
    });
    this.extinguisher = this.feReport.fireExtinguishers;
    this.date = UtilitiesService.convertDate(this.feReport.date);
    this.feForm.disable();
  }

  public getFEReport(): void{
    this._api.getTaskInformation(this._taskId, 8).subscribe(response=>{
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
    })
  }

  public changeTask(ev: any){
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }

  private startEditReport(isNewLoad?:boolean): void{
    let today: any = new Date();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    today = UtilitiesService.createPersonalTimeStamp(today);
    this.date = UtilitiesService.convertDate(today.timeStamp);
    this.editable = true;
    this.name = user.completeName;
    if(!isNewLoad){
      this._copyTask = this.feReport;
      if(this.feReport.fireExtinguishers.length !== 0){
        this.extinguisher = this.feReport.fireExtinguishers;
      }
      this.feReport.signature = undefined;
      this.feReport.folio = undefined;
      this.feReport.date = undefined;
    }
    this.feForm.enable();
  }

  public addRemoveExtinguisher(isAdd: boolean, index?: number):void{
    if(isAdd){
      this.extinguisher.push({
        area: undefined,
        belt: undefined,
        capacity: undefined,
        collar: undefined,
        expiration: undefined,
        hose: undefined,
        manometer: undefined,
        safe: undefined,
        unity: undefined
      });
      this.extinguisherErrors.push(false);
    }else{
      this.extinguisher.splice(index, 1);
      this.extinguisherErrors.splice(index, 1);
    }
  }

  public loadSignature(): void {
    this._signatureService.open().afterClosed().subscribe(response => {
      switch (response.code) {
        case 1:
          this.signatureThumbnail = response.base64;
          this._load = true;
          this._signature = new FormData();
          this._signature.append('fileName', 'signature-' + new Date().getTime() + '.png');
          this._signature.append('isImage', 'true');
          this._signature.append('file', response.blob);
          break;
      }
    });
  }

  public changeTime(ev: any, type: string): void {
    this.feForm.patchValue({
      [type]: ev
    });
  }

  public validateForm(value: any):void{
    let error = false;
    for(let i = 0; i < this.extinguisher.length; i++){
      if(
        !this.extinguisher[i].area && !this.extinguisher[i].belt && this.extinguisher[i].capacity === 0 && !this.extinguisher[i].collar
        && !this.extinguisher[i].expiration && !this.extinguisher[i].hose && !this.extinguisher[i].manometer && !this.extinguisher[i].safe
        && !this.extinguisher[i].unity
      ){
        this.extinguisherErrors[i] = true;
        error = true;
      }
    }
    if(error || this.feForm.invalid){
      this._snackBarService.openSnackBar('Por favor, complete los campos','OK',3000);
      return;
    }
    if(!this._signature){
      this._snackBarService.openSnackBar('Por favor, registre su firma','OK',3000);
      return;
    }
    if(this._load){
      this.uploadFile();
      return;
    }
    this.saveReport(value);
  }

  private uploadFile():void{
    this._uploadFileService.upload(this._signature).subscribe(response=>{
      if(response){
        this._signatureElement = {
          blobName: response.item.blobName,
          thumbnail: response.item.thumbnail
        };
        this._load = false;
        this.validateForm(this.feForm.value);
      }
    });
  }

  private saveReport(value: any):void{
    let date: any = new Date();
    date = UtilitiesService.createPersonalTimeStamp(date);
    this.feReport = {
      date: date.timeStamp,
      endTime: value.endTime,
      fireExtinguishers: this.extinguisher,
      name: this.name,
      signature: this._signatureElement,
      startTime: value.startTime,
      taskId: this._taskId
    };
    if(this._copyTask){
      this.feReport.id = this._copyTask.id;
    }
    this._api.createTask(this.feReport, 8).subscribe(response=>{
      switch (response.code){
        case 200:
          this._sharedService.setNotification({type: SharedTypeNotification.FinishEditTask, value: response.item.station});
          break;
        default:
          console.error(response);
          break;
      }
    });
  }

  public changeExInfo(ev: any, index: number){
    this.extinguisherErrors[index] = false;
  }
}
