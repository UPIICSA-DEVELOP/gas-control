/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {Router} from '@angular/router';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {Constants} from '@app/core/constants.core';
import {Subscription} from 'rxjs/Rx';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';

@Component({
  selector: 'app-admin-notifications',
  templateUrl: './admin-notifications.component.html',
  styleUrls: ['./admin-notifications.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ right: '-100%' }),
        animate('.40s ease-out', style({ right: '0'  }))
      ]),
      transition(':leave', [
        style({ right: '0'}),
        animate('.40s ease-in', style({ right: '-100%' }))
      ])
    ])
  ],
  host: {'[@fadeInAnimation]': ''}
})
export class AdminNotificationsComponent implements OnInit, OnDestroy {

  public notifications: any[];
  public load: boolean;
  private _subscriptionLoader: Subscription;
  constructor(
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _router: Router,
    private _dialogService: DialogService
  ) {

  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load=>{this.load = load});
    this.getListNotifications();
  }

  ngOnDestroy(): void {
    this._subscriptionLoader.unsubscribe();
  }

  private getListNotifications():void{
    this._api.listNotificationsAdmin(CookieService.getCookie(Constants.IdSession)).subscribe(response=>{
      switch (response.code){
        case 200:
          if(response.items){
            this.notifications = response.items;
            for(let i = 0; i<this.notifications.length;i++){
              this.notifications[i].date = UtilitiesService.convertDate(this.notifications[i].date)
            }
          }else{
            this.notifications = [];
          }
          break;
        default:
          this.notifications = [];
          break;
      }
    });
  }

  public navigateToDashboard(stationId: string, consultancyId: string): void{
    let stationsView = SessionStorageService.getItem(Constants.StationAdmin) || [];
    if(stationsView){
      stationsView.forEach(item => {
        item.lastView = false;
      });
    }
    stationsView.push({stationId: stationId, consultancyId: consultancyId, lastView: true});
    SessionStorageService.setItem(Constants.StationAdmin, stationsView);
    window.open('/#/home?station='+stationId,'_blank');
  }

  public deleteNotification(id: string, index: number):void{
    this._dialogService.confirmDialog(
      '¿Desea eliminar esta notificación?',
      '',
      'ACEPTAR',
      'CANCELAR'
    ).afterClosed().subscribe(response=>{
      switch (response.code){
        case 1:
          this._api.deleteNotification(id).subscribe(response=>{
            switch (response.code){
              case 200:
                this.notifications.splice(index, 1);
                break;
            }
          });
          break;
      }
    });
  }

  public onCloseNotifications(): void {
    this._router.navigate(['/admin']).then();
  }

}
