/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnInit} from '@angular/core';
import {ScannedReport} from '@app/core/interfaces/interfaces';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';

@Component({
  selector: 'app-scanned-report',
  templateUrl: './scanned-report.component.html',
  styleUrls: ['./scanned-report.component.scss']
})
export class ScannedReportComponent implements OnInit {
  private _taskId: string;
  @Input() set taskScannedInfo(taskObj: any){
    if (taskObj){
      this._taskId = taskObj.id;
    }
  }
  public load: boolean;

  public scannedReport: ScannedReport;
  public date: any[];
  constructor(
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
  ) { }

  ngOnInit() {
    this._apiLoader.getProgress().subscribe(load=>{this.load = load});
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
  }

}
