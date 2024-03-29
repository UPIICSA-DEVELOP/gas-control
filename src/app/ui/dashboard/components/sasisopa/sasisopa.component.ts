/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DateAdapter, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ApiService} from '@app/core/services/api/api.service';
import {Subscription} from 'rxjs';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {UploadFileService} from '@app/shared/components/upload-file/upload-file.service';
import {PdfVisorService} from '@app/shared/components/pdf-visor/pdf-visor.service';
import {Constants} from '@app/utils/constants/constants.utils';
import {HashService} from '@app/utils/utilities/hash.service';
import {DialogService} from '@app/shared/components/dialog/dialog.service';
import {environment} from '@env/environment';
import {MDate} from '@app/utils/class/MDate';
import {ModalProceduresService} from '@app/shared/components/modal-procedures/modal-procedures.service';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {Person} from '@app/utils/interfaces/person';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {BrigadeElem} from '@app/utils/interfaces/brigade-element';
import {SasisopaDocument} from '@app/utils/interfaces/sasisopa';
import {BrigadeInterface} from '@app/utils/interfaces/brigade.interface';
import {Station} from '@app/utils/interfaces/station';
import {LocalStorageService, SnackBarService} from '@maplander/core';
import {UserMedia} from '@app/utils/interfaces/user-media';

@Component({
  selector: 'app-sasisopa',
  templateUrl: './sasisopa.component.html',
  styleUrls: ['./sasisopa.component.scss']
})
export class SasisopaComponent implements OnInit, OnDestroy {
  public elementInView: number;
  public listCollaborators: Person[];
  public listPerson: Person[];
  public load: boolean;
  public station: Station;
  public brigade: BrigadeElem[];
  public date: Date;
  public maxDate: Date;
  public minDate: Date;
  public listTasks: any[];
  public dateSelected: string;
  public generate: boolean;
  public isAvailable: boolean;
  public sasisopaDocs: any[];
  public docFile: any[];
  public errors: boolean[];
  public dateGeneration: string[];
  public isDevelop: boolean;
  public emptyTasks: boolean;
  public emptyTanks: boolean;
  public emptyBrigade: boolean;
  private _subscriptionLoader: Subscription;
  private _token: string;
  private _change: boolean;
  private readonly _forms: FormData[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data,
    private _matDialogRef: MatDialogRef<SasisopaComponent>,
    private _api: ApiService,
    private _apiLoader: LoaderService,
    private _proceduresService: ModalProceduresService,
    private _uploadFileService: UploadFileService,
    private _pdf: PdfVisorService,
    private _dialogService: DialogService,
    private _snackBarService: SnackBarService,
    private _adapter: DateAdapter<any>
  ) {
    this.emptyTasks = false;
    this.emptyTanks = false;
    this.emptyBrigade = false;
    this.isDevelop = environment.develop;
    this.docFile = [null, null, null, null, null, null, null, null, null, null, null, null];
    this.sasisopaDocs = [null, null, null, null, null, null, null, null, null, null, null, null];
    this.errors = [false, false, false, false, false, false, false, false];
    this.dateGeneration = [];
    this.dateSelected = undefined;
    this.date = undefined;
    this._change = false;
    this.maxDate = UtilitiesService.addSubtractDaysFromDate(new Date(), 1, false);
    this.minDate = undefined;
    this.station = undefined;
    this._token = undefined;
    this.elementInView = 0;
    this.listCollaborators = [];
    this.brigade = [{name: undefined, lastName: undefined, position: undefined}];
    this.listTasks = [];
    this.listPerson = [];
    this._forms = [];
    this.isAvailable = false;
    this.generate = false;
  }

  ngOnInit() {
    this._adapter.setLocale('es');
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {
      this.load = load;
    });
    this.getStation();
    this.getStationCollaborators();
    this.getSasisopa();
    this.initFormArray();
  }

  ngOnDestroy() {
    this._subscriptionLoader.unsubscribe();
  }

  public changeElementOnView(type: number): void {
    const lastView = this.elementInView;
    if (type === this.elementInView) {
      return;
    }
    if (this._change) {
      this._dialogService.confirmDialog(
        '¿Desea salir sin guardar cambios?',
        '',
        'ACEPTAR',
        'CANCELAR'
      ).afterClosed().subscribe(response => {
        if (response.code === 1) {
          this._change = false;
          this.initFormArray();
          this.getSasisopa();
          this.elementInView = type;
        }
      });
    } else {
      this.elementInView = type;
      this.getSasisopa();
    }
    if (type === 5 && this.date) {
      this._token = null;
      this.getStationTasks(MDate.getTimeStamp(this.date));
    } else if (type === 5) {
      if (new Date().getTime() < (this.minDate.getTime() + (1000 * 60 * 60 * 24 * 2))) {
        this._dialogService.alertDialog(
          'No existe un rango de fechas para poder seleccionar',
          'Por favor, intente después',
          'ACEPTAR').afterClosed().subscribe(() => {
          this.elementInView = lastView;
        });
      }
    }
    this.resetErrors();
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

  public openModalProcedures(): void {
    this._proceduresService.open({utils: this._data.utils.procedures,
      proceduresSelected: [], notVisibleChecks: true, stationId: this.station.id});
  }

  public openSasisopaTemplate(isAnnexedFive: boolean): void {
    let url;
    if (isAnnexedFive) {
      url = this._data.utils.sasisopaTemplates[1].fileCS.thumbnail;
    } else {
      url = this._data.utils.sasisopaTemplates[0].fileCS.thumbnail;
    }
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

  public addRemoveBrigadeElem(isAdd: boolean, index?: number): void {
    if (isAdd) {
      this._change = true;
      this.brigade.push({name: '', lastName: '', position: ''});
    } else {
      if (this.brigade.length > 1) {
        this._change = true;
        this.brigade.splice(index, 1);
      }
    }
  }

  public getStationTasks(datePrevious?: number): void {
    this._change = true;
    this._token = null;
    if (datePrevious) {
      this._change = false;
      this.date = UtilitiesService.generateArrayDate(datePrevious, false, false);
    }
    const date = new MDate().getFullMDate(this.date);
    this.dateSelected = date.dateText;
    this._api.listTask({
      stationTaskId: this.station.stationTaskId,
      startDate: date.timeStamp,
      status: '4',
      endDate: date.timeStamp,
      firstOpen: false,
      type: '0',
      cursor: this._token
    }).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        if (this._token === response.nextPageToken) {
          this._token = null;
        } else {
          this._token = response.nextPageToken;
        }
        this.listTasks = this.buildListTasks(response.items);
      } else {
        this.listTasks = [];
      }
    });
  }

  public loadFile(ev: UserMedia, annexed: number, type: number): void {
    this._change = true;
    const form = new FormData();
    form.append('path', 'Sasisopa');
    form.append('fileName', 'SASISOPA' + annexed + '-' + new Date().getTime() + '.pdf');
    form.append('file', ev.blob);
    this._forms[type - 1] = form;
    this.docFile[type - 1] = ev.blob;
  }

  private uploadFile(annexed: number, index: number): void {
    this._uploadFileService.upload(this._forms[index - 1]).subscribe(response => {
      if (response) {
        this._forms[index - 1] = undefined;
        const doc: SasisopaDocument = {
          annexed: annexed,
          file: response.item,
          stationId: this.station.id,
          type: index
        };
        this.saveSasisopaDocument(doc);
      }
    });
  }

  private saveSasisopaDocument(element: any): void {
    this._api.saveSasisopaDocument(element).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._change = false;
        this.sasisopaDocs[element.type - 1] = response.item;
        this.docFile[element.type - 1] = undefined;
        this.saveChanges(element.annexed);
      } else {
      }
    });
  }

  private saveBrigade(): void {
    const options: BrigadeInterface = {
      id: Number(this.station.id),
      brigadeElems: this.brigade
    };
    this._api.saveBrigade(options).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._change = false;
        this.saveChanges(3);
      } else {
      }
    });
  }

  private saveEvidenceDate(): void {
    this._api.saveEvidenceDate(this.station.id, MDate.getTimeStamp(this.date)).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._change = false;
      } else {
      }
    });
  }

  public validateBrigade(): void {
    if (this.brigade.length === 1 && !this.brigade[0].name && !this.brigade[0].lastName && !this.brigade[0].position) {
      this.saveChanges(3);
    } else {
      for (let i = 0; i < this.brigade.length; i++) {
        if (!this.brigade[i].name || !this.brigade[i].lastName || !this.brigade[i].position) {
          this._snackBarService.setMessage('Por favor, complete los campos', 'OK', 3000);
          return;
        }
      }
      this.saveBrigade();
    }
  }

  public saveChanges(index: number): void {
    this.resetErrors();
    switch (index) {
      case 2:
        if (this._forms[0]) {
          this.uploadFile(index, 1);
          return;
        }
        if (this._forms[1]) {
          this.uploadFile(index, 2);
          return;
        }
        this._snackBarService.setMessage('Información actualizada', 'OK', 3000);
        break;
      case 4:
        if (this._forms[4]) {
          this.uploadFile(index, 5);
          return;
        }
        this._snackBarService.setMessage('Información actualizada', 'OK', 3000);
        break;
      case 6:
        if (this._forms[5]) {
          this.uploadFile(index, 6);
          return;
        }
        this._snackBarService.setMessage('Información actualizada', 'OK', 3000);
        break;
      case 7:
        if (this._forms[6]) {
          this.uploadFile(index, 7);
          return;
        }
        if (this._forms[7]) {
          this.uploadFile(index, 8);
          return;
        }
        this._snackBarService.setMessage('Información actualizada', 'OK', 3000);
        break;
      case 8:
        if (this._forms[8]) {
          this.uploadFile(index, 9);
          return;
        }
        if (this._forms[9]) {
          this.uploadFile(index, 10);
          return;
        }
        if (this._forms[10]) {
          this.uploadFile(index, 11);
          return;
        }
        this._snackBarService.setMessage('Información actualizada', 'OK', 3000);
        break;
      case 9:
        if (this._forms[11]) {
          this.uploadFile(index, 12);
          return;
        }
        this._snackBarService.setMessage('Información actualizada', 'OK', 3000);
        break;
      case 3:
        if (this._forms[2]) {
          this.uploadFile(index, 3);
          return;
        }
        if (this._forms[3]) {
          this.uploadFile(index, 4);
          return;
        }
        this._snackBarService.setMessage('Información actualizada', 'OK', 3000);
        break;
      case 5:
        this.saveEvidenceDate();
        this._snackBarService.setMessage('Información actualizada', 'OK', 3000);
        break;
    }
  }

  private getSasisopa(): void {
    this._api.getSasisopa(this._data.stationId).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        if (response.item.brigade && response.item.brigade.brigadeElems) {
          this.brigade = response.item.brigade.brigadeElems;
        }
        if (response.item.evidencesDate && response.item.evidencesDate.date) {
          this.date = UtilitiesService.generateArrayDate(response.item.evidencesDate.date, false, false);
          if (this.station && this.station.stationTaskId) {
            this._token = null;
            this.getStationTasks(response.item.evidencesDate.date);
          }
        }
        if (response.item.sasisopaDocuments) {
          const sasisopaDocs = UtilitiesService.sortJSON(response.item.sasisopaDocuments, 'type', 'asc');
          for (let i = 0; i < this.sasisopaDocs.length; i++) {
            for (let j = 0; j < sasisopaDocs.length; j++) {
              if (sasisopaDocs[j].type === i + 1) {
                this.sasisopaDocs[i] = sasisopaDocs[j];
              }
            }
          }
        }
        if (response.item.fullSasisopa && response.item.fullSasisopa.date) {
          this.generate = true;
          this.dateGeneration = MDate.getDateArray(response.item.fullSasisopa.date);
          this.isAvailable = (response.item.fullSasisopa.date <= MDate.getTimeStamp(new Date()));
        }
      } else {
      }
    });
  }

  private getStationCollaborators(): void {
    this._api.listCollaborators(this._data.stationId, 'false').subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        const list = UtilitiesService.sortJSON(response.items, 'role', 'asc');
        this.listPerson = list;
        const rolesList = [undefined, undefined, undefined];
        for (let i = 0; i < list.length; i++) {
          if (list[i].role === 4 && !rolesList[0]) {
            rolesList[0] = list[i];
          }
          if (list[i].role === 5 && !rolesList[1]) {
            rolesList[1] = list[i];
          }
          if (list[i].role === 6 && !rolesList[2]) {
            rolesList[2] = list[i];
          }
        }
        this.listCollaborators = rolesList.filter(function (item) {
          return item !== undefined;
        });
      } else {
      }
    });
  }

  private getStation(): void {
    this._api.getStation(this._data.stationId).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this.station = response.item;
        this.getStationTaskEntity(response.item.stationTaskId);
        if (this.date) {
          this._token = null;
          this.getStationTasks(MDate.getTimeStamp(this.date));
        }
      } else {
        this.station = null;
      }
    });
  }

  private getStationTaskEntity(stationTaskId): void {
    this._api.getStationTask(stationTaskId).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        const startDate = response.item.creationDate;
        this.minDate = UtilitiesService.generateArrayDate(startDate, false, true);
      } else {
        this.minDate = UtilitiesService.addSubtractDaysFromDate(new Date(), 7, false);
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
              date: MDate.getDateArray(item.date),
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

  private initFormArray(): void {
    for (let i = 0; i < 12; i++) {
      this._forms.push(undefined);
    }
    for (let i = 0; i < 12; i++) {
      this.docFile[i] = null;
    }
  }

  public generateSasisopa(): void {
    if (this._change) {
      this._dialogService.confirmDialog(
        '¿Desea salir sin guardar cambios?',
        '',
        'ACEPTAR',
        'CANCELAR'
      ).afterClosed().subscribe(response => {
        if (response.code === 1) {
          this._change = false;
          this.getSasisopa();
          if (this.generate && !this.isAvailable) {
            this._dialogService.confirmDialog(
              'Esta operación reiniciará la fecha para la generación del documento',
              '¿Desea Continuar?',
              'ACEPTAR',
              'CANCELAR').afterClosed().subscribe(secondResponse => {
              if (secondResponse.code === 1) {
                this.validateSasisopa();
              }
            });
          } else {
            this.validateSasisopa();
          }
        }
      });
    } else {
      if (this.generate && !this.isAvailable) {
        this._dialogService.confirmDialog(
          'Esta operación reiniciará la fecha para la generación del documento',
          '¿Desea Continuar?',
          'ACEPTAR',
          'CANCELAR').afterClosed().subscribe(response => {
          if (response.code === 1) {
            this.validateSasisopa();
          }
        });
      } else {
        this.validateSasisopa();
      }
    }
  }

  private validateSasisopa(): void {
    let error = false;
    for (let i = 0; i < this.listCollaborators.length; i++) {
      if (!this.listCollaborators[i].signature || !this.listCollaborators[i].signature.thumbnail) {
        this.errors[0] = true;
        error = true;
      }
    }
    if (!this.sasisopaDocs[0] || !this.sasisopaDocs[1]) {
      this.errors[1] = true;
      error = true;
    }
    if (!this.errors[1]) {
      if (!this.station.fuelTanks || (this.station.fuelTanks && this.station.fuelTanks.length === 0)) {
        this.errors[1] = true;
        this.emptyTanks = true;
        error = true;
      }
    }
    if (!this.sasisopaDocs[2] || !this.sasisopaDocs[3]) {
      this.errors[2] = true;
      error = true;
    }
    if (!this.errors[2]) {
      if (!this.brigade || (this.brigade && this.brigade.length === 0)) {
        this.errors[2] = true;
        this.emptyBrigade = true;
        error = true;
      } else {
        for (let i = 0; i < this.brigade.length; i++) {
          if (!this.brigade[i].name || !this.brigade[i].lastName || !this.brigade[i].position) {
            this.errors[2] = true;
            this.emptyBrigade = true;
            error = true;
          }
        }
      }
    }
    if (!this.sasisopaDocs[4]) {
      this.errors[3] = true;
      error = true;
    }
    if (!this.date) {
      this.errors[4] = true;
      error = true;
    }
    if (this.listTasks.length === 0 && !this.errors[4]) {
      this.errors[4] = true;
      this.emptyTasks = true;
      error = true;
    }
    if (!this.sasisopaDocs[5]) {
      this.errors[5] = true;
      error = true;
    }
    if (!this.sasisopaDocs[6] || !this.sasisopaDocs[7]) {
      this.errors[6] = true;
      error = true;
    }
    if (!this.sasisopaDocs[11]) {
      this.errors[7] = true;
      error = true;
    }
    if (error) {
      return;
    } else {
      this._api.fullSasisopaRequest(this.station.id).subscribe(response => {
        if (response.code === HttpResponseCodes.OK) {
          this.generate = true;
          this.dateGeneration = MDate.getDateArray(response.item.date);
          this.isAvailable = (response.item.date <= MDate.getTimeStamp(new Date()));
        } else {
          this._snackBarService.setMessage('Ha ocurrido un error, por favor intente más tarde', 'OK', 3000);
        }
      });
    }
  }

  public seeSasisopa(): void {
    this._api.joinPDF(this.station.id, false).subscribe(response => {
      const user = LocalStorageService.getItem<Person>(Constants.UserInSession);
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

  private resetErrors(): void {
    this.emptyTasks = false;
    this.emptyTanks = false;
    this.emptyBrigade = false;
    for (let i = 0; i < 8; i++) {
      this.errors[i] = false;
    }
  }

  public seeDocuments(type: number): void {
    const user = LocalStorageService.getItem<Person>(Constants.UserInSession);
    if (!this.docFile[type - 1] && !this.sasisopaDocs[type - 1]) {
      this._snackBarService.setMessage('No se ha escaneado el documento', 'OK', 3000);
      return;
    }
    switch (user.role) {
      case 1:
      case 2:
      case 7:
        this._pdf.open({
          urlOrFile: this.docFile[type - 1] ? this.docFile[type - 1]
            : HashService.set('123456$#@$^@1ERF', this.sasisopaDocs[type - 1].file.thumbnail)
        });
        break;
      case 3:
      case 4:
      case 5:
      case 6:
        this._pdf.open({
          urlOrFile: this.docFile[type - 1] ? this.docFile[type - 1]
            : HashService.set('123456$#@$^@1ERF', this.sasisopaDocs[type - 1].file.thumbnail),
          hideDownload: true
        });
        break;
    }
  }

  public changeInput(): void {
    this._change = true;
  }
}
