/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, DoCheck, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation} from '@angular/core';
import {AuthService} from '@app/core/services/auth/auth.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {Constants} from '@app/core/constants.core';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {Subscription} from 'rxjs';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavBarComponent implements OnInit, DoCheck, OnDestroy  {

  public user: any = {};
  public load: boolean;
  public imageExist: boolean = false;
  private _subscriptionLoader: Subscription;
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(PLATFORM_ID) private _platformId: string,
    private _auth: AuthService,
    private _dialogService: DialogService,
    private _router: Router,
    private _apiLoader: ApiLoaderService,
    private _sharedService: SharedService
  ) {
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => this.load = load);
  }

  ngDoCheck(): void {
    this.getUser();
  }

  ngOnDestroy(): void{
    this._subscriptionLoader.unsubscribe();
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
        this._router.navigate(['/home/profile/consultancy']).then();
        break;
      case 4:
      case 5:
      case 6:
        this._router.navigate(['/home/profile/user']).then();
        break;
      default:
        break
    }
  }

  private getUser(): void {
    this.user = LocalStorageService.getItem(Constants.UserInSession);
    if (this.user){
      this.imageExist = this.user.profileImage && this.user.profileImage !== '';
    }
  }

  public openCollaboratorsList(): void{
    if(this.user.role !== 7){
      this._router.navigate(['/home/collaborators'], {queryParams: {consultancy: this.user.refId}}).then();
    }else{
      let consultancyId = undefined;
      const identifiers = SessionStorageService.getItem(Constants.StationAdmin);
      identifiers.forEach(item => {
        if(item.lastView){
          consultancyId = item.consultancyId;
        }
      });
      this._router.navigate(['/home/collaborators'],{queryParams: {consultancy: consultancyId}}).then();
    }
  }

  public openMenu():void{
    this._sharedService.setNotification({type:SharedTypeNotification.OpenCloseMenu, value:true});
  }

}
