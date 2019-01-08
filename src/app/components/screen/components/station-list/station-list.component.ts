/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {AfterViewInit, Component, DoCheck, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {Constants} from '@app/core/constants.core';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})
export class StationListComponent implements OnInit, DoCheck {
  public user: any;
  public consultancyBasicData: any;
  public groupIcon: any;

  constructor(
    private _api: ApiService,
    private _dialogService: DialogService
  ) {
  }

  ngOnInit() {
    this.getStations();
  }

  ngDoCheck(): void {
  }

  private getUtilities():void{
    this._api.getUtils().subscribe(response=>{
      this.groupIcon = response.item;
    })
  }

  private getStations(): void {
    this.getUtilities();
    const user = SessionStorageService.getItem(Constants.UserInSession);
    switch (user.role){
      case 1:
      case 2:
      case 3:
        this._api.getPerson(CookieService.getCookie(Constants.IdSession)).subscribe(response => {
          switch (response.code) {
            case 200:
              this.user = response.item;
              this._api.getConsultancyBasicData(this.user.id, this.user.refId).subscribe(response => {
                switch (response.code) {
                  case 200:
                    this.consultancyBasicData = response.item;
                    break;
                }
              });
              break;
          }
        });
        break;
      default:
        break;
    }
  }

  private changeNotificationsStatus(id: string, status: boolean): void{
    if (status) {
      this._dialogService.confirmDialog(
        'Información',
        'Esta acción evitará recibir notificaciones ¿Desea continuar?',
        'ACEPTAR',
        'CANCELAR'
      ).afterClosed().subscribe(response =>{
        switch (response.code) {
          case 1:
            this._api.turnOffNotificationStation(this.user.id, id).subscribe(response=>{
              switch (response.code) {
                case 200:
                  this.getStations();
                  break;
              }
            });
            break
        }
      });
    } else{
      this._api.turnOnNotificationStation(this.user.id, id).subscribe( response =>{
        switch (response.code) {
          case 200:
            this.getStations();
            break;
        }
      })
    }
  }
}
