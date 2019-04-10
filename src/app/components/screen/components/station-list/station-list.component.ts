/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, DoCheck, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {Constants} from '@app/core/constants.core';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {AddStationService} from '@app/components/screen/components/add-gas-station/add-station.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';

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
  public stations: any[];
  public notificationActive: boolean[];
  public groupIcon: any;
  public user: any;
  public emptySearch: boolean;
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
    this._router.navigate(['/home']).then();
  }

  private getStationList():void{
    let user = LocalStorageService.getItem(Constants.UserInSession);
    this.user=user;
    switch (user.role) {
      case 1:
      case 2:
      case 3:
      case 7:
        this._api.getConsultancyBasicData(CookieService.getCookie(Constants.IdSession),user.refId).subscribe(response=>{
          switch (response.code) {
            case 200:
              this.stationList = UtilitiesService.sortJSON(response.item.stationLites,'progress','asc');
              this.stations = this.stationList;
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
              this.stationList = UtilitiesService.sortJSON(response.item.stationLites,'progress','asc');
              this.stations = this.stationList;
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

  public addStation():void{
    this._router.navigate(['/home']).then(() => {
      this._addStation.open();
    });
  }

  public search(event: any): void{
    const newArray = [];
    const text = (event.srcElement.value).toLowerCase();
    if(text === ''){
      this.stationList = this.stations;
    }else{
      for(let x=0; x < this.stations.length; x++){
        if(this.stations[x].email.toLowerCase().includes(text) || this.stations[x].phoneNumber.includes(text) || UtilitiesService.removeDiacritics(this.stations[x].name).toLowerCase().includes(text)){
          newArray.push(this.stations[x]);
        }else {
          for (let i= 0; i<this.groupIcon.groupIcons.length; i++){
            if(UtilitiesService.removeDiacritics(this.groupIcon.groupIcons[i].name).toLowerCase().includes(text) && this.stations[x].type === i+1){
              newArray.push(this.stations[x]);
            }
          }
        }
        if(this.stations[x].crePermission){
          if(UtilitiesService.removeDiacritics(this.stations[x].crePermission).toLowerCase().includes(text)){
            newArray.push(this.stations[x]);
          }
        }
      }
      if(newArray.length > 0){
        this.stationList = newArray;
      }else{
        this.stationList = newArray;
        this.emptySearch = (newArray.length===0);
      }
    }
  }

  public changeStation(id: string):void{
    this._router.navigate(['/home']).then(()=>{
      this._sharedService.setNotification({type: SharedTypeNotification.ChangeStation, value: id});
    });

  }
}
