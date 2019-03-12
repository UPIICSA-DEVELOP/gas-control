/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnInit} from '@angular/core';
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
  public task: any;
  @Input() set taskHwgInfo(taskObj: any){
    if(taskObj){
      this.initHwgForm();
      this.task = taskObj;
      this.getHWGReport();
    }else{
      this.initHwgForm();
      this.resetElements();
    }
  }
  public load: boolean;
  public hwgReport: HWGReport;
  public hwgForm: FormGroup;
  constructor(
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this._apiLoader.getProgress().subscribe(load=>{this.load = load});
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

  private resetElements():void{
    this.hwgReport = undefined;
    this.hwgForm.reset();
    this.hwgForm.disable();
  }

  private patchForm(task: any):void{
    this.hwgReport = {
      area: task.area || undefined,
      corrosive: task.corrosive || undefined,
      explosive: task.explosive || undefined,
      fileCS: task.fileCS || undefined,
      flammable: task.flammable || undefined,
      quantity: task.quantity || undefined,
      reactive: task.reactive || undefined,
      temporaryStorage: task.temporaryStorage || undefined,
      toxic: task.toxic || undefined,
      unity: task.unity || undefined,
      waste: task.waste || undefined
    };
    this.hwgForm.patchValue({
      area: this.hwgReport.area,
      waste: this.hwgReport.waste,
      corrosive: this.hwgReport.corrosive,
      reactive: this.hwgReport.reactive,
      explosive: this.hwgReport.explosive,
      toxic: this.hwgReport.toxic,
      flammable: this.hwgReport.flammable,
      quantity: this.hwgReport.quantity,
      temporaryStorage: this.hwgReport.temporaryStorage,
      unity: this.hwgReport.unity
    });
    this.hwgForm.disable();
  }

  private getHWGReport():void{
    if(this.task){
      this.patchForm(this.task);
    }else{
      this.resetElements();
    }
  }

}
