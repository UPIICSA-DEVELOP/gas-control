/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {DialogService} from '@app/shared/components/dialog/dialog.service';
import {Constants} from '@app/utils/constants/constants.utils';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {SharedNotification, SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {Subscription} from 'rxjs';
import {Person} from '@app/utils/interfaces/person';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {AppUtil} from '@app/utils/interfaces/app-util';
import {Station} from '@app/utils/interfaces/station';
import {CookieService, LocalStorageService} from 'ng-maplander';

@Component({
  selector: 'app-directory-list',
  templateUrl: './directory-list.component.html',
  styleUrls: ['./directory-list.component.scss']
})
export class DirectoryListComponent implements OnInit, OnDestroy {
  public station: Station;

  @Input() set collaboratorsInfo(stationObj: Station) {
    if (stationObj) {
      this.station = stationObj;
      this.getCollaborators();
    }
  }

  @Input() public utils: AppUtil;
  public collaborators: Person[];
  public roleType: string[];
  public collaborator: Person[];
  public idSession: string;
  public user: Person;
  public emptySearch: boolean;
  private _subscriptionShared: Subscription;

  constructor(
    private _api: ApiService,
    private _snackBarService: SnackBarService,
    private _dialogService: DialogService,
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

  ngOnDestroy(): void {
    this._subscriptionShared.unsubscribe();
  }

  private getCollaborators(): void {
    this._api.listCollaborators(this.station.id, 'false').subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        const id = CookieService.getCookie(Constants.IdSession);
        let member = null;
        this.collaborators = UtilitiesService.sortJSON(response.items, 'name', 'asc');
        for (let i = 0; i < this.collaborators.length; i++) {
          if (this.collaborators[i].id === id) {
            member = this.collaborators[i];
          }
        }
        if (this.user) {
          const index = this.collaborators.indexOf(member);
          this.collaborators.splice(index, 1);
        }
        this.collaborator = this.collaborators;
      } else {
      }
    });
  }

  public deleteCollaborator(id: string, index: number, role: number) {
    if (role <= 4) {
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
      'CANCELAR').afterClosed().subscribe(response => {
      if (response.code === 1) {
        this._api.deletePerson(id).subscribe(deletePerson => {
          if (deletePerson.code === HttpResponseCodes.OK) {
            this.collaborators.splice(index, 1);
          } else {
          }
        });
      } else {
      }
    });
  }

  public search(event: any): void {
    const newArray = [];
    const text = (event.target.value).toLowerCase();
    if (text === '') {
      this.collaborators = this.collaborator;
    } else {
      for (let x = 0; x < this.collaborator.length; x++) {
        if (UtilitiesService.removeDiacritics(this.collaborator[x].name).toLowerCase().includes(text) ||
          this.collaborator[x].email.toLowerCase().includes(text) || this.collaborator[x].phoneNumber.includes(text) ||
          UtilitiesService.removeDiacritics(this.collaborator[x].lastName).toLowerCase().includes(text)) {
          newArray.push(this.collaborator[x]);
        } else {
          for (let y = 0; y < this.roleType.length; y++) {
            if (UtilitiesService.removeDiacritics(this.roleType[y]).toLowerCase().includes(text) && this.collaborator[x].role === y + 1) {
              newArray.push(this.collaborator[x]);
            }
          }
        }
      }
      if (newArray.length > 0) {
        this.collaborators = newArray;
      } else {
        this.collaborators = newArray;
        this.emptySearch = (newArray.length === 0);
      }
    }
  }

  private onChangesComponents(): void {
    this._subscriptionShared = this._sharedService.getNotifications().subscribe((response: SharedNotification) => {
      if (response.type === SharedTypeNotification.Directory) {
        this.getCollaborators();
      }
    });
  }

  public changeRoleCollaborator(person: Person): void {
    let newRole = 0;
    switch (person.role) {
      case 5:
        newRole = 6;
        break;
      case 6:
        newRole = 5;
        break;
    }
    const message = '¿Desea cambiar el rol de ' + person.name + ' ' + person.lastName + ' a ' + this.roleType[newRole - 1] + '?';
    this._dialogService.confirmDialog(message, '', 'ACEPTAR', 'CANCELAR').afterClosed().subscribe(response => {
      if (response.code === 1) {
        this._api.updateRolePerson(person.id, newRole).subscribe(updatePerson => {
          if (updatePerson.code === HttpResponseCodes.OK) {
            this._snackBarService.openSnackBar('Rol actualizado', 'OK', 2000);
            this.getCollaborators();
          } else {
            this._snackBarService.openSnackBar('No se ha podido actualizar el rol', 'OK', 2000);
            this.getCollaborators();
          }
        });
      }
    });
  }

}
