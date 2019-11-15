/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from 'app/core/services/api/api.service';
import {DialogService} from 'app/shared/components/dialog/dialog.service';
import {CookieService} from 'app/core/services/cookie/cookie.service';
import {Constants} from 'app/utils/constants/constants.utils';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {LocalStorageService} from 'app/core/services/local-storage/local-storage.service';
import {UtilitiesService} from 'app/utils/utilities/utilities';
import {SharedService, SharedTypeNotification} from 'app/core/services/shared/shared.service';
import {AddStationService} from 'app/shared/components/add-gas-station/add-station.service';
import {Person} from '@app/utils/interfaces/person';

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
  host: {'[@fadeInAnimation]': ''},
  encapsulation: ViewEncapsulation.None
})
export class StationListComponent implements OnInit {

  public stationList: any[];
  public notificationActive: boolean[];
  public groupIcon: any;
  public user: Person;
  public emptySearch: boolean;
  private _stations: any[];
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
  }

  ngOnInit() {
    this.getStationList();
    this.getUtilities();
  }

  private getUtilities():void{
    this._api.getUtils().subscribe(response=>{
      this.groupIcon = response.item;
    })
  }

  public changeStationEnabled(ev: any, stationId: string, index: number): void{
    if(ev.checked){
      this._api.enableStation(true, stationId).subscribe(response=>{
        switch(response.code){
          case 200:
            this.stationList[index].enabled = true;
            this._stations[index].enabled = true;
            break;
          default:
            break;
        }
      });
    }else{
      this._dialogService.confirmDialog(
        'Atención',
        'Esta acción inhabilitará el acceso de los miembros de esta estación, a la funcionalidad de inSpéctor. \n ¿Desea continuar?',
        'ACEPTAR',
        'CANCELAR'
      ).afterClosed().subscribe(response=>{
        switch(response.code){
          case 1:
            this._api.enableStation(false, stationId).subscribe(response=>{
              switch(response.code){
                case 200:
                  this.stationList[index].enabled = false;
                  this._stations[index].enabled = false;
                  break;
                default:
                  break;
              }
            });
            break;
          default:
            this.getStationList();
            break;
        }
      })
    }
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
                  this.notificationActive[index] = false;
                  this._notifyCopy[index] = false;
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
            this.notificationActive[index] = true;
            this._notifyCopy[index] = true;
            break;
        }
      })
    }
  }

  public onCloseList():void{
    this._router.navigate(['/home']).then();
  }

  private getStationList():void{
    this.user=LocalStorageService.getItem(Constants.UserInSession);
    switch (this.user.role) {
      case 1:
      case 2:
      case 3:
      case 7:
        this._api.getConsultancyBasicData(CookieService.getCookie(Constants.IdSession),this.user.refId).subscribe(response=>{
          switch (response.code) {
            case 200:
              this.stationList = UtilitiesService.sortJSON(response.item.stationLites,'progress','asc');
              this._stations = this.stationList;
              this.getNotificationsByStation();
              break;
            default:
              break;
          }
        });
        break;
      case 4:
        this._api.getLegalRepresentativeBasicData(this.user.refId, CookieService.getCookie(Constants.IdSession)).subscribe(response=>{
          switch (response.code) {
            case 200:
              this.stationList = UtilitiesService.sortJSON(response.item.stationLites,'progress','asc');
              this._stations = this.stationList;
              this.getNotificationsByStation();
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

  private getNotificationsByStation():void{
    for (let i = 0; i < this.stationList.length; i++){
      this.notificationActive.push(this.stationList[i].activeNotification);
    }
  }

  public addStation():void{
    this._router.navigate(['/home']).then(() => {
      this._addStation.open();
    });
  }

  public search(event: any): void{
    const newArray = [];
    const arrayNotify = [];
    const text = (event.srcElement.value).toLowerCase();
    if(text === ''){
      this.stationList = this._stations;
      this._notifyCopy = this.notificationActive;
    }else{
      for(let x=0; x < this._stations.length; x++){
        if(this._stations[x].email.toLowerCase().includes(text) || this._stations[x].phoneNumber.includes(text) || UtilitiesService.removeDiacritics(this._stations[x].name).toLowerCase().includes(text)){
          newArray.push(this._stations[x]);
          arrayNotify.push(this._stations[x].activeNotification);
        }else {
          for (let i= 0; i<this.groupIcon.groupIcons.length; i++){
            if(UtilitiesService.removeDiacritics(this.groupIcon.groupIcons[i].name).toLowerCase().includes(text) && this._stations[x].type === i+1){
              newArray.push(this._stations[x]);
              arrayNotify.push(this._stations[x].activeNotification);
            }
          }
        }
        if(this._stations[x].crePermission){
          if(UtilitiesService.removeDiacritics(this._stations[x].crePermission).toLowerCase().includes(text)){
            newArray.push(this._stations[x]);
            arrayNotify.push(this._stations[x].activeNotification);
          }
        }
      }
      if(newArray.length > 0){
        this.stationList = newArray;
        this.notificationActive = arrayNotify;
      }else{
        this.stationList = newArray;
        this.notificationActive = arrayNotify;
        this.emptySearch = (newArray.length===0);
      }
    }
  }

  public changeStation(id: string, newNotification: boolean, enabled: boolean):void{
    if(enabled){
      this._router.navigate(['/home']).then(()=>{
        this._sharedService.setNotification({type: SharedTypeNotification.ChangeStation, value: {id: id, newNotification: newNotification}});
      });
    }else{
      switch (this.user.role){
        case 1:
        case 2:
        case 3:
          this._dialogService.alertDialog(
            'Verificar Estado de suscripción',
            'Esta estación esta suspendida por un problema con el último pago',
            ''
          );
          break;
        case 4:
          this._dialogService.alertDialog(
            'Verificar Estado de suscripción',
            'Su cuenta esta suspendida por un problema con el último pago',
            ''
          );
          break;
      }
    }
  }
}
