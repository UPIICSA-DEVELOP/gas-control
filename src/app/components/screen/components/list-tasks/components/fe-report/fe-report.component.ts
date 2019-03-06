/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnInit} from '@angular/core';
import {FEReport} from '@app/core/interfaces/interfaces';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {ApiService} from '@app/core/services/api/api.service';

@Component({
  selector: 'app-fe-report',
  templateUrl: './fe-report.component.html',
  styleUrls: ['./fe-report.component.scss']
})
export class FeReportComponent implements OnInit {
  private _taskId: string;
  @Input() set taskFeInfo(taskObj: any){
    if(taskObj){
      this._taskId = taskObj;
    }
  }
  public load: boolean;
  public feForm: FormGroup;
  public feReport: FEReport;
  public date: any[];

  constructor(
    private _api:ApiService,
    private _apiLoader: ApiLoaderService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this._apiLoader.getProgress().subscribe(load=>{this.load = load});
    this.initFeReport();
  }

  private initFeReport(): void {
    this.feForm = this._formBuilder.group({
      startTime: ['',[]],
      endTime:['',[]]
    });
  }

  private patchFomr(task: any): void {
    this.feReport = {
      date: task.date || undefined,
      endTime: task.endTime || undefined,
      fireExtinguishers: task.fireExtinguishers || undefined,
      folio: task.folio || undefined,
      id: task.id || undefined,
      name: task.name || undefined,
      signature: task.signature || undefined,
      startTime: task.startTime || undefined,
      taskId: task.taskId || undefined
    };
    this.feForm.patchValue({
      startTime: this.feReport.startTime,
      endTime: this.feReport.endTime
    })
  }

}
