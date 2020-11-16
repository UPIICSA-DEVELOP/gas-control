/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HashService} from '@app/utils/utilities/hash.service';
import {Constants} from '@app/utils/constants/constants.utils';
import {PdfVisorService} from '@app/shared/components/pdf-visor/pdf-visor.service';
import {Procedure} from '@app/utils/interfaces/procedure';
import {LocalStorageService} from '@maplander/core';
import {Person} from '@app/utils/interfaces/person';
import {CustomProcedure} from '@app/utils/interfaces/customProcedure';
import {ApiService} from '@app/core/services/api/api.service';
import {ProceduresConfig} from '@app/shared/components/modal-procedures/modal-procedures.service';

@Component({
  selector: 'app-modal-procedures',
  templateUrl: './modal-procedures.component.html',
  styleUrls: ['./modal-procedures.component.scss']
})
export class ModalProceduresComponent implements OnInit {
  public procedures: Procedure[];
  public stationProcedures: CustomProcedure[];
  public selected: boolean[];
  public selectedTwo: boolean[];
  public seeCheckbox: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: ProceduresConfig,
    private _dialogRef: MatDialogRef<ModalProceduresComponent>,
    private _pdf: PdfVisorService,
    private _api: ApiService
  ) {
    this.seeCheckbox = true;
    this.selected = [];
    this.selectedTwo = [];
    this.stationProcedures = [];
    this.procedures = this._data.utils;
  }

  ngOnInit() {
    this.seeCheckbox = this._data.notVisibleChecks;
    this.getStationProcedures();
  }

  public finishSelectProcedures(): void {
    const procedure = [];
    this.selected.forEach((item, index) => {
      if (item === true) {
        procedure.push(index + 1);
      }
    });
    this.selectedTwo.forEach((item, index) => {
      if (item === true) {
        procedure.push(this.stationProcedures[index].customProcedureId);
      }
    });
    this._dialogRef.close({code: 1, data: procedure});
  }

  public openFile(url: any): void {
    const user = LocalStorageService.getItem<Person>(Constants.UserInSession);
    switch (user.role) {
      case 1:
      case 2:
      case 7:
        this._pdf.open({urlOrFile: HashService.set('123456$#@$^@1ERF', url)});
        break;
      case 3:
      case 4:
      case 5:
      case 6:
        this._pdf.open({urlOrFile: HashService.set('123456$#@$^@1ERF', url), hideDownload: true});
        break;
    }
  }

  private initArray(): void {
    for (let i = 0; i < this.procedures.length; i++) {
      this.selected.push(false);
    }
    for (let i = 0; i < this.procedures.length; i++) {
      for (let j = 0; j < this._data.proceduresSelected.length; j++) {
        if (this._data.proceduresSelected[j] === (i + 1)) {
          this.selected[i] = true;
        }
      }
    }
    for (let i = 0; i < this.stationProcedures.length; i++) {
      this.selectedTwo.push(false);
    }
    for (let i = 0; i < this.stationProcedures.length; i++) {
      for (let j = 0; j < this._data.proceduresSelected.length; j++) {
        if (this._data.proceduresSelected[j] === this.stationProcedures[i].customProcedureId) {
          this.selectedTwo[i] = true;
        }
      }
    }
  }

  private getStationProcedures(): void {
    this._api.customProcedureList(this._data.stationId).subscribe((response) => {
      if (response.items) {
        this.stationProcedures = this.stationProcedures.concat(response.items || []);
        this.initArray();
      }
    });
  }
}
