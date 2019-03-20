/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompressorReport} from '@app/core/interfaces/interfaces';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {ApiService} from '@app/core/services/api/api.service';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {ImageVisorService} from '@app/core/components/image-visor/image-visor.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {Subscription} from 'rxjs/Rx';
import {Constants} from '@app/core/constants.core';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';

@Component({
  selector: 'app-compressor-report',
  templateUrl: './compressor-report.component.html',
  styleUrls: ['./compressor-report.component.scss']
})
export class CompressorReportComponent implements OnInit, OnDestroy {
  private _taskId: string;
  public task: any;
  @Input() set taskCompInfo(taskObj: any){
    if (taskObj){
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getCompReport();
    }
  }
  public load: boolean;
  public compressorReport: CompressorReport;
  public compForm: FormGroup;
  public date: any[];
  public taskItems: any[];
  public editable: boolean;
  public name: string;
  public signatureThumbnail: string;
  public evidenceThumbnail: string;
  public error: boolean;
  private _indexTask: number;
  private _signature: FormData;
  private _evidence: FormData;
  private _loads: boolean[];
  private _subscriptionShared: Subscription;
  private _subscriptionLoader: Subscription;
  private _evidenceElement: any;
  private _signatureElement: any;
  private _copyTask: CompressorReport;
  constructor(
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _formBuilder: FormBuilder,
    private _imageVisor: ImageVisorService,
    private _snackBarService: SnackBarService,
    private _sharedService: SharedService,
    private _uploadFile: UploadFileService,
    private _signatureService: SignaturePadService,
  ) {
    this.error = false;
    this._loads = [false, false];
    this.date = [];
    this.taskItems = [];
    this._indexTask = 0;
    this.editable = false;
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load=>{this.load = load});
    this.initCompForm();
    this.getNotifications();
  }

  ngOnDestroy():void{
    this._subscriptionLoader.unsubscribe();
    this._subscriptionShared.unsubscribe();
  }

  private getNotifications(): void{
    this._subscriptionShared = this._subscriptionShared = this._sharedService.getNotifications().subscribe(response=>{
      switch (response.type){
        case SharedTypeNotification.EditTask:
          if(response.value = 2){
            this.startEditFormat();
          }
          break;
        default:
          break;
      }
    })
  }

  private initCompForm():void{
    this.compForm = this._formBuilder.group({
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      brand: ['', []],
      model: ['', []],
      controlNumber: ['', []],
      pressure: ['', [Validators.required]],
      purge: ['', [Validators.required]],
      securityValve: ['', [Validators.required]],
      modifications: ['', []],
      observations: ['', []]
    });
  }

  private resetElements(): void {
    this.compressorReport = undefined;
    this.compForm.reset();
    this.compForm.disable();
    if(this.task.original.status === 3){
      this.startEditFormat(true);
    }
  }

  private patchForm(task: any):void{
    this.compressorReport = {
      brand: task.brand || undefined,
      controlNumber: task.controlNumber || undefined,
      date: task.date || undefined,
      endTime: task.endTime || undefined,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      hwgReport: task.hwgReport || undefined,
      id: task.id || undefined,
      model: task.model || undefined,
      modifications: task.modifications || undefined,
      name: task.name || undefined,
      observations: task.observations || undefined,
      pressure: task.pressure || undefined,
      purge: task.purge || undefined,
      securityValve: task.securityValve || undefined,
      signature: task.signature || undefined,
      startTime: task.startTime || undefined,
      taskId: task.taskId || undefined
    };
    this.compForm.patchValue({
      startTime: this.compressorReport.startTime,
      endTime: this.compressorReport.endTime,
      brand: this.compressorReport.brand,
      model: this.compressorReport.model,
      controlNumber: this.compressorReport.controlNumber,
      pressure: this.compressorReport.pressure,
      purge: this.compressorReport.purge,
      securityValve: this.compressorReport.securityValve,
      modifications: this.compressorReport.modifications,
      observations: this.compressorReport.observations
    });
    this.date = UtilitiesService.convertDate(this.compressorReport.date);
    this.compForm.disable();
  }

  private getCompReport(): void{
    this._api.getTaskInformation(this._taskId, 2).subscribe(response=>{
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


  private startEditFormat(prepare?: boolean): void{
    let today: any = new Date();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    today = UtilitiesService.createPersonalTimeStamp(today);
    this.date = UtilitiesService.convertDate(today.timeStamp);
    this.editable = true;
    this.name = user.completeName;
    if(!prepare){
      this._copyTask = this.compressorReport;
      this.compressorReport.signature = undefined;
      if(this.compressorReport.fileCS){
        this.evidenceThumbnail = this.compressorReport.fileCS.thumbnail;
        this._evidenceElement = this.compressorReport.fileCS;
      }
      this.compressorReport.signature = undefined;
      this.compressorReport.folio = undefined;
      this.compressorReport.name = user.completeName;
    }
    this.compForm.enable();
  }

  public changeTime(ev: any, type: string): void {
    this.compForm.patchValue({
      [type]: ev
    });
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

  public loadEvidence(ev: UploadFileResponse): void {
    this.error = false;
    this.evidenceThumbnail = ev.url;
    this._loads[0] = true;
    this._evidence = new FormData();
    this._evidence.append('path', '');
    this._evidence.append('fileName', 'evidence-' + new Date().getTime() + '.png');
    this._evidence.append('isImage', 'true');
    this._evidence.append('file', ev.blob);
  }

  public deleteEvidence(): void {
    this.evidenceThumbnail = undefined;
    this._loads[0] = false;
    this._evidence = undefined;
  }


  public validateForm(value: any): void {
    if (this.task.original.evidence && (!this._evidence && !this.compressorReport.fileCS)) {
      this.error = true;
    }
    if (this.compForm.invalid || this.error) {
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

  private uploadFile(type: number):void{
    switch (type){
      case 1:
        this._uploadFile.upload(this._evidence).subscribe(response=>{
          if (response){
            this._evidenceElement = {
              blobName: response.item.blobName,
              thumbnail: response.item.thumbnail
            };
            this._loads[0] = false;
            this.validateForm(this.compForm.value);
          }
        });
        break;
      case 2:
        this._uploadFile.upload(this._signature).subscribe(response=>{
          if (response){
            this._signatureElement = {
              blobName: response.item.blobName,
              thumbnail: response.item.thumbnail
            };
            this._loads[1] = false;
            this.validateForm(this.compForm.value);
          }
        });
        break;
      default:
        break;
    }
  }

  private saveReport(value):any{
    let date: any = new Date();
    date = UtilitiesService.createPersonalTimeStamp(date);
    this.compressorReport = {
      brand: value.brand,
      controlNumber: value.controlNumber,
      date: date.timeStamp,
      endTime: value.endTime,
      fileCS: this._evidenceElement,
      modifications: value.modifications,
      model: value.model,
      name: this.name,
      observations: value.observations,
      purge: value.purge,
      pressure: value.pressure,
      signature: this._signatureElement,
      securityValve: value.securityValve,
      startTime: value.startTime,
      taskId: this._taskId,
    };
    if (this._copyTask){
      this.compressorReport.id = this._copyTask.id
    }
    if(this.task.original.hwg){
      this.compressorReport.hwgReport = this._copyTask ? this._copyTask.hwgReport : undefined;
    }
    this._api.createTask(this.compressorReport, 2).subscribe(response=>{
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

}
