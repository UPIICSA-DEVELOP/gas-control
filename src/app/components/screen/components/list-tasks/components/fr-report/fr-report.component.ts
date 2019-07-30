/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FRReport} from '@app/core/interfaces/interfaces';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {Constants} from '@app/core/constants.core';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {Subscription} from 'rxjs/Rx';
import {FormatTimePipe} from '@app/core/pipes/format-time/format-time.pipe';

@Component({
  selector: 'app-fr-report',
  templateUrl: './fr-report.component.html',
  styleUrls: ['./fr-report.component.scss']
})
export class FrReportComponent implements OnInit, OnDestroy {
  private _taskId: string;
  private _stationId: string;
  public task: any;
  @Input() set taskFrInfo(taskObj: any){
    if(taskObj){
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getFRReport();
    }
  }
  @Input() set station(station: any){
    if(station){
      this._stationId = station.id;
    }
  }
  public load: boolean;
  public frForm: FormGroup;
  public frReport: FRReport;
  public date: any[];
  public taskItems: any[];
  public editable: boolean;
  public name: string;
  public error: boolean;
  private _indexTask: number;
  public signatureThumbnail: string;
  private _signatureElement: any;
  private _signature: FormData;
  private _copyLastTask: FRReport;
  private _subscriptionLoader: Subscription;
  private _subscriptionShared: Subscription;
  private _load: boolean;
  constructor(
    private _api:ApiService,
    private _apiLoader: ApiLoaderService,
    private _formBuilder: FormBuilder,
    private _signatureService: SignaturePadService,
    private _uploadFileService: UploadFileService,
    private _snackBarService: SnackBarService,
    private _sharedService: SharedService,
    private _formatTimePipe: FormatTimePipe
  ) {
    this.date = [];
    this.taskItems = [];
    this._indexTask = 0;
    this.editable = false;
    this._load = false;
    this.error = false;
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load=>{this.load = load});
    this.initFrReport();
    this.getNotifications();
  }

  ngOnDestroy(): void{
    this._subscriptionShared.unsubscribe();
    this._subscriptionLoader.unsubscribe();
  }

  private getNotifications():void{
    this._subscriptionShared = this._sharedService.getNotifications().subscribe(response=>{
      switch (response.type){
        case SharedTypeNotification.EditTask:
          if(response.value === 7){
            this.startEditTask();
          }
          break;
        default:
          break;
      }
    });
  }

  private initFrReport(): void {
    this.frForm = this._formBuilder.group({
      startTime: ['',[Validators.required]],
      endTime: ['',[Validators.required]],
      remissionNumber: ['',[Validators.required]],
      remission: ['',[Validators.required]],
      volumetric: ['',[Validators.required]],
      magna:[false,[]],
      premium: [false,[]],
      diesel: [false,[]],
      receiveName: ['',[Validators.required]]
    });
  }


  private patchForm(task: any):void {
    this.frReport = {
      date: task.date || undefined,
      diesel: task.diesel || undefined,
      endTime: task.endTime,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      id: task.id || undefined,
      magna: task.magna || undefined,
      managerName: task.managerName || undefined,
      name: task.name || undefined,
      premium: task.premium || undefined,
      receiveName: task.receiveName || undefined,
      remission: task.remission || undefined,
      remissionNumber: task.remissionNumber,
      signature: task.signature || undefined,
      startTime: task.startTime,
      taskId: task.taskId || undefined,
      volumetric: task.volumetric || undefined
    };
    this.frForm.patchValue({
      startTime: this._formatTimePipe.transform(this.frReport.startTime),
      endTime: this._formatTimePipe.transform(this.frReport.endTime),
      remissionNumber: this.frReport.remissionNumber,
      remission: this.frReport.remission,
      volumetric: this.frReport.volumetric,
      magna: this.frReport.magna,
      premium: this.frReport.premium,
      diesel: this.frReport.diesel,
      receiveName: this.frReport.receiveName
    });
    this.date = UtilitiesService.convertDate(this.frReport.date);
    this.frForm.disable();
  }

  private getFRReport(): void{
    this._api.getTaskInformation(this._taskId, 7).subscribe(response=>{
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

  private resetElements(): void {
    this.frReport = undefined;
    this.frForm.reset();
    this.frForm.disable();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    if(this.task.status !== 4 && user.role ===7){
      this.startEditTask(true);
    }
  }

  public changeTask(ev: any){
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }

  private startEditTask(isNewLoad?: boolean): void {
    let today: any = new Date();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    today = UtilitiesService.createPersonalTimeStamp(today);
    this.date = UtilitiesService.convertDate(today.timeStamp);
    this.editable = true;
    this.name = user.completeName;
    if(!isNewLoad){
      this._copyLastTask = this.frReport;
      this.frReport.date = undefined;
      this.frReport.signature = undefined;
      this.frReport.folio = undefined;
    }
    this.frForm.enable();
  }

  public changeTime(ev: any, type: string): void{
    this.frForm.patchValue({
      [type]: ev
    });
  }

  public changeFuelType(ev: any){
    this.error = false;
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

  public validateForm(value: any):void{
    if(!value.magna && !value.premium && !value.diesel){
      this.error = true;
    }
    if(this.frForm.invalid || this.error){
      this._snackBarService.openSnackBar('Por favor, complete los campos','OK',3000);
      return;
    }
    if(!this._signature){
      this._snackBarService.openSnackBar('Por favor, registre su firma','OK',3000);
      return;
    }
    if(this._load){
      this.uploadSignature();
      return;
    }
    this.saveReport(value);
  }

  private saveReport(value: any):void{
    let date: any = new Date();
    date = UtilitiesService.createPersonalTimeStamp(date);
    this.frReport = {
      date: date.timeStamp,
      diesel: value.diesel,
      endTime: UtilitiesService.removeFormatTime(value.endTime),
      magna: value.magna,
      name: this.name,
      premium: value.premium,
      receiveName: value.receiveName,
      remission: value.remission,
      remissionNumber: value.remissionNumber,
      signature: this._signatureElement,
      startTime: UtilitiesService.removeFormatTime(value.startTime),
      taskId: this._taskId,
      volumetric: value.volumetric
    };
    if (this._copyLastTask){
      this.frReport.id = this._copyLastTask.id;
      this._api.createTask(this.frReport, 7).subscribe(response=>{
        switch (response.code){
          case 200:
            this._sharedService.setNotification({type: SharedTypeNotification.FinishEditTask, value: response.item.station});
            break;
          default:
            console.error(response);
            break;
        }
      })
    }else{
      this._api.createFRReportAndTask(this.frReport,this._stationId).subscribe(response=>{
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
  }

  private uploadSignature():void{
    this._uploadFileService.upload(this._signature).subscribe(response=>{
      if(response){
        this._signatureElement = {
          blobName: response.item.blobName,
          thumbnail: response.item.thumbnail
        };
        this._load = false;
        this.validateForm(this.frForm.value);
      }
    })
  }
}
