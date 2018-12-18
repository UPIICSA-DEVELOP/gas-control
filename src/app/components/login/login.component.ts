/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/core/services/api/api.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {CookieService, MaxAge} from '@app/core/services/cookie/cookie.service';
import {Constants} from '@app/core/constants.core';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('inputPassword') private _inputPassword: ElementRef;
  private _dataUser: any;
  public load: boolean;
  public loginForm: FormGroup;
  public hide: boolean = true;
  constructor(
    private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _apiLoader: ApiLoaderService,
    private _dialogService: DialogService,
    private _sessionStorage: SessionStorageService
  ) { }
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberPass: [false, []]
    });
    this._apiLoader.getProgress().subscribe(load => {this.load = load; });
  }
  public loginUser(data: any): void {
    if (this.loginForm.invalid) {
      return;
    }
    this._dataUser = {
      email: data.email,
      password: data.password,
      remember: data.rememberPass
    };
    this.signInUser(this._dataUser.email, this._dataUser.password, this._dataUser.remember);
  }
  public resetPassword(): void {
    this._dialogService.alertWithInput('Ingrese su Email', '', 'Email', 'ACEPTAR', 'CANCELAR').afterClosed().subscribe(response => {
      switch (response.code) {
        case 1:
          break;
      }
    });
    document.title = '';
  }
  public connectionLost(): void {
    this._dialogService.alertDialog('prueba', 'Se produjo un error de comunicación con el servido', 'ACEPTAR');
  }
  public showPassword(): void {
    this.hide = !this.hide;
    this._inputPassword.nativeElement.type = (this.hide)?'text':'password';
  }
  private signInUser(email: string, password: string, remember: boolean) {
    const opt = {
      email: email,
      password: password
    };
    this._apiService.signIn(opt).subscribe((response: any) => {
      switch (response.code) {
        case 200:
          this.saveUserAndContinue(response.item, remember);
          break;
        case 471:
          this.loginForm.controls['email'].setErrors({notExist: true});
          break;
        case 472:
          this.loginForm.controls['password'].setErrors({incorrect: true});
          break;
        case 500:
          this.connectionLost();
          break;
        default:
          break;
      }
    });
  }
  private saveUserAndContinue(user: any, rememberPass: boolean): void {
    let time: MaxAge;
    if (rememberPass) {
      time = MaxAge.MONTH;
    } else {
      time = MaxAge.DAY;
    }
    SessionStorageService.setItem('user', user);
    CookieService.setCookie({
      value: user.id,
      name: Constants.UserInSession,
      maxAge: time
    });
  }
}
