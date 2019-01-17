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
import {Router} from '@angular/router';
import {animate, keyframes, query, stagger, state, style, transition, trigger} from '@angular/animations';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ right: '-100%' }),
        animate('.40s ease-in-out', style({ right: '0'}))
      ]),
      transition(':leave', [
        style({ right: '0' }),
        animate('.40s ease-in-out', style({ right: '-100%' }))
      ])
    ]),
    trigger('selected', [
      state('selected',
        style({
          backgroundColor: 'rgba(0, 0, 0, 0.288)',
        })
      ),
      transition('selected <=> *', [
        animate('10ms ease-in')
      ])
    ])
  ],
  host: {'[@fadeInAnimation]': ''}
})
export class StationListComponent implements OnInit, DoCheck {

  public stationList: any[];
  public notificationActive: boolean[] = [];
  public groupIcon: any;
  constructor(
    private _api: ApiService,
    private _dialogService: DialogService,
    private _router: Router
  ) {
  }

  ngOnInit() {
    this.getStationList();
    this.getUtilities();
  }

  ngDoCheck(): void {
    if (this.stationList) {
      for (let i = 0; i < this.stationList.length; i++){
        this.notificationActive.push(this.stationList[i].activeNotification);
      }
    }
  }

  private getUtilities():void{
    this._api.getUtils().subscribe(response=>{
      this.groupIcon = response.item;
    })
  }

  public changeNotificationsStatus(id: string, status: boolean, index:number): void{
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

  public onCloseList():void{
    this._router.navigate(['/home']);
  }

  private getStationList():void{
    let user = SessionStorageService.getItem(Constants.UserInSession);
    switch (user.role) {
      case 1:
      case 2:
      case 3:
        this._api.getConsultancyBasicData(CookieService.getCookie(Constants.IdSession),user.refId).subscribe(response=>{
          switch (response.code) {
            case 200:
              this.stationList = response.item.stationLites;
              break;
            default:
              break;
          }
        });
        break;
      case 4:
        this._api.getLegalRepresentativeBasicData(user.refId, CookieService.getCookie(Constants.IdSession)).subscribe(response=>{
          switch (response.code) {
            case 200:
              this.stationList = response.item.stationLites;
              break;
            default:
              break;
          }
        });
        break;
      default:
        break;
    }
  }
}
