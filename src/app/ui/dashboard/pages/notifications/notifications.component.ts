/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from 'app/core/services/api/api.service';
import {DialogService} from 'app/shared/components/dialog/dialog.service';
import {CookieService} from 'app/core/services/cookie/cookie.service';
import {Constants} from 'app/utils/constants/constants.utils';
import {UtilitiesService} from 'app/utils/utilities/utilities';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {ANIMATION} from '@app/ui/dashboard/pages/notifications/animation';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [ANIMATION]
})
export class NotificationsComponent implements OnInit {
  @HostBinding('@fadeInAnimation')

  public notifications: any[];
  private _station: string;
  private _idLegal: string;
  public isAdmin: boolean;

  constructor(
    private _route: Router,
    private _activateRouter: ActivatedRoute,
    private _api: ApiService,
    private _dialogService: DialogService
  ) {
    this.isAdmin = false;
    this.notifications = [];
  }

  ngOnInit() {
    if (this._activateRouter.snapshot.queryParams.admin) {
      this._idLegal = this._activateRouter.snapshot.queryParams.admin;
      this.isAdmin = true;
    }
    if (this._activateRouter.snapshot.queryParams.id) {
      this._station = this._activateRouter.snapshot.queryParams.id;
      this.getNotifications();
    }
  }

  private getNotifications(): void {
    let personId;
    if (!this._idLegal) {
      personId = CookieService.getCookie(Constants.IdSession);
    } else {
      personId = this._idLegal;
    }
    this._api.listNotifications(personId, this._station).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        if (response.items) {
          this.notifications = response.items;
          for (let i = 0; i < this.notifications.length; i++) {
            this.notifications[i].date = UtilitiesService.convertDate(this.notifications[i].date);
          }
        } else {
          this.notifications = [];
        }
      } else {
        this.notifications = [];
      }
    });
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
    this._route.navigate(['/home']).then();
  }

}
