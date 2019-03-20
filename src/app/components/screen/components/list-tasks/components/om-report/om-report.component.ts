/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OMReport} from '@app/core/interfaces/interfaces';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {ImageVisorService} from '@app/core/components/image-visor/image-visor.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {Constants} from '@app/core/constants.core';
import {ModalProceduresService} from '@app/components/screen/components/modal-procedures/modal-procedures.service';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';
import {Subscription} from 'rxjs/Rx';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';

@Component({
  selector: 'app-om-report',
  templateUrl: './om-report.component.html',
  styleUrls: ['./om-report.component.scss']
})
export class OmReportComponent implements OnInit, OnDestroy {
  private _taskId: string;
  public task: any;
  public utils: any;

  @Input() set taskOMInfo(taskObj: any) {
    if (taskObj) {
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getOMReport();
    }
  }

  @Input() set utilities(utils: any) {
    if (utils) {
      this.utils = utils;
    }
  }
  private _loads: boolean[];
  public errors: boolean[];
  public omForm: FormGroup;
  public omReport: OMReport;
  public date: any[];
  public taskItems: any[];
  public personnelNames: string[];
  public procedures: number[];
  public editable: boolean;
  public newPersonnel: string;
  public signatureThumbnail: string;
  public evidenceThumbnail: string;
  public name: string;
  public load: boolean;
  private _signatureElement: any;
  private _signature: FormData;
  private _evidenceElement: any;
  private _evidence: FormData;
  private _indexTask: number;
  private _copyLastTask: OMReport;
  private _subscriptionShared: Subscription;
  private _subscriptionLoader: Subscription;
  constructor(
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _formBuilder: FormBuilder,
    private _imageVisor: ImageVisorService,
    private _snackBarService: SnackBarService,
    private _sharedService: SharedService,
    private _signatureService: SignaturePadService,
    private _proceduresService: ModalProceduresService,
    private _uploadFile: UploadFileService
  ) {
    this._loads = [false,false];
    this.errors = [false, false, false];
    this.date = [];
    this.taskItems = [];
    this._indexTask = 0;
    this.personnelNames = [];
    this.procedures = [];
    this.editable = false;
  }

  ngOnInit() {
    this.initOmForm();
    this.detectNotifications();
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load=>{this.load = load});
  }

  ngOnDestroy() {
    this.editable = false;
    this._subscriptionShared.unsubscribe();
    this._subscriptionLoader.unsubscribe();
  }

  private detectNotifications(): void {
    this._subscriptionShared = this._sharedService.getNotifications().subscribe(response => {
      switch (response.type) {
        case SharedTypeNotification.EditTask:
          if (response.value === 1) {
            this.startEditFormat();
          }
          break;
        default:
          break;
      }
    });
  }

  private initOmForm(): void {
    this.omForm = this._formBuilder.group({
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      maintenanceType: ['', [Validators.required]],
      activityType: ['', [Validators.required]],
      personnelType: ['', [Validators.required]],
      cottonClothes: [false, []],
      faceMask: [false, []],
      gloves: [false, []],
      kneepads: [false, []],
      protectiveGoggles: [false, []],
      industrialShoes: [false, []],
      goggles: [false, []],
      helmet: [false, []],
      toolsAndMaterials: ['', []],
      description: ['', []],
      observations: ['', []]
    });
  }

  private patchForm(task: any): void {
    this.omReport = {
      activityType: task.activityType || undefined,
      cottonClothes: task.cottonClothes || undefined,
      date: task.date || undefined,
      description: task.description || undefined,
      endTime: task.endTime || undefined,
      faceMask: task.faceMask || undefined,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      gloves: task.gloves || undefined,
      goggles: task.goggles || undefined,
      helmet: task.helmet || undefined,
      hwgReport: task.hwgReport || undefined,
      id: task.id || undefined,
      industrialShoes: task.industrialShoes || undefined,
      kneepads: task.kneepads || undefined,
      maintenanceType: task.maintenanceType || undefined,
      managerName: task.managerName || undefined,
      name: task.name || undefined,
      observations: task.observations || undefined,
      personnelNames: task.personnelNames || undefined,
      personnelType: task.personnelType || undefined,
      procedures: task.procedures || undefined,
      protectiveGoggles: task.protectiveGoggles || undefined,
      signature: task.signature || undefined,
      startTime: task.startTime || undefined,
      taskId: task.taskId || undefined,
      toolsAndMaterials: task.toolsAndMaterials || undefined
    };
    this.omForm.patchValue({
      startTime: this.omReport.startTime,
      endTime: this.omReport.endTime,
      maintenanceType: this.omReport.maintenanceType,
      activityType: this.omReport.activityType,
      personnelType: this.omReport.personnelType,
      cottonClothes: this.omReport.cottonClothes,
      faceMask: this.omReport.faceMask,
      gloves: this.omReport.gloves,
      kneepads: this.omReport.kneepads,
      protectiveGoggles: this.omReport.protectiveGoggles,
      industrialShoes: this.omReport.industrialShoes,
      goggles: this.omReport.goggles,
      helmet: this.omReport.helmet,
      toolsAndMaterials: this.omReport.toolsAndMaterials,
      description: this.omReport.description,
      observations: this.omReport.observations
    });
    this.date = UtilitiesService.convertDate(this.omReport.date);
    this.omForm.disable();
  }

  private resetElements(): void {
    this.omReport = undefined;
    this.omForm.reset();
    this.omForm.disable();
    if(this.task.original.status !== 4){
      this.startEditFormat(true);
    }
  }

  private getOMReport(): void {
    this._api.getTaskInformation(this._taskId, 1).subscribe(response => {
      switch (response.code) {
        case 200:
          if (response.items) {
            this.taskItems = UtilitiesService.sortJSON(response.items, 'folio', 'desc');
            this._indexTask = 0;
            this.patchForm(this.taskItems[0]);
          } else {
            this.resetElements();
          }
          break;
        default:
          this.resetElements();
          break;
      }
    });
  }

  public seeEvidence(): void {
    if (this.task.original.status !== 4) {
      return;
    }
    if (this.taskItems[this._indexTask].fileCS) {
      this._imageVisor.open(this.taskItems[this._indexTask].fileCS);
    } else {
      this._snackBarService.openSnackBar('Esta tarea no cuenta con evidencia', 'OK', 3000);
    }
  }

  public changeTask(ev: any) {
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }

  private startEditFormat(isNewLoad?: boolean): void {
    let today: any = new Date();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    today = UtilitiesService.createPersonalTimeStamp(today);
    this.date = UtilitiesService.convertDate(today.timeStamp);
    this.editable = true;
    this.name = user.completeName;
    if(!isNewLoad){
      this._copyLastTask = this.omReport;
      this.procedures = this.omReport.procedures || [];
      this.personnelNames = this.omReport.personnelNames || [];
      if (this.omReport.fileCS){
        this._evidenceElement = this.omReport.fileCS;
        this.evidenceThumbnail = this.omReport.fileCS.thumbnail;
      }
      this.omReport.date = undefined;
      this.omReport.signature = undefined;
      this.omReport.folio = undefined;
    }
    this.omForm.enable();
  }

  public addRemoveArrayItem(type: number, isAdd: boolean, index: number): void {
    switch (type) {
      case 1:
        if (isAdd) {
          if (UtilitiesService.removeDiacritics(this.newPersonnel).length === 0) {
            return;
          }
          this.personnelNames.push(this.newPersonnel);
          this.newPersonnel = '';
          this.errors[0] = false;
        } else {
          this.personnelNames.splice(index, 1);
        }
        break;
      case 2:
        if (isAdd) {
          this._proceduresService.open(
            {utils: this.utils.procedures, proceduresSelected: this.procedures}
          ).afterClosed().subscribe(response => {
            switch (response.code) {
              case 1:
                this.procedures = response.data;
                break;
            }
          });
        } else {
          this.procedures.splice(index, 1);
        }
        break;
    }
  }

  public changeTime(ev: any, type: string): void {
    this.omForm.patchValue({
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
    this.evidenceThumbnail = ev.url;
    this._loads[0] = true;
    this._evidence = new FormData();
    this._evidence.append('path', 'Task'+this._taskId);
    this._evidence.append('fileName', 'evidence-'+this._taskId + new Date().getTime() + '.png');
    this._evidence.append('isImage', 'true');
    this._evidence.append('file', ev.blob);
    this.errors[2] = false;
  }

  public deleteEvidence(): void {
    this.evidenceThumbnail = undefined;
    this._loads[0] = false;
    this._evidence = undefined;
  }


  public validateForm(value: any): void {
    if (this.personnelNames.length === 0) {
      this.errors[0] = true;
    }
    if(!value.cottonClothes &&
      !value.faceMask &&
      !value.gloves &&
      !value.goggles &&
      !value.helmet &&
      !value.industrialShoes &&
      !value.kneepads &&
      !value.protectiveGoggles){
      this.errors[1] = true;
    }
    if (this.task.original.evidence && !this.evidenceThumbnail) {
      this.errors[2] = true;
    }
    if(this.errors[0] || this.errors[1] || this.errors[2] || this.omForm.invalid){
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

  private saveReport(value: any): void{
    let date: any = new Date();
    date = UtilitiesService.createPersonalTimeStamp(date);
    this.omReport = {
      activityType: value.activityType,
      cottonClothes: value.cottonClothes,
      date: date.timeStamp,
      description: value.description || undefined,
      endTime: value.endTime,
      fileCS: this._evidenceElement || undefined,
      faceMask: value.faceMask,
      gloves: value.gloves,
      goggles: value.goggles,
      helmet: value.helmet,
      industrialShoes: value.industrialShoes,
      kneepads: value.kneepads,
      maintenanceType: value.maintenanceType,
      name: this.name,
      observations: value.observations || undefined,
      personnelNames: this.personnelNames,
      personnelType: value.personnelType,
      procedures: this.procedures || undefined,
      protectiveGoggles: value.protectiveGoggles,
      signature: this._signatureElement,
      startTime: value.startTime,
      taskId: this._taskId,
      toolsAndMaterials: value.toolsAndMaterials || undefined
    };
    if(this._copyLastTask){
      this.omReport.id = this._copyLastTask.id;
    }
    if (this.task.original.hwg){
      this.omReport.hwgReport = this._copyLastTask?this._copyLastTask.hwgReport : undefined;
    }
    this._api.createTask(this.omReport, 1).subscribe(response=>{
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
            this.validateForm(this.omForm.value);
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
            this.validateForm(this.omForm.value);
          }
        });
        break;
      default:
        break;
    }
  }

  public changeEquipment(ev: any){
    this.errors[1] = false;
  }

}
