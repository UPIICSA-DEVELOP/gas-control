/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {VRSReport} from '@app/core/interfaces/interfaces';

@Component({
  selector: 'app-vrs-report',
  templateUrl: './vrs-report.component.html',
  styleUrls: ['./vrs-report.component.scss']
})
export class VrsReportComponent implements OnInit {
  private _taskId: string;
  @Input() set taskVrsInfo(taskObj: any){
    if(taskObj){
      this._taskId = taskObj.id;
    }
  }
  public load: boolean;
  public vrsForm: FormGroup;
  public vrsReport: VRSReport;
  public date: any[];
  constructor(
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this._apiLoader.getProgress().subscribe(load=>{this.load = load});
    this.initVrsForm();
  }

  private initVrsForm():void{
    this.vrsForm = this._formBuilder.group({
      magna: [false, []],
      premium: [false, []],
      fuelNozzle: ['', []],
      longHose: ['', []],
      breakAway: ['', []],
      shortHose: ['', []],
      equipment: ['', []],
      vrsAlarm: ['', []],
      emergencyStop: ['', []],
      observations: ['', []]
    });
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
    })
  }

}
