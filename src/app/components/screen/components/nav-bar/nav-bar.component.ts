/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {AfterViewChecked, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AuthService} from '@app/core/services/auth/auth.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {MatSidenav} from '@angular/material';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {Constants} from '@app/core/constants.core';
import {Router} from '@angular/router';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, AfterViewChecked  {

  public menu: MatSidenav;
  public profileImg: any;
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(PLATFORM_ID) private _platformId: string,
    private _auth: AuthService,
    private _dialogService: DialogService,
    private _router: Router
  ) {
  }

  ngOnInit() {
    this.profileImg = SessionStorageService.getItem(Constants.UserInSession) || null;
  }

  ngAfterViewChecked(): void {
    if (isPlatformBrowser(this._platformId)){
      let btnHome: HTMLElement = this._document.getElementById('btn-home');
      let btnNotifications: HTMLElement = this._document.getElementById('btn-notifications');
      let btnCollaborators: HTMLElement = this._document.getElementById('btn-collaborators');
      switch (this._router.url) {
        case '/home':
          btnHome.style.display = 'none';
          btnNotifications.style.display = 'block';
          btnCollaborators.style.display = 'block';
          break;
        case '/home/notifications':
          btnHome.style.display = 'block';
          btnNotifications.style.display = 'none';
          btnCollaborators.style.display = 'block';
          break;
        case '/home/collaborators':
          btnHome.style.display = 'block';
          btnNotifications.style.display = 'block';
          btnCollaborators.style.display = 'none';
          break;
      }
    }
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
