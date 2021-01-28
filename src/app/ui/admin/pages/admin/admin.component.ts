/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from 'app/core/services/api/api.service';
import {AuthService} from 'app/core/services/auth/auth.service';
import {DialogService} from 'app/shared/components/dialog/dialog.service';
import {Subscription} from 'rxjs';
import {ListStationsService} from '@app/ui/admin/components/list-stations/list-stations.service';
import {AddConsultancyService} from '@app/ui/admin/components/add-consultancy/add-consultancy.service';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {Consultancy} from '@app/utils/interfaces/consultancy';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {EntityCollectionResponse} from '@app/utils/class/entity-collection-response';
import {SnackBarService} from '@maplander/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  public load: boolean;
  public consultancyList: Consultancy[];
  public consultancyListCopy: Consultancy[];
  public notResults: boolean;
  private _subscriptionLoader: Subscription;

  constructor(
    private _collaborators: ListStationsService,
    private _addConsultancy: AddConsultancyService,
    private _apiLoader: LoaderService,
    private _auth: AuthService,
    private _dialog: DialogService,
    private _api: ApiService,
    private _snackBar: SnackBarService
  ) {
    this.consultancyList = [];
    this.consultancyListCopy = [];
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => this.load = load);
    this.getConsultancyList();
  }

  ngOnDestroy(): void {
    this._subscriptionLoader.unsubscribe();
  }

  public getConsultancyList(): void {
    this._api.listConsultancy().subscribe((response: EntityCollectionResponse<Consultancy>) => {
      if (response.code === HttpResponseCodes.OK) {
        this.consultancyList = response.items;
        this.consultancyListCopy = this.consultancyList;
      }
    });
  }

  public openCollaborators(id: string, name: string): void {
    this._collaborators.open(id, name);
  }

  public addConsultancy(): void {
    this._addConsultancy.open().afterClosed().subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this.getConsultancyList();
      }
    });
  }

  public signOut(): void {
    this._dialog.confirmDialog('Está a punto de cerrar sesión',
      '¿Desea continuar?',
      'ACEPTAR',
      'CANCELAR').afterClosed().subscribe((response) => {
      if (response.code === 1) {
        this._auth.logOut();
      }
    });
  }


  public search(ev: any): void {
    const text = ev.target.value.toLowerCase();
    if (text === '') {
      this.consultancyList = this.consultancyListCopy;
    } else {
      const listCopy = this.consultancyListCopy;
      const newResults = [];
      listCopy.forEach(item => {
        if (item.businessName.toLowerCase().includes(text) || item.address.toLowerCase().includes(text) ||
          item.officePhone.toLowerCase().includes(text)) {
          newResults.push(item);
        }
      });
      this.consultancyList = newResults;
      this.notResults = (newResults.length === 0);
    }

  }
  public toggleDisabledConsultancy(consultancy: Consultancy): void {
    consultancy.disabled = !consultancy.disabled;
    this._api.updateConsultancy(consultancy).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        for (const item of this.consultancyList) {
          if (item.id === response.item.id) {
            item.disabled = response.item.disabled;
            break;
          }
        }
      } else {
        this._dialog.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
      }
    });
  }

  public deleteConsultancy(id: string): void {
    this._snackBar.setMessage('Proximamente...', 'OK', 5000);
  }
}
