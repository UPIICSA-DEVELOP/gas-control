/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnInit} from '@angular/core';
import {FRReport} from '@app/core/interfaces/interfaces';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {UtilitiesService} from '@app/core/utilities/utilities.service';

@Component({
  selector: 'app-fr-report',
  templateUrl: './fr-report.component.html',
  styleUrls: ['./fr-report.component.scss']
})
export class FrReportComponent implements OnInit {
  private _taskId: string;
  public task: any;
  @Input() set taskFrInfo(taskObj: any){
    if(taskObj){
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getFRReport();
    }
  }
  public load: boolean;
  public frForm: FormGroup;
  public frReport: FRReport;
  public date: any[];
  public taskItems: any[];
  private _indexTask: number;

  constructor(
    private _api:ApiService,
    private _apiLoader: ApiLoaderService,
    private _formBuilder: FormBuilder
  ) {
    this.date = [];
    this.taskItems = [];
    this._indexTask = 0;
  }

  ngOnInit() {
    this._apiLoader.getProgress().subscribe(load=>{this.load = load});
    this.initFrReport();
  }

  private initFrReport(): void {
    this.frForm = this._formBuilder.group({
      startTime: ['',[]],
      endTime: ['',[]],
      remissionNumber: ['',[]],
      remission: ['',[]],
      volumetric: ['',[]],
      magna:[false,[]],
      premium: [false,[]],
      diesel: [false,[]],
      receiveName: ['',[]]
    });
  }


  private patchForm(task: any):void {
    this.frReport = {
      date: task.date || undefined,
      diesel: task.diesel || undefined,
      endTime: task.endTime || undefined,
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
      startTime: task.startTime || undefined,
      taskId: task.taskId || undefined,
      volumetric: task.volumetric || undefined
    };
    this.frForm.patchValue({
      startTime: this.frReport.startTime,
      endTime: this.frReport.endTime,
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
    })
  }

  private resetElements(): void {
    this.frReport = undefined;
    this.frForm.reset();
    this.frForm.disable();
  }

  public changeTask(ev: any){
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }

}
