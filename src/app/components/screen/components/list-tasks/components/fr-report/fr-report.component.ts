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

@Component({
  selector: 'app-fr-report',
  templateUrl: './fr-report.component.html',
  styleUrls: ['./fr-report.component.scss']
})
export class FrReportComponent implements OnInit {
  private _taskId: string;
  @Input() set taskFrInfo(taskObj: any){
    if(taskObj){
      this._taskId = taskObj;
    }
  }
  public load: boolean;
  public frForm: FormGroup;
  public frReport: FRReport;
  public date: any[];

  constructor(
    private _api:ApiService,
    private _apiLoader: ApiLoaderService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this._apiLoader.getProgress().subscribe(load=>{this.load = load});
  }

  private initFrReport(): void {
    this.frForm = this._formBuilder.group({

    })
  }

}
