/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import { Component, OnInit } from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HWGReport} from '@app/core/interfaces/interfaces';

@Component({
  selector: 'app-hwg-report',
  templateUrl: './hwg-report.component.html',
  styleUrls: ['./hwg-report.component.scss']
})
export class HwgReportComponent implements OnInit {
  public load: boolean;
  public hwgReport: HWGReport;
  public hwgForm: FormGroup;
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
    this.initHwgForm();
  }

  private initHwgForm():void{
    this.hwgForm = this._formBuilder.group({
      area: ['', [Validators.required]],
      waste: ['', [Validators.required]],
      corrosive: ['', []],
      reactive: ['', []],
      explosive: ['', []],
      toxic: ['', []],
      flammable: ['', []],
      quantity: ['', [Validators.required]],
      unity: ['', [Validators.required]],
      temporaryStorage: ['', [Validators.required]]
    });
  }

  private patchForm(task: any):void{
    this.hwgReport = {
      area: task.area || undefined,
      corrosive: task.corrosive || undefined,
      explosive: task.explosive || undefined,
      fileCS: task.fileCS || undefined,
      flammable: task.flammable || undefined,
      quantity: task.quality || undefined,
      reactive: task.reactive || undefined,
      temporaryStorage: task.temporaryStorage || undefined,
      toxic: task.toxic || undefined,
      unity: task.unity || undefined,
      waste: task.waste || undefined
    }
  }

}
