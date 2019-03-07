/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {OMReport} from '@app/core/interfaces/interfaces';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {ImageVisorService} from '@app/core/components/image-visor/image-visor.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-om-report',
  templateUrl: './om-report.component.html',
  styleUrls: ['./om-report.component.scss']
})
export class OmReportComponent implements OnInit {
  private _taskId: string;
  public task: any;
  public utils: any;
  @Input() set taskOMInfo(taskObj: any){
    if(taskObj){
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getOMReport();
    }
  }
  @Input() set utilities(utils: any){
    if (utils){
      this.utils = utils;
    }
  }
  public load: boolean;
  public omForm: FormGroup;
  public  omReport: OMReport;
  public date: any[];
  public taskItems: any[];
  public personnelNames: string[];
  private _indexTask: number;
  constructor(
    private _api: ApiService,
    private _formBuilder: FormBuilder,
    private _apiLoader: ApiLoaderService,
    private _imageVisor: ImageVisorService,
    private _snackBarService: SnackBarService
  ) {
    this.date = [];
    this.taskItems = [];
    this._indexTask = 0;
    this.personnelNames = [''];
  }

  ngOnInit() {
    this._apiLoader.getProgress().subscribe(load=>{this.load = load});
    this.initOmForm();
  }


  private initOmForm():void{
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

  private patchForm(task: any):void{
    console.log(task);
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
  }

  private getOMReport():void {
    this._api.getTaskInformation(this._taskId, 1).subscribe(response=>{
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
}
