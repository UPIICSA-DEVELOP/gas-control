/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {HWGReport, ScannedReport} from '@app/core/interfaces/interfaces';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {Subscription} from 'rxjs';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';
import {Constants} from '@app/core/constants.core';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {PdfVisorService} from '@app/core/components/pdf-visor/pdf-visor.service';
import {HashService} from '@app/core/utilities/hash.service';

@Component({
  selector: 'app-scanned-report',
  templateUrl: './scanned-report.component.html',
  styleUrls: ['./scanned-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScannedReportComponent implements OnInit, OnDestroy {
  private _taskId: string;
  public task: any;
  @Input() set taskScannedInfo(taskObj: any){
    if (taskObj){
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getScannedReport();
    }
  }
  public load: boolean;
  public scannedReport: ScannedReport;
  public date: any[];
  public taskItems: any[];
  public editable: boolean;
  public error: boolean;
  public  signatureThumbnail: string;
  public name: string;
  private _signatureElement: any;
  private _signature: FormData;
  private _evidenceElement: any;
  public file: boolean;
  public startValidate: boolean;
  public hwgData: HWGReport;
  private _evidence: FormData;
  private _loads: boolean[];
  private _indexTask: number;
  private _subscriptionLoader: Subscription;
  private _subscriptionShared: Subscription;
  private _copyTasks: ScannedReport;
  private _hwgElement: HWGReport;
  private _file: any;
  constructor(
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _uploadFile: UploadFileService,
    private _signatureService: SignaturePadService,
    private _sharedService: SharedService,
    private _snackBarService: SnackBarService,
    private _pdf: PdfVisorService
  ) {
    this.startValidate = false;
    this.date = [];
    this._indexTask = 0;
    this.taskItems = [];
    this._loads = [false,false];
    this.editable = false;
    this.file = false;
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load=>{this.load = load});
    this.getNotifications();
  }

  ngOnDestroy():void {
    this._subscriptionLoader.unsubscribe();
    this._subscriptionShared.unsubscribe();
  }

  private getNotifications(): void{
    this._subscriptionShared = this._sharedService.getNotifications().subscribe(response=>{
      switch (response.type){
        case SharedTypeNotification.EditTask:
          if(response.value === 5){
            this.startEditFormat();
          }
          break;
        default:
          break;
      }
    })
  }

  private startEditFormat(isNewLoad?: boolean): void{
    let today: any = new Date();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    today = UtilitiesService.createPersonalTimeStamp(today);
    this.date = UtilitiesService.convertDate(today.timeStamp);
    this.editable = true;
    this.name = user.completeName;
    this._sharedService.setNotification({type: SharedTypeNotification.HwgActive, value: isNewLoad ? isNewLoad : false});
    if(!isNewLoad){
      this._copyTasks = this.scannedReport;
      if(this.scannedReport.fileCS){
        this.file = true;
        this._evidenceElement = this.scannedReport.fileCS;
      }
      if(this.scannedReport.hwgReport){
        this.hwgData = this.scannedReport.hwgReport;
      }
      this.scannedReport.date = undefined;
      this.scannedReport.signature = undefined;
      this.scannedReport.folio = undefined;
    }
  }

  private patchForm(task: any): void {
    this.scannedReport = {
      date: task.date || undefined,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      hwgReport: task.hwgReport || undefined,
      id: task.id || undefined,
      name: task.name || undefined,
      signature: task.signature || undefined,
      taskId: task.taskId || undefined
    };
    if(this.scannedReport.hwgReport){
      this.hwgData = this.scannedReport.hwgReport;
    }else{
      this.hwgData = undefined
    }
    this.date = UtilitiesService.convertDate(this.scannedReport.date);
  }

  private getScannedReport(): void{
    this._api.getTaskInformation(this._taskId,5).subscribe(response=>{
      switch (response.code){
        case 200:
          if(response.items){
            this.taskItems = UtilitiesService.sortJSON(response.items, 'folio', 'desc');
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

  private resetElements(): void{
    this.scannedReport = undefined;
    const user = LocalStorageService.getItem(Constants.UserInSession);
    if(this.task.original.status !== 4 && user.role ===7){
      this.startEditFormat(true);
    }
  }

  public changeTask(ev: any){
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }


  public loadFile(ev: UploadFileResponse): void {
    this.error = false;
    this._loads[0] = true;
    this.file = true;
    this._file = ev.file;
    this._evidence = new FormData();
    this._evidence.append('path', 'Task-'+this._taskId);
    this._evidence.append('fileName', 'manifest-'+this._taskId+new Date().getTime()+'.pdf');
    this._evidence.append('file', ev.file);
  }

  public loadSignature(): void{
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

  public validateElements():void{
    let error = false;
    if(this.task.original.hwg){
      if(!this._hwgElement.area ||
        !this._hwgElement.waste ||
        !this._hwgElement.quantity ||
        !this._hwgElement.unity ||
        !this._hwgElement.temporaryStorage){
        error = true;
      }
    }
    if(!this.file){
      this.error = true;
    }
    if(this.error || error){
      this._snackBarService.openSnackBar('Por favor, complete los campos','OK',3000);
      return;
    }
    if(!this._signature){
      this._snackBarService.openSnackBar('Por favor, registre su firma','OK',3000);
      return;
    }
    if(this._loads[0]){
      this.uploadFile(1);
      return;
    }
    if(this._loads[1]){
      this.uploadFile(2);
      return;
    }
    this.saveReport();
  }

  private saveReport():void{
    let date: any = new Date();
    date = UtilitiesService.createPersonalTimeStamp(date);
    this.scannedReport = {
      date: date.timeStamp,
      fileCS: this._evidenceElement,
      hwgReport: undefined,
      name: this.name,
      signature: this._signatureElement,
      taskId: this._taskId,
    };
    if(this._copyTasks){
      this.scannedReport.id = this._copyTasks.id;
    }
    if(this.task.original.hwg){
      this.scannedReport.hwgReport = this._hwgElement;
    }
    this._api.createTask(this.scannedReport, 5).subscribe(response=>{
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
            this.validateElements();
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
            this.validateElements();
          }
        });
        break;
      default:
        break;
    }
  }

  public getHWGReportInformation(ev: any): void {
    if(ev.valid){
      this._hwgElement = {
        area: ev.value.area,
        corrosive: ev.value.corrosive,
        explosive: ev.value.explosive,
        flammable: ev.value.flammable,
        reactive: ev.value.reactive,
        quantity: ev.value.quantity,
        temporaryStorage: ev.value.temporaryStorage,
        toxic: ev.value.toxic,
        unity: ev.value.unity,
        waste: ev.value.waste
      };
    }else{
      this._hwgElement = {
        area: undefined,
        corrosive: false,
        explosive: false,
        flammable: false,
        reactive: false,
        quantity: undefined,
        temporaryStorage: undefined,
        toxic: false,
        unity: undefined,
        waste: undefined
      };
    }
    this.startValidate = false;
    this.validateElements();
  }

  public startValidateForm():void{
    this.startValidate = true;
  }

  public seeReport(): void{
    const user = LocalStorageService.getItem(Constants.UserInSession);
    switch (user.role){
      case 1:
      case 2:
      case 4:
      case 7:
        this._pdf.open({urlOrFile: this._loads[0] ? this._file : HashService.set('123456$#@$^@1ERF',this.scannedReport.fileCS.thumbnail)});
        break;
      case 3:
      case 5:
      case 6:
        this._pdf.open({urlOrFile: HashService.set('123456$#@$^@1ERF',this.scannedReport.fileCS.thumbnail), hideDownload: true});
        break;
    }
  }
}
