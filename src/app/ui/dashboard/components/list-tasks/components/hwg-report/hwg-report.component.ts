/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {DOCUMENT} from '@angular/common';
import {HWGReport} from '@app/utils/interfaces/reports/hwg-report';

@Component({
  selector: 'app-hwg-report',
  templateUrl: './hwg-report.component.html',
  styleUrls: ['./hwg-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HwgReportComponent implements OnInit, OnDestroy {
  public report: HWGReport;

  @Input() set taskHwgInfo(reportObj: HWGReport) {
    if (reportObj) {
      this.initHwgForm();
      this.report = reportObj;
      this.getHWGReport();
    } else {
      this.initHwgForm();
      this.resetElements();
    }
  }

  @Input() set validate(ban: boolean) {
    if (ban) {
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

  ngOnDestroy(): void {
    this._subscriptionShared.unsubscribe();
  }

  private getNotifications(): void {
    this._subscriptionShared = this._sharedService.getNotifications().subscribe(response => {
      if (response.type === SharedTypeNotification.HwgActive) {
        this.startEditComplementReport(response.value);
      }
    });
  }

  private initHwgForm(): void {
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

  private resetElements(): void {
    this.hwgReport = undefined;
    this.hwgForm.reset();
    this.hwgForm.disable();
  }

  private patchForm(report: HWGReport): void {
    this.hwgReport = {
      area: report.area || null,
      corrosive: report.corrosive || null,
      explosive: report.explosive || null,
      flammable: report.flammable || null,
      quantity: report.quantity || null,
      reactive: report.reactive || null,
      temporaryStorage: report.temporaryStorage || null,
      toxic: report.toxic || null,
      unity: report.unity || null,
      waste: report.waste || null
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

  private getHWGReport(): void {
    if (this.report) {
      this.patchForm(this.report);
    } else {
      this.resetElements();
    }
  }

  private startEditComplementReport(isNewLoad: boolean): void {
    this.editable = true;
    if (!isNewLoad) {
      this._copyTask = this.hwgReport;
    }
    this.hwgForm.enable();
  }

  public validateForm(value: any): void {
    if (!value.corrosive && !value.reactive && !value.explosive && !value.toxic && !value.flammable) {
      this.error = true;
    }
    if (this.error || this.hwgForm.invalid) {
      this.formInformation.emit({valid: false, value: undefined});
    } else {
      this.formInformation.emit({valid: true, value: value});
    }
  }

  public changeFeatures(): void {
    this.error = false;
  }

}
