/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HWGReport} from '@app/utils/interfaces/interfaces';
import {Subscription} from 'rxjs/Rx';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-hwg-report',
  templateUrl: './hwg-report.component.html',
  styleUrls: ['./hwg-report.component.scss']
})
export class HwgReportComponent implements OnInit, OnDestroy {
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
  @Input() set validate(ban: boolean){
    if(ban){
      this._document.getElementById('hidden-button').click();
    }
  }
  @Output() formInformation: EventEmitter<any>;
  public load: boolean;
  public hwgReport: HWGReport;
  public hwgForm: FormGroup;
  public error: boolean;
  public editable: boolean;
  private _subscriptionShared: Subscription;
  private _copyTask: HWGReport;
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _formBuilder: FormBuilder,
    private _sharedService: SharedService
  ) {
    this.formInformation = new EventEmitter<any>();
    this.editable = false;
    this.error = false;
  }

  ngOnInit() {
    this.getNotifications();
  }

  ngOnDestroy():void{
    this._subscriptionShared.unsubscribe();
  }

  private getNotifications():void{
    this._subscriptionShared = this._sharedService.getNotifications().subscribe(response=>{
      switch (response.type){
        case SharedTypeNotification.HwgActive:
          this.startEditComplementReport(response.value);
          break;
      }
    })
  }

  private initHwgForm():void{
    this.hwgForm = this._formBuilder.group({
      area: ['', [Validators.required]],
      waste: ['', [Validators.required]],
      corrosive: [false, []],
      reactive: [false, []],
      explosive: [false, []],
      toxic: [false, []],
      flammable: [false, []],
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

  private startEditComplementReport(isNewLoad: boolean):void{
    this.editable = true;
    if(!isNewLoad){
      this._copyTask = this.hwgReport
    }
    this.hwgForm.enable();
  }

  public validateForm(value: any): void{
    if(!value.corrosive && !value.reactive && !value.explosive && !value.toxic && !value.flammable){
      this.error = true;
    }
    if(this.error || this.hwgForm.invalid){
      this.formInformation.emit({valid: false, value: undefined});
    }else{
      this.formInformation.emit({valid: true, value: value});
    }
  }

  public changeFeatures(ev: any):void{
    this.error = false;
  }

}
