/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DialogService} from '@app/shared/components/dialog/dialog.service';
import {Constants} from '@app/utils/constants/constants.utils';
import {ApiService} from '@app/core/services/api/api.service';
import {AuthService} from '@app/core/services/auth/auth.service';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {Person} from '@app/utils/interfaces/person';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {ANIMATION} from '@app/ui/reset-pass/pages/reset-pass/animation';
import {LocalStorageService, SnackBarService} from '@maplander/core';

export function ValidatePasswords(ac: AbstractControl) {
  const password = ac.get('newPassword').value;
  const repeatPassword = ac.get('confirmNewPassword').value;
  if (password !== repeatPassword) {
    ac.get('confirmNewPassword').setErrors({differentPasswords: true});
  } else {
    return null;
  }
}

const md5 = require('md5');

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss'],
  animations: [ANIMATION]
})
export class ResetPassComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation')

  @ViewChild('inputPasswordOne', {static: true}) private _inputPassOne: ElementRef;
  @ViewChild('inputPasswordTwo', {static: true}) private _inputPassTwo: ElementRef;
  public load: boolean;
  public hideOne: boolean;
  public hideTwo: boolean;
  public newPassForm: FormGroup;
  private _subscriptionLoader: Subscription;
  private _user: Person;

  constructor(
    private _dialogService: DialogService,
    private _api: ApiService,
    private _apiLoader: LoaderService,
    private _snackBarService: SnackBarService,
    private _auth: AuthService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {
      this.load = load;
    });
    this.initForm();
  }

  ngOnDestroy(): void {
    this._subscriptionLoader.unsubscribe();
  }

  public initForm(): void {
    this.newPassForm = this._formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmNewPassword: ['', [Validators.required]]
    });
    this.newPassForm.setValidators(ValidatePasswords);
  }

  public seeHidePassword(type: boolean): void {
    if (type) {
      this.hideOne = !this.hideOne;
      this._inputPassOne.nativeElement.type = (this.hideOne) ? 'text' : 'password';
    } else {
      this.hideTwo = !this.hideTwo;
      this._inputPassTwo.nativeElement.type = (this.hideTwo) ? 'text' : 'password';
    }
  }

  public updatePassword(value: any): void {
    if (this.newPassForm.invalid) {
      return;
    }
    this.signInWidthIdLink(value);
  }

  private signInWidthIdLink(value: any): void {
    this._auth.requestPermissionNotifications().subscribe((token: string | null) => {
      this._api.signInWithLink(LocalStorageService.getItem<string>(Constants.UpdatePassword), token).subscribe(response => {
        if (response.code === HttpResponseCodes.OK) {
          this._user = response.item;
          this.updatePersonPassword(value, token);
        } else {
        }
      });
    });
  }

  private updatePersonPassword(value: any, token: string): void {
    this._user.password = md5(value.newPassword);
    this._api.updatePerson(this._user).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._auth.logIn(response.item, true, token);
        LocalStorageService.removeItem<string>(Constants.UpdatePassword);
        this._dialogService.alertDialog('Información', 'Contraseña actualizada');
      } else {
        this._snackBarService.setMessage('No se a podido actualizar la contraseña', 'OK', 3000);
        this._router.navigate(['/login']).then();
      }
    });
  }
}
