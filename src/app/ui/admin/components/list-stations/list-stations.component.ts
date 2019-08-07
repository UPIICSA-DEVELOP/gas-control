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
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {AuthService} from '@app/core/services/auth/auth.service';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {AddStationService} from '@app/shared/components/add-gas-station/add-station.service';

@Component({
  selector: 'app-list-collaborators',
  templateUrl: './list-stations.component.html',
  styleUrls: ['./list-stations.component.scss']
})
export class ListStationsComponent implements OnInit {

  public stationList: any[];
  public stationListCopy: any[];
  public title: string;
  public notResults: boolean;
  public utils: any;
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

  public close(): void{
    this._dialog.close();
  }

  public changeStationEnabled(ev: any, stationId: string, index: number): void{
    if(ev.checked){
      this._api.enableStation(true, stationId).subscribe(response=>{
        switch(response.code){
          case 200:
            this.stationList[index].enabled = true;
            this.stationListCopy[index].enabled = true;
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
                  this.stationListCopy[index].enabled = false;
                  break;
                default:
                  break;
              }
            });
            break;
          default:
            this.getList(this._data.id);
            break;
        }
      })
    }
  }

  public search(ev: any): void{
    const newArray = [];
    const text = (ev.srcElement.value).toLowerCase();
    if(text === ''){
      this.stationList = this.stationListCopy;
    }else{
      for(let x=0; x < this.stationListCopy.length; x++){
        if(this.stationListCopy[x].email.toLowerCase().includes(text) || this.stationListCopy[x].phoneNumber.includes(text) || UtilitiesService.removeDiacritics(this.stationListCopy[x].name).toLowerCase().includes(text)){
          newArray.push(this.stationListCopy[x]);
        }else {
          for (let i= 0; i<this.utils.length; i++){
            if(UtilitiesService.removeDiacritics(this.utils[i].name).toLowerCase().includes(text) && this.stationListCopy[x].type === i+1){
              newArray.push(this.stationListCopy[x]);
            }
          }
        }
        if(this.stationListCopy[x].crePermission){
          if(UtilitiesService.removeDiacritics(this.stationListCopy[x].crePermission).toLowerCase().includes(text)){
            newArray.push(this.stationListCopy[x]);
          }
        }
      }
      this.stationList = newArray;
      this.notResults = (newArray.length===0);
    }
  }

  public addStation():void{
    this.close();
    const user = LocalStorageService.getItem(Constants.UserInSession);
    user.refId =  user.refId? user.refId : this._data.id;
    this._auth.updateUserInSession(user);
    this._addStation.open().afterClosed().subscribe(()=>{
      user.refId = null;
      this._auth.updateUserInSession(user);
    });
  }

  public goToDashboard(station: any): void{
    let stationsView = SessionStorageService.getItem(Constants.StationAdmin) || [];
    if(stationsView){
      stationsView.forEach(item => {
        item.lastView = false;
      });
    }
    stationsView.push({stationId: station.id, consultancyId: this._data.id, lastView: true});
    SessionStorageService.setItem(Constants.StationAdmin, stationsView);
    LocalStorageService.setItem(Constants.ConsultancyInSession, this._data);
    window.open('/#/home?station='+station.id,'_blank');
  }

  private getUtilities():void{
    this._api.getUtils().subscribe(response=>{
      switch (response.code){
        case 200:
          this.utils = response.item.groupIcons;
          break;
        default:
          break;
      }
    })
  }

  private getList(id: any): void{
    this._api.getConsultancyBasicData(CookieService.getCookie(Constants.IdSession), id).subscribe(response => {
      switch (response.code){
        case 200:
          if(response.item.stationLites){
            this.stationList = response.item.stationLites;
            this.stationListCopy = this.stationList;
          }else{
            this.stationList = [];
            this.stationListCopy = this.stationList;
          }
          break;
        default:
          this.onErrorOccurred();
          break;
      }
    });
  }

  private onErrorOccurred(): void{
    this._snackBar.openSnackBar('Ha ocurrido un error, por favor, intente de nuevo', 'OK', 3000);
  }

}