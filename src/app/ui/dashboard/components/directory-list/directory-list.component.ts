/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {DialogService} from '@app/shared/components/dialog/dialog.service';
import {Constants} from '@app/utils/constants/constants.utils';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {SharedNotification, SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {Subscription} from 'rxjs';
import {Person} from '@app/utils/interfaces/person';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {AppUtil} from '@app/utils/interfaces/app-util';
import {Station} from '@app/utils/interfaces/station';
import {CookieService, LocalStorageService, SnackBarService} from '@maplander/core';
import {AddStationService} from '@app/shared/components/add-gas-station/add-station.service';
import {DefaultResponse} from '@app/utils/interfaces/default-response';

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
    private _sharedService: SharedService,
    private _addStation: AddStationService
  ) {
    this.user = LocalStorageService.getItem(Constants.UserInSession);
    this.idSession = CookieService.getCookie(Constants.IdSession);
    this.emptySearch = false;
    this.collaborators = [];
  }

  ngOnInit() {
    this.roleType = Constants.roles;
    this.collaborators = [];
    this.onChangesComponents();
  }

  ngOnDestroy(): void {
    this._subscriptionShared.unsubscribe();
  }

  public deleteCollaborator(id: string, index: number, role: number) {
    switch (role) {
      case 1:
      case 2:
      case 3:
        this._dialogService.alertDialog(
          'Información',
          'No es posible eliminar este usuario',
          'ACEPTAR'
        );
        break;
      case 4:
        this._dialogService.confirmDialog(
          'Información',
          'Si desea eliminar a este usuario, deberá asignar uno nuevo ¿Desea hacerlo ahora?',
          'SI',
          'NO'
        ).afterClosed().subscribe((response) => {
          if (response.code === -1) {
            return;
          }
          this._addStation.open({
            disableClose: false,
            stationId: this.station.id,
            stepActive: 1,
            isUpdateRepresentativeLegal: true
          }).afterClosed().subscribe((data) => {
            if (!data) {
              return;
            }
            this.updateRepresentativeLegal(data.id);
          });
        });
        break;
      default:
        this._dialogService.confirmDialog('¿Desea eliminar este registro?',
          '',
          'ACEPTAR',
          'CANCELAR').afterClosed().subscribe(response => {
          if (response.code === 1) {
            this._api.deletePerson(id).subscribe(deletePerson => {
              if (deletePerson.code === HttpResponseCodes.OK) {
                this.collaborators.splice(index, 1);
              }
            });
          }
        });
        break;
    }
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

  public reSendValidationEmail(id: string): void {
    this.sendEmailValidation(id);
  }

  private getCollaborators(): void {
    this._api.listCollaborators(this.station.id, 'false').subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        let member = null;
        this.collaborators = UtilitiesService.sortJSON(response.items, 'name', 'asc');
        this.collaborators.forEach(collaborator => {
          if (collaborator.id === this.user.id) {
            member = collaborator;
          }
        });
        if (member) {
          const index = this.collaborators.indexOf(member);
          this.collaborators.splice(index, 1);
        }
        this.collaborator = this.collaborators;
      }
    });
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
            this._snackBarService.setMessage('Rol actualizado', 'OK', 2000);
            this.getCollaborators();
          } else {
            this._snackBarService.setMessage('No se ha podido actualizar el rol', 'OK', 2000);
            this.getCollaborators();
          }
        });
      }
    });
  }

  private updateRepresentativeLegal(personId: string): void {
    this._api.updateLegalRepresentativeInStation(personId, this.station.id).subscribe((response: DefaultResponse) => {
      console.log(response);
      if (response.code === HttpResponseCodes.OK) {
        this.getCollaborators();
      }
    });
  }

  private sendEmailValidation(personId: string): void {
    this._api.sendEmailToValidateAccount(personId).subscribe((response: DefaultResponse) => {
      console.log(response);
    });
  }

}
