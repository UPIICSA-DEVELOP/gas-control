/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from 'app/core/services/api/api.service';
import {DialogService} from 'app/shared/components/dialog/dialog.service';
import {SnackBarService} from 'app/core/services/snackbar/snackbar.service';
import {AuthService} from 'app/core/services/auth/auth.service';
import {Subscription} from 'rxjs';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {Person} from '@app/utils/interfaces/person';
const md5 = require('md5');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {

  @ViewChild('inputPassword', { static: true }) private _inputPassword: ElementRef;
  public load: boolean;
  public loginForm: FormGroup;
  public hide: boolean = false;
  private _subscriptionLoader: Subscription;
  constructor(
    private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _apiLoader: LoaderService,
    private _dialogService: DialogService,
    private _snackService: SnackBarService,
    private _auth: AuthService
  ) { }
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberPass: [false, []]
    });
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {this.load = load; });
  }

  ngOnDestroy(): void{
    this._subscriptionLoader.unsubscribe();
  }

  public loginUser(data: any): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.signInUser(data.email, md5(data.password), (data.remember) ? true : false);
  }

  public resetPassword(): void {
    this._dialogService.alertWithInput(
      'Ingrese su Email',
      '',
      'Email',
      'ACEPTAR',
      'CANCELAR',
      this.loginForm.controls['email'].value).afterClosed().subscribe(response => {
      switch (response.code) {
        case 1:
          const email: string = response.data.text;
          this._apiService.resetPassword(response.data.text).subscribe( (response: any) =>{
            switch (response.code) {
              case 200:
                  this._dialogService.alertDialog('Información','Hemos enviado un link de recuperación de contraseña al correo: '+ email,'ACEPTAR');
                break;
              case 471:
                  this._snackService.openSnackBar('Este usuario no está registrado','OK', 5000);
                break;
              default:
                this.connectionLost();
                break;
            }
          });
          break;
      }
    });
    document.title = '';
  }
  public connectionLost(): void {
    this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
  }
  public showPassword(): void {
    this.hide = !this.hide;
    this._inputPassword.nativeElement.type = (this.hide)?'text':'password';
  }
  private signInUser(email: string, password: string, remember: boolean) {
    this._auth.requestPermissionNotifications().subscribe((token: string) => {
      const opt = {
      email: email,
      password: password,
      token: token || null
    };
    this._apiService.signIn(opt).subscribe((response: any) => {
      switch (response.code) {
        case 200:
          this._auth.logIn(response.item, remember, token);
          break;
        case 471:
          this.loginForm.controls['email'].setErrors({notExist: true});
          this._snackService.openSnackBar('Este usuario no está registrado','OK', 2000);
          break;
        case 472:
          this.loginForm.controls['password'].setErrors({incorrect: true});
          this._snackService.openSnackBar('Usuario o contraseña inválidos','OK', 2000);
          break;
        case 500:
          this.connectionLost();
          break;
        default:
          this.connectionLost();
          break;
      }
    });
    })
  }

}
