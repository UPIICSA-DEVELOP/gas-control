/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {Constants} from '@app/core/constants.core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})
export class StationListComponent implements OnInit {

  @Input() public stationList: any[];
  public notificationActive: boolean[] = [];
  public groupIcon: any;

  constructor(
    private _api: ApiService,
    private _dialogService: DialogService,
    private _router: Router
  ) {
  }

  ngOnInit() {
    if (this.stationList) {
      for (let i = 0; i < this.stationList.length; i++){
        this.notificationActive.push(this.stationList[i].activeNotification);
      }
    }
    this.getUtilities();
  }

  private getUtilities():void{
    this._api.getUtils().subscribe(response=>{
      this.groupIcon = response.item;
    })
  }

  private changeNotificationsStatus(id: string, status: boolean, index:number): void{
    debugger;
    if (status) {
      this._dialogService.confirmDialog(
        'Información',
        'Esta acción evitará recibir notificaciones ¿Desea continuar?',
        'ACEPTAR',
        'CANCELAR'
      ).afterClosed().subscribe(response =>{
        switch (response.code) {
          case 1:
            this._api.turnOffNotificationStation(CookieService.getCookie(Constants.IdSession), id).subscribe(response=>{
              switch (response.code) {
                case 200:
                  this.notificationActive[index]=false;
                  break;
              }
            });
            break
        }
      });
    } else{
      this._api.turnOnNotificationStation(CookieService.getCookie(Constants.IdSession), id).subscribe( response =>{
        switch (response.code) {
          case 200:
            this.notificationActive[index]=true;
            break;
        }
      })
    }
  }
}
