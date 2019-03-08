/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnInit} from '@angular/core';
import {IncidenceReport} from '@app/core/interfaces/interfaces';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {ApiService} from '@app/core/services/api/api.service';
import {ImageVisorService} from '@app/core/components/image-visor/image-visor.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-incidence-report',
  templateUrl: './incidence-report.component.html',
  styleUrls: ['./incidence-report.component.scss']
})
export class IncidenceReportComponent implements OnInit {
  private _taskId: string;
  public task: any;
  public utils: any;
  @Input() set taskIncidenceInfo(taskObj: any){
    if(taskObj){
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getIncidenceReport();
    }
  }
  @Input() set utilities(utils: any){
    if (utils){
      this.utils = utils;
    }
  }
  public load: boolean;
  public incidenceForm: FormGroup;
  public incidenceReport: IncidenceReport;
  public date: any[];
  public taskItems: any[];
  private _indexTask: number;

  constructor(
    private _api:ApiService,
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
    this.initIncidenceForm();
  }

  private initIncidenceForm(): void {
    this.incidenceForm = this._formBuilder.group({
      time: ['',[]],
      area: ['',[]],
      description: ['',[]]
    });
  }


  private patchForm(task: any):void {
    this.incidenceReport = {
      area: task.area || undefined,
      date: task.date || undefined,
      description: task.description || undefined,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      id: task.id || undefined,
      name: task.name || undefined,
      procedures: task.procedures || [''],
      signature: task.signature || undefined,
      taskId: task.taskId || undefined,
      time: task.time || undefined
    };
    this.incidenceForm.patchValue({
      time: this.incidenceReport.time,
      area: this.incidenceReport.area,
      description: this.incidenceReport.description
    });
    console.log()
    this.date = UtilitiesService.convertDate(this.incidenceReport.date);
    this.incidenceForm.disable();
  }

  private getIncidenceReport(): void{
    this._api.getTaskInformation(this._taskId, 9).subscribe(response=>{
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

  private resetElements(): void {
    this.incidenceReport = undefined;
    this.incidenceForm.reset();
    this.incidenceForm.disable();
  }

  public changeTask(ev: any){
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }

  public seeEvidence():void{
    if(this.taskItems[this._indexTask].fileCS){
      this._imageVisor.open(this.taskItems[this._indexTask].fileCS);
    }else{
      this._snackBarService.openSnackBar('Esta tarea no cuenta con evidencia', 'OK',3000);
    }
  }
}
