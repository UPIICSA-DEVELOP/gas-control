/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {OMReport} from '@app/core/interfaces/interfaces';

@Component({
  selector: 'app-om-report',
  templateUrl: './om-report.component.html',
  styleUrls: ['./om-report.component.scss']
})
export class OmReportComponent implements OnInit {

  @Input() public taskData: any;
  public load: boolean;
  public omForm: FormGroup;
  public  omReport: OMReport;
  constructor(
    private _api: ApiService,
    private _formBuilder: FormBuilder,
    private _apiLoader: ApiLoaderService,
  ) { }

  ngOnInit() {
  }


  private initOmForm():void{

  }
}
