/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompressorReport} from '@app/core/interfaces/interfaces';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {ApiService} from '@app/core/services/api/api.service';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {ImageVisorService} from '@app/core/components/image-visor/image-visor.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-compressor-report',
  templateUrl: './compressor-report.component.html',
  styleUrls: ['./compressor-report.component.scss']
})
export class CompressorReportComponent implements OnInit {
  private _taskId: string;
  public task: any;
  @Input() set taskCompInfo(taskObj: any){
    if (taskObj){
      this._taskId = taskObj.id;
      this.task = taskObj;
      this.getCompReport();
    }
  }
  public load: boolean;
  public compressorReport: CompressorReport;
  public compForm: FormGroup;
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
    this.initCompForm();
  }

  private initCompForm():void{
    this.compForm = this._formBuilder.group({
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      brand: ['', []],
      model: ['', []],
      controlNumber: ['', []],
      pressure: ['', [Validators.required]],
      purge: ['', [Validators.required]],
      securityValve: ['', [Validators.required]],
      modifications: ['', []],
      observations: ['', []]
    });
  }

  private resetElements(): void {
    this.compressorReport = undefined;
    this.compForm.reset();
    this.compForm.disable();
  }

  private patchForm(task: any):void{
    this.compressorReport = {
      brand: task.brand || undefined,
      controlNumber: task.controlNumber || undefined,
      date: task.date || undefined,
      endTime: task.endTime || undefined,
      fileCS: task.fileCS || undefined,
      folio: task.folio || undefined,
      hwgReport: task.hwgReport || undefined,
      id: task.id || undefined,
      model: task.model || undefined,
      modifications: task.modifications || undefined,
      name: task.name || undefined,
      observations: task.observations || undefined,
      pressure: task.pressure || undefined,
      purge: task.purge || undefined,
      securityValve: task.securityValve || undefined,
      signature: task.signature || undefined,
      startTime: task.startTime || undefined,
      taskId: task.taskId || undefined
    };
    this.compForm.patchValue({
      startTime: this.compressorReport.startTime,
      endTime: this.compressorReport.endTime,
      brand: this.compressorReport.brand,
      model: this.compressorReport.model,
      controlNumber: this.compressorReport.controlNumber,
      pressure: this.compressorReport.pressure,
      purge: this.compressorReport.purge,
      securityValve: this.compressorReport.securityValve,
      modifications: this.compressorReport.modifications,
      observations: this.compressorReport.observations
    });
    this.date = UtilitiesService.convertDate(this.compressorReport.date);
    this.compForm.disable();
  }

  private getCompReport(): void{
    this._api.getTaskInformation(this._taskId, 2).subscribe(response=>{
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

  public changeTask(ev: any){
    this._indexTask = ev.pageIndex;
    this.patchForm(this.taskItems[this._indexTask]);
  }
}
