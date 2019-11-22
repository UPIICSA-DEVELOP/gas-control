/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ApiService} from '@app/core/services/api/api.service';
import {Constants} from '@app/utils/constants/constants.utils';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {DialogService} from '@app/shared/components/dialog/dialog.service';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {AuthService} from '@app/core/services/auth/auth.service';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {AddStationService} from '@app/shared/components/add-gas-station/add-station.service';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {EntityResponse} from '@app/utils/class/entity-response';
import {Station} from '@app/utils/interfaces/station';
import {ConsultancyBasicData} from '@app/utils/interfaces/consultancy-basic-data';
import {StationLite} from '@app/utils/interfaces/station-lite';
import {AppUtil} from '@app/utils/interfaces/app-util';
import {GroupIcon} from '@app/utils/interfaces/group-icon';
import {CookieService, LocalStorageService} from 'ng-maplander';

@Component({
  selector: 'app-list-collaborators',
  templateUrl: './list-stations.component.html',
  styleUrls: ['./list-stations.component.scss']
})
export class ListStationsComponent implements OnInit {

  public stationList: StationLite[];
  public stationListCopy: StationLite[];
  public title: string;
  public notResults: boolean;
  public utils: GroupIcon[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialog: MatDialogRef<ListStationsComponent>,
    private _snackBar: SnackBarService,
    private _dialogService: DialogService,
    private _api: ApiService,
    private _addStation: AddStationService,
    private _auth: AuthService
  ) {
    this.title = this._data.name;
    this.stationList = [];
    this.stationListCopy = [];
  }

  ngOnInit() {
    this.getList(this._data.id);
    this.getUtilities();
  }

  public close(): void {
    this._dialog.close();
  }

  public changeStationEnabled(ev: any, stationId: string, index: number): void {
    if (ev.checked) {
      this._api.enableStation(true, stationId).subscribe(response => {
        if (response.code === HttpResponseCodes.OK) {
          this.stationList[index].enabled = true;
          this.stationListCopy[index].enabled = true;
        } else {
        }
      });
    } else {
      this._dialogService.confirmDialog(
        'Atención',
        'Esta acción inhabilitará el acceso de los miembros de esta estación, a la funcionalidad de inSpéctor. \n ¿Desea continuar?',
        'ACEPTAR',
        'CANCELAR'
      ).afterClosed().subscribe(response => {
        if (response.code === 1) {
          this._api.enableStation(false, stationId).subscribe((enableStation: EntityResponse<Station>) => {
            if (enableStation.code === HttpResponseCodes.OK) {
              this.stationList[index].enabled = false;
              this.stationListCopy[index].enabled = false;
            } else {
            }
          });
        } else {
          this.getList(this._data.id);
        }
      });
    }
  }

  public search(ev: any): void {
    const newArray = [];
    const text = (ev.target.value).toLowerCase();
    if (text === '') {
      this.stationList = this.stationListCopy;
    } else {
      for (let x = 0; x < this.stationListCopy.length; x++) {
        if (this.stationListCopy[x].email.toLowerCase().includes(text) ||
          this.stationListCopy[x].phoneNumber.includes(text) ||
          UtilitiesService.removeDiacritics(this.stationListCopy[x].name).toLowerCase().includes(text)) {
          newArray.push(this.stationListCopy[x]);
        } else {
          for (let i = 0; i < this.utils.length; i++) {
            if (UtilitiesService.removeDiacritics(this.utils[i].name).toLowerCase().includes(text) &&
              this.stationListCopy[x].type === i + 1) {
              newArray.push(this.stationListCopy[x]);
            }
          }
        }
        if (this.stationListCopy[x].crePermission) {
          if (UtilitiesService.removeDiacritics(this.stationListCopy[x].crePermission).toLowerCase().includes(text)) {
            newArray.push(this.stationListCopy[x]);
          }
        }
      }
      this.stationList = newArray;
      this.notResults = (newArray.length === 0);
    }
  }

  public addStation(): void {
    this.close();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    user.refId = user.refId ? user.refId : this._data.id;
    this._auth.updateUserInSession(user);
    this._addStation.open().afterClosed().subscribe(() => {
      user.refId = null;
      this._auth.updateUserInSession(user);
    });
  }

  public goToDashboard(station: any): void {
    const stationsView = SessionStorageService.getItem(Constants.StationAdmin) || [];
    if (stationsView) {
      stationsView.forEach(item => {
        item.lastView = false;
      });
    }
    stationsView.push({stationId: station.id, consultancyId: this._data.id, lastView: true});
    SessionStorageService.setItem(Constants.StationAdmin, stationsView);
    LocalStorageService.setItem(Constants.ConsultancyInSession, this._data);
    window.open('/#/home?station=' + station.id, '_blank');
  }

  private getUtilities(): void {
    this._api.getUtils().subscribe((response: EntityResponse<AppUtil>) => {
      if (response.code === HttpResponseCodes.OK) {
        this.utils = response.item.groupIcons;
      } else {
      }
    });
  }

  private getList(id: string): void {
    this._api.getConsultancyBasicData(CookieService.getCookie(Constants.IdSession), id)
      .subscribe((response: EntityResponse<ConsultancyBasicData>) => {
      if (response.code === HttpResponseCodes.OK) {
        if (response.item.stationLites) {
          this.stationList = response.item.stationLites;
          this.stationListCopy = this.stationList;
        } else {
          this.stationList = [];
          this.stationListCopy = this.stationList;
        }
      } else {
        this.onErrorOccurred();
      }
    });
  }

  private onErrorOccurred(): void {
    this._snackBar.openSnackBar('Ha ocurrido un error, por favor, intente de nuevo', 'OK', 3000);
  }

}
