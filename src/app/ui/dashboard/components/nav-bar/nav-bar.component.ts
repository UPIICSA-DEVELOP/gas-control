/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, DoCheck, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {AuthService} from '@app/core/services/auth/auth.service';
import {DialogService} from '@app/shared/components/dialog/dialog.service';
import {Constants} from '@app/utils/constants/constants.utils';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {Person} from '@app/utils/interfaces/person';
import {LocalStorageService, SessionStorageService} from '@maplander/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, DoCheck, OnDestroy {

  public user: Person;
  public load: boolean;
  public imageExist = false;
  private _subscriptionLoader: Subscription;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(PLATFORM_ID) private _platformId: string,
    private _auth: AuthService,
    private _dialogService: DialogService,
    private _router: Router,
    private _apiLoader: LoaderService,
    private _sharedService: SharedService
  ) {
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => this.load = load);
  }

  ngDoCheck(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this._subscriptionLoader.unsubscribe();
  }

  public logOut(): void {
    this._dialogService.confirmDialog('Está a punto de cerrar sesión',
      '¿Desea continuar?',
      'ACEPTAR',
      'CANCELAR').afterClosed().subscribe((response) => {
      if (response.code === 1) {
        this._auth.logOut();
      }
    });
  }

  public navigateProfile(): void {
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
        break;
    }
  }

  private getUser(): void {
    this.user = LocalStorageService.getItem<Person>(Constants.UserInSession);
    if (this.user) {
      this.imageExist = this.user.profileImage && this.user.profileImage.thumbnail !== '';
    }
  }

  public openCollaboratorsList(): void {
    if (this.user.role !== 7) {
      this._router.navigate(['/home/collaborators'], {queryParams: {consultancy: this.user.refId}}).then();
    } else {
      let consultancyId;
      consultancyId = null;
      const identifiers = SessionStorageService.getItem<{stationId: string, consultancyId: string, lastView: boolean}[]>
      (Constants.StationAdmin);
      identifiers.forEach(item => {
        if (item.lastView) {
          consultancyId = item.consultancyId;
        }
      });
      this._router.navigate(['/home/collaborators'], {queryParams: {consultancy: consultancyId}}).then();
    }
  }

  public openMenu(): void {
    this._sharedService.setNotification({type: SharedTypeNotification.OpenCloseMenu, value: true});
  }

}
