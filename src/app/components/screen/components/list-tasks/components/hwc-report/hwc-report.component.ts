/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HWCReport} from '@app/core/interfaces/interfaces';
import {UtilitiesService} from '@app/core/utilities/utilities.service';

@Component({
  selector: 'app-hwc-report',
  templateUrl: './hwc-report.component.html',
  styleUrls: ['./hwc-report.component.scss']
})
export class HwcReportComponent implements OnInit {
  private _taskId: string;
  public task: any;
  @Input() set taskHwcInfo(taskObj: any){
    if (taskObj){
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getHWCReport();
    }
  }
  public load: boolean;
  public hwcForm: FormGroup;
  public hwcReport: HWCReport;
  public date: any[];
  public taskItems: any[];
  private _indexTask: number;
  constructor(
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _formBuilder: FormBuilder
  ) {
    this.date = [];
    this.taskItems = [];
    this._indexTask = 0;
  }

  ngOnInit() {
    this._apiLoader.getProgress().subscribe(load=>{this.load=load});
    this.initHwcForm();
  }

  private initHwcForm(): void{
    this.hwcForm = this._formBuilder.group({
      waste:['',[]],
      quantity: ['',[]],
      unity: ['',[]],
      carrierCompany: ['',[]],
      finalDestination: ['',[]]
    });
  }

  private patchForm(task: any): void{
    this.hwcReport = {
      carrierCompany: task.carrierCompany || undefined,
      date: task.date || undefined,
      finalDestination: task.finalDestination || undefined,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      id: task.id || undefined,
      manifest: task.manifest || undefined,
      manifestNumber: task.manifestNumber || undefined,
      name: task.name || undefined,
      nextPhase: task.nextPhase || undefined,
      quantity: task.quantity || undefined,
      signature: task.signature || undefined,
      taskId: task.taskId || undefined,
      unity: task.unity || undefined,
      waste: task.waste || undefined
    };
    this.hwcForm.patchValue({
      waste: this.hwcReport.waste,
      quantity: this.hwcReport.quantity,
      unity: this.hwcReport.unity,
      carrierCompany: this.hwcReport.carrierCompany,
      finalDestination: this.hwcReport.finalDestination
    });
    this.date = UtilitiesService.convertDate(this.hwcReport.date);
    this.hwcForm.disable();
  }

  private getHWCReport(): void{
    this._api.getTaskInformation(this._taskId, 6).subscribe(response=>{
      switch (response.code){
        case 200:
          if(response.items){
            this.taskItems = UtilitiesService.sortJSON(response.items, 'folio', 'desc');
            this._indexTask = 0;
            this.patchForm(this.taskItems[0])
          }
          break;
        default:
          this.resetElements();
          break;
      }
    })
  }

  private resetElements(): void{
    this.hwcReport = undefined;
    this.hwcForm.reset();
    this.hwcForm.disable();
  }

  public changeTask(ev: any){
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }

}
