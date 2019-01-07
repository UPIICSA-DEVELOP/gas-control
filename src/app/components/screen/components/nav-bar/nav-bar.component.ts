/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, DoCheck, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AuthService} from '@app/core/services/auth/auth.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {MatSidenav} from '@angular/material';
import {Constants} from '@app/core/constants.core';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, DoCheck  {

  public menu: MatSidenav;
  public user: any = {};
  public imageExist: boolean = false;
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(PLATFORM_ID) private _platformId: string,
    private _auth: AuthService,
    private _dialogService: DialogService,
    private _router: Router
  ) {
  }

  ngOnInit() {
    this.getUser();
  }

  ngDoCheck(): void {
    this.getUser();
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

  public navigateProfile():void {
    switch (this.user.role) {
      case 1:
      case 2:
      case 3:
        this._router.navigate(['/home/profile/consultancy']);
        break;
      case 4:
      case 5:
      case 6:
      case 7:
        this._router.navigate(['/home/profile/user']);
        break;
      default:
        break
    }
  }

  private getUser(): void {
    this.user = SessionStorageService.getItem(Constants.UserInSession);
    if (this.user.profileImage && this.user.profileImage !=='') {
      this.imageExist = true;
    }else {
      this.imageExist = false;
    }
  }

}
