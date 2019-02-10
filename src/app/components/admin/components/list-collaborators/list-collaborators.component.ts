/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ApiService} from '@app/core/services/api/api.service';
import {Constants} from '@app/core/constants.core';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {AddStationService} from '@app/components/screen/components/add-gas-station/add-station.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-collaborators',
  templateUrl: './list-collaborators.component.html',
  styleUrls: ['./list-collaborators.component.scss']
})
export class ListCollaboratorsComponent implements OnInit {

  public stationList: any[];
  public stationListCopy: any[];
  public title: string;
  public notResults: boolean;
  public utils: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialog: MatDialogRef<ListCollaboratorsComponent>,
    private _snackBar: SnackBarService,
    private _dialogService: DialogService,
    private _api: ApiService,
    private _addStation: AddStationService,
    private _router: Router
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

  public search(ev: any): void{
    const newArray = [];
    const text = (ev.srcElement.value).toLowerCase();
    if(text === ''){
      this.stationList = this.stationListCopy;
    }else{
      for(let x=0; x < this.stationListCopy.length; x++){
        if(UtilitiesService.removeDiacritics(this.stationListCopy[x].managerName).toLowerCase().includes(text) || this.stationListCopy[x].email.toLowerCase().includes(text) || this.stationListCopy[x].phoneNumber.includes(text) || UtilitiesService.removeDiacritics(this.stationListCopy[x].crePermission).toLowerCase().includes(text) || UtilitiesService.removeDiacritics(this.stationListCopy[x].name).toLowerCase().includes(text)){
          newArray.push(this.stationListCopy[x]);
        }else {
          for (let i= 0; i<this.utils.length; i++){
            if(UtilitiesService.removeDiacritics(this.utils[i].name).toLowerCase().includes(text) && this.stationListCopy[x].type === i+1){
              newArray.push(this.stationListCopy[x]);
            }
          }
        }
      }
      this.stationList = newArray;
      this.notResults = (newArray.length===0);
    }
  }

  public addStation():void{
    LocalStorageService.setItem(Constants.UserInSession,{profileImage: null, role: 7, refId: this._data.id});
    this.close();
    this._addStation.open().afterClosed().subscribe( res=>{
      LocalStorageService.setItem(Constants.UserInSession,{profileImage: null, role: 7});
    });
  }

  public goToDashboard(id: string): void{
    LocalStorageService.setItem(Constants.UserInSession,{profileImage: null, role: 7, refId: this._data.id});
    this._dialog.close();
    this._router.navigate(['/home'], {queryParams:{
      station: id,
      admin: true
    }}).then();
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
