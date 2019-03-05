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

@Component({
  selector: 'app-om-report',
  templateUrl: './om-report.component.html',
  styleUrls: ['./om-report.component.scss']
})
export class OmReportComponent implements OnInit {
  private _taskId: string;
  @Input() set taskOMInfo(id: any){
    if(id){
      this._taskId = id;
    }
  }
  public load: boolean;
  public omForm: FormGroup;
  public  omReport: OMReport;
  public date: any[];
  constructor(
    private _api: ApiService,
    private _formBuilder: FormBuilder,
    private _apiLoader: ApiLoaderService,
  ) {
    this.date = [];
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


  }
}
