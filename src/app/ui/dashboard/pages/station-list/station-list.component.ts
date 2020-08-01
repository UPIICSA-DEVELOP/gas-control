/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, HostBinding, OnInit} from '@angular/core';
import {ApiService} from 'app/core/services/api/api.service';
import {DialogService} from 'app/shared/components/dialog/dialog.service';
import {Constants} from 'app/utils/constants/constants.utils';
import {Router} from '@angular/router';
import {UtilitiesService} from 'app/utils/utilities/utilities';
import {SharedService, SharedTypeNotification} from 'app/core/services/shared/shared.service';
import {AddStationService} from 'app/shared/components/add-gas-station/add-station.service';
import {Person} from '@app/utils/interfaces/person';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {EntityResponse} from '@app/utils/class/entity-response';
import {Station} from '@app/utils/interfaces/station';
import {ANIMATION} from '@app/ui/dashboard/pages/station-list/animation';
import {StationLite} from '@app/utils/interfaces/station-lite';
import {AppUtil} from '@app/utils/interfaces/app-util';
import {CookieService, LocalStorageService} from '@maplander/core';
import {CustomStationLite} from '@app/utils/interfaces/custom-station-lite';
import {GroupIcon} from '@app/utils/interfaces/group-icon';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
  animations: [ANIMATION]
})
export class StationListComponent implements OnInit {
  @HostBinding('@fadeInAnimation')

  public stationList: CustomStationLite[];
  public notificationActive: boolean[];
  public utils: AppUtil;
  public user: Person;
  public emptySearch: boolean;
  private _stations: CustomStationLite[];
  private _notifyCopy: boolean[];

  constructor(
    private _api: ApiService,
    private _dialogService: DialogService,
    private _router: Router,
    private _addStation: AddStationService,
    private _sharedService: SharedService
  ) {
    this.notificationActive = [];
    this.emptySearch = false;
    this.stationList = [];
    this._stations = [];
  }

  ngOnInit() {
    this.user = LocalStorageService.getItem<Person>(Constants.UserInSession);
    this.getUtilities();
  }

  private getUtilities(): void {
    this._api.getUtils().subscribe((response: EntityResponse<AppUtil>) => {
      this.utils = response.item;
      this.getStationList();
    });
  }

  public changeStationEnabled(ev: any, stationId: string, index: number): void {
    if (ev.checked) {
      this._api.enableStation(true, stationId).subscribe((response: EntityResponse<Station>) => {
        if (response.code === HttpResponseCodes.OK) {
          this.stationList[index].enabled = true;
          this._stations[index].enabled = true;
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
              this._stations[index].enabled = false;
            } else {
            }
          });
        } else {
          this.getStationList();
        }
      });
    }
  }

  public changeNotificationsStatus(id: string, status: boolean, index: number): void {
    if (status) {
      this._dialogService.confirmDialog(
        'Información',
        'Esta acción evitará recibir notificaciones ¿Desea continuar?',
        'ACEPTAR',
        'CANCELAR'
      ).afterClosed().subscribe(response => {
        if (response.code === 1) {
          this._api.turnOffNotificationStation(CookieService.getCookie(Constants.IdSession), id).subscribe(turnOffResponse => {
            if (turnOffResponse.code === HttpResponseCodes.OK) {
              this.notificationActive[index] = false;
              this._notifyCopy[index] = false;
            }
          });
        }
      });
    } else {
      this._api.turnOnNotificationStation(CookieService.getCookie(Constants.IdSession), id).subscribe(response => {
        if (response.code === HttpResponseCodes.OK) {
          this.notificationActive[index] = true;
          this._notifyCopy[index] = true;
        }
      });
    }
  }

  public onCloseList(): void {
    this._router.navigate(['/home']).then();
  }

  private getStationList(): void {
    switch (this.user.role) {
      case 1:
      case 2:
      case 3:
      case 7:
        this._api.getConsultancyBasicData(CookieService.getCookie(Constants.IdSession), this.user.refId).subscribe(response => {
          if (response.code === HttpResponseCodes.OK) {
            this.createList(response.item.stationLites);
            this.getNotificationsByStation();
          }
        });
        break;
      case 4:
        this._api.getLegalRepresentativeBasicData(this.user.refId, CookieService.getCookie(Constants.IdSession)).subscribe(response => {
          if (response.code === HttpResponseCodes.OK) {
            this.createList(response.item.stationLites);
            this.getNotificationsByStation();
          }
        });
        break;
      default:
        break;
    }
  }

  private getNotificationsByStation(): void {
    for (let i = 0; i < this.stationList.length; i++) {
      this.notificationActive.push(this.stationList[i].activeNotification);
    }
  }

  public addStation(): void {
    this._router.navigate(['/home']).then(() => {
      this._addStation.open();
    });
  }

  public search(event: any): void {
    const newArray = [];
    const arrayNotify = [];
    const text = (event.target.value).toLowerCase();
    if (text === '') {
      this.stationList = this._stations;
      this._notifyCopy = this.notificationActive;
    } else {
      this._stations.forEach(station => {
        const stationName = UtilitiesService.removeDiacritics(station.name);
        if (
          station.email.toLowerCase().includes(text) ||
          station.phoneNumber.toLowerCase().includes(text) ||
          stationName.toLowerCase().includes(text) ||
          station.groupName.toLowerCase().includes(text) ||
          (station.crePermission && station.crePermission.toLowerCase().includes(text))
        ) {
          newArray.push(station);
          arrayNotify.push(station.activeNotification);
        }
      });
      if (newArray.length > 0) {
        this.stationList = newArray;
        this.notificationActive = arrayNotify;
      } else {
        this.stationList = newArray;
        this.notificationActive = arrayNotify;
        this.emptySearch = (newArray.length === 0);
      }
    }
  }

  public changeStation(id: string, newNotification: boolean, enabled: boolean): void {
    if (enabled) {
      this._router.navigate(['/home']).then(() => {
        this._sharedService.setNotification({
          type: SharedTypeNotification.ChangeStation,
          value: {id: id, newNotification: newNotification}
        });
      });
    } else {
      if (this.user.role === 4) {
        this._dialogService.alertDialog(
          'Verificar Estado de suscripción',
          'Su cuenta esta suspendida por un problema con el último pago',
          ''
        );
      }
    }
  }

  private createList(list: StationLite[]): void {
    const response: CustomStationLite[] = [];
    if (list && list.length > 0) {
      list.forEach(station => {
        const group = UtilitiesService.getObjectsByKeyValue(this.utils.groupIcons, 'id', '' + station.type)[0] as GroupIcon;
        response.push({
          activeNotification: station.activeNotification,
          businessName: station.businessName,
          crePermission: station.crePermission,
          doneTasks: station.doneTasks,
          email: station.email,
          enabled: station.enabled,
          endPaymentDate: station.endPaymentDate,
          id: station.id,
          name: station.name,
          newNotification: station.newNotification,
          phoneNumber: station.phoneNumber,
          progress: station.progress,
          stationTaskId: station.stationTaskId,
          totalTasks: station.totalTasks,
          type: station.type,
          logo: group.fileCS.thumbnail,
          groupName: group.name
        });
      });
      this.stationList = UtilitiesService.sortJSON(response, 'progress', 'asc');
      this._stations = this.stationList;
    }
  }
}
