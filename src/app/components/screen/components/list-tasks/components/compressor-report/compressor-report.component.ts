/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompressorReport} from '@app/core/interfaces/interfaces';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {ApiService} from '@app/core/services/api/api.service';

@Component({
  selector: 'app-compressor-report',
  templateUrl: './compressor-report.component.html',
  styleUrls: ['./compressor-report.component.scss']
})
export class CompressorReportComponent implements OnInit {
  public load: boolean;
  public compressorReport: CompressorReport;
  public compForm: FormGroup;
  public date: any[];
  constructor(
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _formBuilder: FormBuilder
  ) {
    this.date = [];
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
    }
  }

}
