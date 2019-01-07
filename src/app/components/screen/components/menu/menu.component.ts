/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {AuthService} from '@app/core/services/auth/auth.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {Router} from '@angular/router';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {Constants} from '@app/core/constants.core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @ViewChild('sidenav') menu: MatSidenav;
  @Output() menuObject: EventEmitter<any> = new EventEmitter<any>();
  public visibleMask: boolean;
  public user: any;
  constructor(
    @Inject(PLATFORM_ID) private _platformId,
    private _auth: AuthService,
    private _dialogService: DialogService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.menuObject.emit(this.menu);
  }

  public onOpenMenu(event: any): void{
    this.visibleMask = true;
  }

  public onCloseMenu(): void{
    this.visibleMask = false;
    this.menu.close().then();
  }

  public logOutButton(): void{
    this.onCloseMenu();
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

  public navigateProfile(): void{
    this.user = SessionStorageService.getItem(Constants.UserInSession);
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
        break;
    }
    this.onCloseMenu();
  }

}
