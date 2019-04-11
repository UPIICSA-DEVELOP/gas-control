/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {Constants} from '@app/core/constants.core';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {SharedNotification, SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {Subscription} from 'rxjs/index';

@Component({
  selector: 'app-directory-list',
  templateUrl: './directory-list.component.html',
  styleUrls: ['./directory-list.component.scss']
})
export class DirectoryListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public gasStation: any;
  @Input() public utils: any;
  public collaborators: any[];
  public roleType: string[];
  public collaborator: any[];
  public idSession: string;
  public user: any;
  public emptySearch: boolean;
  private _subscriptionShared: Subscription;
  constructor(
    private _api:ApiService,
    private _snackBarService: SnackBarService,
    private _dialogService:DialogService,
    private _sharedService: SharedService
  ) {
    this.user = LocalStorageService.getItem(Constants.UserInSession);
    this.idSession = CookieService.getCookie(Constants.IdSession);
    this.emptySearch = false;
  }

  ngOnInit() {
    this.roleType = Constants.roles;
    this.collaborators = [];
    this.onChangesComponents();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.gasStation){
      this.getCollaborators();
    }
  }

  ngOnDestroy(): void{
    this._subscriptionShared.unsubscribe();
  }

  private getCollaborators():void{
    this._api.listCollaborators(this.gasStation.id, 'false').subscribe( response=>{
      switch (response.code) {
        case 200:
          this.collaborators = UtilitiesService.sortJSON(response.items, 'name', 'asc');
          this.collaborator = this.collaborators;
          break;
        default:
          break;
      }
    });
  }

  public deleteCollaborator(id: string, index: number, role: number){
    if (role<=4){
      this._dialogService.alertDialog(
        'Información',
        'No es posible eliminar este usuario',
        'ACEPTAR'
      );
      return;
    }
    this._dialogService.confirmDialog('¿Desea eliminar este registro?',
      '',
      'ACEPTAR',
      'CANCELAR').afterClosed().subscribe(response=>{
        switch (response.code) {
          case 1:
            this._api.deletePerson(id).subscribe(response=>{
              switch (response.code) {
                case 200:
                  this.collaborators.splice(index, 1);
                  break;
                default:
                  break;
              }
            });
            break;
          default:
            break;
        }
    })
  }

  public search(event: any): void{
    const newArray = [];
    const text = (event.srcElement.value).toLowerCase();
    if(text === ''){
      this.collaborators = this.collaborator;
    }else{
      for(let x=0; x < this.collaborator.length; x++){
        if(UtilitiesService.removeDiacritics(this.collaborator[x].name).toLowerCase().includes(text) || this.collaborator[x].email.toLowerCase().includes(text) || this.collaborator[x].phoneNumber.includes(text) || UtilitiesService.removeDiacritics(this.collaborator[x].lastName).toLowerCase().includes(text) ){
          newArray.push(this.collaborator[x]);
        }else {
          for (let y = 0; y < this.roleType.length; y++){
            if (UtilitiesService.removeDiacritics(this.roleType[y]).toLowerCase().includes(text) && this.collaborator[x].role === y+1){
              newArray.push(this.collaborator[x]);
            }
          }
        }
      }
      if(newArray.length > 0){
        this.collaborators = newArray;
      }else{
        this.collaborators = newArray;
        this.emptySearch = (newArray.length === 0);
      }
    }
  }

  private onChangesComponents(): void{
    this._subscriptionShared = this._sharedService.getNotifications().subscribe((response: SharedNotification)=>{
      switch (response.type){
        case SharedTypeNotification.Directory:
          this.getCollaborators();
          break;
      }
    })
  }

  public changeRoleCollaborator(person: any):void{
    let newRole = 0;
    switch (person.role){
      case 5:
        newRole = 6;
        break;
      case 6:
        newRole = 5;
        break;
    }
    const message = '¿Desea cambiar el rol de '+person.name+' '+person.lastName+' a '+this.roleType[newRole-1]+'?';
    this._dialogService.confirmDialog(message,'','ACEPTAR','CANCELAR').afterClosed().subscribe(response=>{
      switch (response.code){
        case 1:
          this._api.updateRolePerson(person.id, newRole).subscribe(response=>{
            switch (response.code) {
              case 200:
                this._snackBarService.openSnackBar('Rol actualizado', 'OK', 2000);
                this.getCollaborators();
                break;
              default:
                this._snackBarService.openSnackBar('No se ha podido actualizar el rol', 'OK', 2000);
                this.getCollaborators();
                break;
            }
          });
          break;
      }
    });
  }

}
