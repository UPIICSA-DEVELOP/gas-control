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
import {ImageVisorService} from '@app/core/components/image-visor/image-visor.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {UtilitiesService} from '@app/core/utilities/utilities.service';

@Component({
  selector: 'app-vrs-report',
  templateUrl: './vrs-report.component.html',
  styleUrls: ['./vrs-report.component.scss']
})
export class VrsReportComponent implements OnInit {
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
  private _indexTask: number;
  constructor(
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _formBuilder: FormBuilder,
    private _imageVisor: ImageVisorService,
    private _snackBarService: SnackBarService
  ) {
    this.date = [];
    this.taskItems = [];
    this._indexTask = 0;
  }

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

  private resetElements(): void{
    this.vrsReport = undefined;
    this.vrsForm.reset();
    this.vrsForm.disable();
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

}
