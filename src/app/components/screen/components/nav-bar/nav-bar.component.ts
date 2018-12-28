/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, OnInit} from '@angular/core';
import {AuthService} from '@app/core/services/auth/auth.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {MatSidenav} from '@angular/material';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {Constants} from '@app/core/constants.core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  public menu: MatSidenav;
  public profileImg: any;
  constructor(
    private _auth: AuthService,
    private _dialogService: DialogService
  ) {
  }

  ngOnInit() {
    this.profileImg = SessionStorageService.getItem(Constants.UserInSession);
  }

  public getMenu(event: MatSidenav): void{
    this.menu = event;
  }

  public openMenu(): void{
    this.menu.open().then();
  }

  public logOut(): void {
    this._dialogService.confirmDialog('Está a punto de cerrar sesión',
      '¿Desea continuar?',
      'ACEPTAR',
      'CANCELAR').afterClosed().subscribe((response) => {
      switch (response.code) {
        case 1:
          this._auth.logOut();
          break;
      }
    });
  }

}
