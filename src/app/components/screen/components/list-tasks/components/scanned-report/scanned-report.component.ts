/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnInit} from '@angular/core';
import {ScannedReport} from '@app/core/interfaces/interfaces';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {UtilitiesService} from '@app/core/utilities/utilities.service';

@Component({
  selector: 'app-scanned-report',
  templateUrl: './scanned-report.component.html',
  styleUrls: ['./scanned-report.component.scss']
})
export class ScannedReportComponent implements OnInit {
  private _taskId: string;
  public task: any;
  @Input() set taskScannedInfo(taskObj: any){
    if (taskObj){
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getScannedReport();
    }
  }
  public load: boolean;

  public scannedReport: ScannedReport;
  public date: any[];
  public taskItems: any[];
  private _indexTask: number;
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
    console.log(this.scannedReport);
    this.date = UtilitiesService.convertDate(this.scannedReport.date);
  }

  private getScannedReport(): void{
    this._api.getTaskInformation(this._taskId,5).subscribe(response=>{
      switch (response.code){
        case 200:
          if(response.items){
            this.taskItems = UtilitiesService.sortJSON(response.items, 'folio', 'desc');
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

  private resetElements(): void{
    this.scannedReport = undefined;
  }

  public changeTask(ev: any){
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }

}
