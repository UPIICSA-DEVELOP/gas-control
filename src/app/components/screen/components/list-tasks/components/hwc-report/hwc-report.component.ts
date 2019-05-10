/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HWCReport} from '@app/core/interfaces/interfaces';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {Subscription} from 'rxjs/Rx';
import {Constants} from '@app/core/constants.core';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';
import {PdfVisorService} from '@app/core/components/pdf-visor/pdf-visor.service';
import {HashService} from '@app/core/utilities/hash.service';

@Component({
  selector: 'app-hwc-report',
  templateUrl: './hwc-report.component.html',
  styleUrls: ['./hwc-report.component.scss']
})
export class HwcReportComponent implements OnInit, OnDestroy {
  private _taskId: string;
  public task: any;
  private _stationId: string;
  @Input() set taskHwcInfo(taskObj: any){
    if (taskObj){
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getHWCReport();
    }
  }
  @Input() set station(station: any){
    if(station){
      this._stationId = station.id;
    }
  }
  public load: boolean;
  public hwcForm: FormGroup;
  public hwcReport: HWCReport;
  public date: any[];
  public taskItems: any[];
  public editable: boolean;
  public error: boolean;
  public file: boolean;
  public name: string;
  private _fileElement: any;
  private _file: FormData;
  public signatureThumbnail: string;
  private _signatureElement: any;
  private _signature: FormData;
  private _indexTask: number;
  private _copyTask: HWCReport;
  private _subscriptionLoader: Subscription;
  private _subscriptionShared: Subscription;
  private _loads: boolean[];
  private _files: any;
  constructor(
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _formBuilder: FormBuilder,
    private _uploadFile: UploadFileService,
    private _signatureService: SignaturePadService,
    private _snackBarService: SnackBarService,
    private _sharedService: SharedService,
    private _pdf: PdfVisorService
  ) {
    this.editable = false;
    this._loads = [false, false];
    this.date = [];
    this.taskItems = [];
    this._indexTask = 0;
    this.file = false;
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load=>{this.load=load});
    this.initHwcForm();
    this.getNotifications();
  }

  ngOnDestroy():void {
    this._subscriptionShared.unsubscribe();
    this._subscriptionLoader.unsubscribe();
  }

  private getNotifications():void {
    this._subscriptionShared = this._sharedService.getNotifications().subscribe(response=>{
      switch (response.type){
        case SharedTypeNotification.EditTask:
          if(response.value === 6){
            this.startEditFormat();
          }
          break;
      }
    });
  }

  private initHwcForm(): void{
    this.hwcForm = this._formBuilder.group({
      waste:['',[Validators.required]],
      quantity: ['',[Validators.required]],
      unity: ['',[Validators.required]],
      carrierCompany: ['',[Validators.required]],
      finalDestination: ['',[Validators.required]]
    });
  }

  private patchForm(task: any): void{
    this.hwcReport = {
      carrierCompany: task.carrierCompany || undefined,
      date: task.date || undefined,
      finalDestination: task.finalDestination || undefined,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      id: task.id || undefined,
      manifest: task.manifest || undefined,
      manifestNumber: task.manifestNumber || undefined,
      name: task.name || undefined,
      nextPhase: task.nextPhase || undefined,
      quantity: task.quantity || undefined,
      signature: task.signature || undefined,
      taskId: task.taskId || undefined,
      unity: task.unity || undefined,
      waste: task.waste || undefined
    };
    this.hwcForm.patchValue({
      waste: this.hwcReport.waste,
      quantity: this.hwcReport.quantity,
      unity: this.hwcReport.unity,
      carrierCompany: this.hwcReport.carrierCompany,
      finalDestination: this.hwcReport.finalDestination
    });
    this.date = UtilitiesService.convertDate(this.hwcReport.date);
    this.hwcForm.disable();
  }

  private getHWCReport(): void{
    this._api.getTaskInformation(this._taskId, 6).subscribe(response=>{
      switch (response.code){
        case 200:
          if(response.items){
            this.taskItems = UtilitiesService.sortJSON(response.items, 'folio', 'desc');
            this._indexTask = 0;
            this.patchForm(this.taskItems[0])
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
    this.hwcReport = undefined;
    this.hwcForm.reset();
    this.hwcForm.disable();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    if(this.task.status !== 4 && user.role ===7){
      this.startEditFormat(true);
    }
  }

  public changeTask(ev: any){
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }

  private startEditFormat(isNewLoad?: boolean):void {
    let today: any = new Date();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    today = UtilitiesService.createPersonalTimeStamp(today);
    this.date = UtilitiesService.convertDate(today.timeStamp);
    this.editable = true;
    this.name = user.completeName;
    if(!isNewLoad){
      this._copyTask = this.hwcReport;
      if(this.hwcReport.fileCS){
        this._fileElement = this.hwcReport.fileCS;
        this.file = true;
      }
      this.hwcReport.date = undefined;
      this.hwcReport.folio = undefined;
      this.hwcReport.signature = undefined;
    }
    this.hwcForm.enable();
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

  public loadFile(ev: UploadFileResponse):void {
    this.file = true;
    this._loads[0] = true;
    this._files = ev.file;
    this._file = new FormData();
    this._file.append('path','Taks-'+this._taskId);
    this._file.append('fileName', 'manifest-'+this._taskId+new Date().getTime()+'.pdf');
    this._file.append('file', ev.file);
    this.error = false;
  }


  public validateForm(value: any): void{
    if(!this.file){
      this.error = true;
    }
    if(this.error || this.hwcForm.invalid){
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
    this.saveReport(value);
  }

  private uploadFile(type: number):void{
    switch (type){
      case 1:
        this._uploadFile.upload(this._file).subscribe(response=>{
          if (response){
            this._fileElement = {
              blobName: response.item.blobName,
              thumbnail: response.item.thumbnail
            };
            this._loads[0] = false;
            this.validateForm(this.hwcForm.value);
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
            this.validateForm(this.hwcForm.value);
          }
        });
        break;
      default:
        break;
    }
  }

  private saveReport(value: any): void{
    let date: any = new Date();
    date = UtilitiesService.createPersonalTimeStamp(date);
    this.hwcReport = {
      carrierCompany: value.carrierCompany,
      date: date.timeStamp,
      fileCS: this._fileElement,
      finalDestination: value.finalDestination,
      name: this.name,
      quantity: value.quantity,
      signature: this._signatureElement,
      taskId: this._taskId,
      unity: value.unity,
      waste: value.waste
    };
    if(this._copyTask){
      this.hwcReport.id = this._copyTask.id;
      this._api.createTask(this.hwcReport, 6).subscribe(response=>{
        switch (response.code){
          case 200:
            this._sharedService.setNotification({type: SharedTypeNotification.FinishEditTask, value: response.item.station});
            break;
          default:
            console.error(response);
            break;
        }
      });
    }else{
      this._api.createHWCReportAndTask(this.hwcReport,this._stationId).subscribe(response=>{
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

  public seeReport(): void{
    const user = LocalStorageService.getItem(Constants.UserInSession);
    switch (user.role){
      case 1:
      case 2:
      case 4:
      case 7:
        this._pdf.open({urlOrFile: this._loads[0] ? this._files : HashService.set('123456$#@$^@1ERF',this.hwcReport.fileCS.thumbnail)});
        break;
      case 3:
      case 5:
      case 6:
        this._pdf.open({urlOrFile: HashService.set('123456$#@$^@1ERF',this.hwcReport.fileCS.thumbnail), hideDownload: true});
        break;
    }
  }
}
