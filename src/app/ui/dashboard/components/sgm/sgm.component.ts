/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ApiService} from '@app/core/services/api/api.service';
import {PdfVisorService} from '@app/shared/components/pdf-visor/pdf-visor.service';
import {DialogService} from '@app/shared/components/dialog/dialog.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {Subscription} from 'rxjs';
import {HashService} from '@app/utils/utilities/hash.service';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {Constants} from '@app/utils/constants/constants.utils';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {environment} from '@env/environment';
import {MDate} from '@app/utils/class/MDate';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {SgmSelection} from '@app/utils/interfaces/sgm-selection';
import {Station} from '@app/utils/interfaces/station';
import {Task} from '@app/utils/interfaces/task';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {SgmDocument} from '@app/utils/interfaces/sgm-document';

@Component({
  selector: 'app-sgm',
  templateUrl: './sgm.component.html',
  styleUrls: ['./sgm.component.scss']
})
export class SgmComponent implements OnInit, OnDestroy {
  public station: Station;
  public sgmDocument: SgmDocument[];
  public templates: SgmDocument[];
  public load: boolean;
  public software: number;
  public magna: boolean;
  public premium: boolean;
  public diesel: boolean;
  public elementOnView: number;
  public listTasksOne: Task[];
  public listTasksTwo: Task[];
  public generate: boolean;
  public isAvailable: boolean;
  public dateGeneration: string[];
  public isDevelop: boolean;
  public errors: boolean[];
  private _change: boolean;
  private _subscriptionLoader: Subscription;
  private _token: string;
  private _tokenTwo: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data,
    private _matDialogRef: MatDialogRef<SgmComponent>,
    private _api: ApiService,
    private _apiLoader: LoaderService,
    private _pdf: PdfVisorService,
    private _dialogService: DialogService,
    private _snackBarService: SnackBarService
  ) {
    this.errors = [false, false, false, false];
    this.isDevelop = environment.develop;
    this.isAvailable = false;
    this.generate = false;
    this.sgmDocument = [];
    this.templates = [];
    this.software = 0;
    this.magna = false;
    this.premium = false;
    this.diesel = false;
    this.elementOnView = 0;
    this.listTasksOne = [];
    this.listTasksTwo = [];
    this._token = undefined;
    this._tokenTwo = undefined;
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {
      this.load = load;
    });
    this.getStation();
    this.getSgm();
    this.sortSgmArray();
  }

  ngOnDestroy() {
    this._subscriptionLoader.unsubscribe();
  }

  public close(): void {
    if (this._change) {
      this._dialogService.confirmDialog(
        '¿Desea salir sin guardar cambios?',
        '',
        'ACEPTAR',
        'CANCELAR').afterClosed().subscribe(response => {
        if (response.code === 1) {
          this._matDialogRef.close();
        }
      });
    } else {
      this._matDialogRef.close();
    }
  }

  public seeFile(url: any): void {
    const user = LocalStorageService.getItem(Constants.UserInSession);
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

  public saveSgmSelection(): void {
    const selection: SgmSelection = {
      diesel: this.diesel,
      id: this.station.id,
      magna: this.magna,
      premium: this.premium,
      software: this.software
    };
    this._api.saveSgmSelection(selection).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this.getSgm();
        this._change = false;
        this._snackBarService.openSnackBar('Información actualizada', 'OK', 3000);
      } else {
        this._snackBarService.openSnackBar('Ha ocurrido un error, por favor intente más tarde', 'OK', 3000);
      }
    });
  }

  public generateSgm(): void {
    if (this.generate && this.dateGeneration.length !== 0) {
      this._dialogService.confirmDialog(
        'Esta operación reiniciará la fecha para la generación del documento',
        '¿Desea continuar?',
        'ACEPTAR',
        'CANCELAR'
      ).afterClosed().subscribe(response => {
        if (response.code === 1) {
          this.validateSgm();
        }
      });
    } else {
      this.validateSgm();
    }
  }

  public seeSGM(): void {
    this._api.joinPDF(this.station.id, true).subscribe(response => {
      const user = LocalStorageService.getItem(Constants.UserInSession);
      switch (user.role) {
        case 1:
        case 2:
        case 7:
          this._pdf.open({urlOrFile: response});
          break;
        case 3:
        case 4:
        case 5:
        case 6:
          this._pdf.open({urlOrFile: response, hideDownload: true});
          break;
      }
    });
  }

  public changeOptions(newView: number): void {
    if (newView === this.elementOnView) {
      return;
    }
    this.resetErrors();
    this.elementOnView = newView;
  }

  public detectChanges(): void {
    this._change = true;
  }

  private getSgm(): void {
    this._api.getSgm(this._data.stationId).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        if (response.item.sgmSelection) {
          this.software = Number(response.item.sgmSelection.software);
          this.magna = response.item.sgmSelection.magna;
          this.premium = response.item.sgmSelection.premium;
          this.diesel = response.item.sgmSelection.diesel;
        }
        if (response.item.fullSgm) {
          this.generate = true;
          this.dateGeneration = MDate.getDateArray(response.item.fullSgm.date);
          if (response.item.fullSgm.date <= MDate.getTimeStamp(new Date())) {
            this.isAvailable = true;
          }
        }
      } else {
      }
    });
  }

  private validateSgm(): void {
    let error = false;
    if (this.listTasksOne.length === 0) {
      this.errors[0] = true;
      error = true;
    }
    if (this.listTasksTwo.length === 0) {
      this.errors[1] = true;
      error = true;
    }
    if (!this.magna && !this.premium && !this.diesel) {
      this.errors[2] = true;
      error = true;
    }
    if (!this.software) {
      this.errors[3] = true;
      error = true;
    }
    if (error) {
      return;
    } else {
      this._api.fullSgmRequest(this.station.id).subscribe(response => {
        if (response.code === HttpResponseCodes.OK) {
          this.generate = true;
          this.dateGeneration = MDate.getDateArray(response.item.date);
          if (response.item.date <= MDate.getTimeStamp(new Date())) {
            this.isAvailable = true;
          }
        } else {
          this._snackBarService.openSnackBar('Ha ocurrido un error, por favor intente más tarde', 'OK', 3000);
        }
      });
    }
  }

  private getStation(): void {
    this._api.getStation(this._data.stationId).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this.station = response.item;
        if (this.station.stationTaskId) {
          this.getStationTasksAnnexeOne();
          this.getStationTasksAnnexeTwo();
        }
      } else {
        this.station = null;
      }
    });
  }

  private sortSgmArray(): void {
    this._data.utils.sgmDocuments.forEach(item => {
      if (Number(item.id) <= 10) {
        this.sgmDocument.push(item);
      } else {
        this.templates.push(item);
      }
    });
  }

  private buildListTasks(listTask: any): any[] {
    const newList = [];
    if (!listTask) {
      return newList;
    }
    listTask.forEach(item => {
      this._data.utils.taskTemplates.forEach(origin => {
        if (item.type === origin.id) {
          newList.push({
            original: {
              id: item.id,
              type: item.type,
              date: UtilitiesService.convertDate(item.date),
              originalDate: item.date,
              name: origin.name,
              zone: origin.zone,
              level: origin.level,
              hwg: origin.hwg,
              typeReport: origin.typeReport,
              status: item.status,
              evidence: origin.evidence,
              frequency: origin.frequency
            }
          });
        }
      });
    });
    return newList;
  }

  private resetErrors(): void {
    for (let i = 0; i < 4; i++) {
      this.errors[i] = false;
    }
  }

  private getStationTasksAnnexeOne(): void {
    this._token = null;
    this._api.listTask({
      stationTaskId: this.station.stationTaskId,
      startDate: '',
      status: '4',
      endDate: '',
      firstOpen: true,
      type: '31',
      cursor: this._token
    }).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        if (this._token === response.nextPageToken) {
          this._token = null;
        } else {
          this._token = response.nextPageToken;
        }
        this.listTasksOne = this.buildListTasks(response.items);
      } else {
        this.listTasksOne = [];
      }
    });
  }

  private getStationTasksAnnexeTwo(): void {
    this._tokenTwo = null;
    this._api.listTask({
      stationTaskId: this.station.stationTaskId,
      startDate: '',
      status: '4',
      endDate: '',
      firstOpen: true,
      type: '41',
      cursor: this._tokenTwo
    }).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        if (this._tokenTwo === response.nextPageToken) {
          this._tokenTwo = null;
        } else {
          this._tokenTwo = response.nextPageToken;
        }
        this.listTasksTwo = this.buildListTasks(response.items);
      } else {
        this.listTasksTwo = [];
      }
    });
  }
}
