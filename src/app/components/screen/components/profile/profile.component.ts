/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {Constants} from '@app/core/constants.core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('see-pass') private _see_pass: ElementRef;
  public user: any;
  public load: boolean;
  public profileForm: FormGroup;
  public hide: boolean;
  public protocol: any = 'http';
  constructor(
    private _api: ApiService,
    private _formBuilder: FormBuilder,
    private _apiLoaderService: ApiLoaderService,
    private _dialogService: DialogService,
    private _snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    this.getUserInfo();
    this.profileForm = this._formBuilder.group({
      name:[this.user.name || '', [Validators.required]],
      lastName:[this.user.lastName || '', [Validators.required]]
    })
  }
  private getUserInfo(): void {
    this._api.getPerson(CookieService.getCookie(Constants.IdSession)).subscribe(response =>{
      switch (response.code) {
        case 200:
          this.user = response.item;
          break;
      }
    });
  }
}
