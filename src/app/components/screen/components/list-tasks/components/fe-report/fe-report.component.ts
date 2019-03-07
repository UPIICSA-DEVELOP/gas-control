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
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {ImageVisorService} from '@app/core/components/image-visor/image-visor.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-fe-report',
  templateUrl: './fe-report.component.html',
  styleUrls: ['./fe-report.component.scss']
})
export class FeReportComponent implements OnInit {
  private _taskId: string;
  public task: any;
  @Input() set taskFeInfo(taskObj: any){
    if(taskObj){
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getFEReport();
    }
  }
  public load: boolean;
  public feForm: FormGroup;
  public feReport: FEReport;
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

  }

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

  private resetElements(): void{
    this.feReport = undefined;
    this.feForm.reset();
    this.feForm.disable();
  }

  private patchForm(task: any): void {
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
    });
    this.date = UtilitiesService.convertDate(this.feReport.date);
    this.feForm.disable();
  }

  public getFEReport(): void{
    this._api.getTaskInformation(this._taskId, 8).subscribe(response=>{
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
