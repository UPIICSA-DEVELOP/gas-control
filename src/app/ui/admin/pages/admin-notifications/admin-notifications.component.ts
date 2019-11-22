/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from 'app/core/services/api/api.service';
import {DialogService} from 'app/shared/components/dialog/dialog.service';
import {Router} from '@angular/router';
import {Constants} from 'app/utils/constants/constants.utils';
import {Subscription} from 'rxjs';
import {UtilitiesService} from 'app/utils/utilities/utilities';
import {SessionStorageService} from 'app/core/services/session-storage/session-storage.service';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {ANIMATION} from '@app/ui/admin/pages/admin-notifications/animation';
import {EntityCollectionResponse} from '@app/utils/class/entity-collection-response';
import {Notification} from '@app/utils/interfaces/notification';
import {CookieService} from 'ng-maplander';

@Component({
  selector: 'app-admin-notifications',
  templateUrl: './admin-notifications.component.html',
  styleUrls: ['./admin-notifications.component.scss'],
  animations: [ANIMATION]
})
export class AdminNotificationsComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation')

  public notifications: Notification[];
  public load: boolean;
  private _subscriptionLoader: Subscription;

  constructor(
    private _api: ApiService,
    private _apiLoader: LoaderService,
    private _router: Router,
    private _dialogService: DialogService
  ) {
    this.notifications = [];
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {
      this.load = load;
    });
    this.getListNotifications();
  }

  ngOnDestroy(): void {
    this._subscriptionLoader.unsubscribe();
  }

  private getListNotifications(): void {
    this._api.listNotificationsAdmin(CookieService.getCookie(Constants.IdSession))
      .subscribe((response: EntityCollectionResponse<Notification>) => {
      if (response.code === HttpResponseCodes.OK) {
        if (response.items) {
          this.notifications = response.items;
          this.notifications.forEach(notification => {
            const date = UtilitiesService.convertDate(notification.date);
            notification.date = Number(date[2] + '' + date[1] + '' + date[0]);
          });
        } else {
          this.notifications = [];
        }
      } else {
        this.notifications = [];
      }
    });
  }

  public navigateToDashboard(stationId: string, consultancyId: string): void {
    const stationsView = SessionStorageService.getItem(Constants.StationAdmin) || [];
    if (stationsView) {
      stationsView.forEach(item => {
        item.lastView = false;
      });
    }
    stationsView.push({stationId: stationId, consultancyId: consultancyId, lastView: true});
    SessionStorageService.setItem(Constants.StationAdmin, stationsView);
    window.open('/#/home?station=' + stationId, '_blank');
  }

  public deleteNotification(id: string, index: number): void {
    this._dialogService.confirmDialog(
      '¿Desea eliminar esta notificación?',
      '',
      'ACEPTAR',
      'CANCELAR'
    ).afterClosed().subscribe(response => {
      if (response.code === 1) {
        this._api.deleteNotification(id).subscribe(deleteNotification => {
          if (deleteNotification.code === HttpResponseCodes.OK) {
            this.notifications.splice(index, 1);
          }
        });
      }
    });
  }

  public onCloseNotifications(): void {
    this._router.navigate(['/admin']).then();
  }

}
