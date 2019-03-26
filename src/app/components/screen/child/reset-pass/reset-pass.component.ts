/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {Constants} from '@app/core/constants.core';
import {ApiService} from '@app/core/services/api/api.service';
import {AuthService} from '@app/core/services/auth/auth.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Rx';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';

export function ValidatePasswords(ac: AbstractControl) {
  let password = ac.get('newPassword').value;
  let repeatPassword = ac.get('confirmNewPassword').value;
  if(password !== repeatPassword){
    ac.get('confirmNewPassword').setErrors({differentPasswords: true});
  }else{
    return null;
  }
}

const md5 = require('md5');

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        query('#reset-password', style({ opacity: 0, background: 'transparent' }), {optional: true}),
        query('#reset-password', stagger('10ms', [
          animate('.2s ease-out', keyframes([
            style({opacity: 0, background: 'transparent', offset: 0}),
            style({opacity: .5, background: 'rgba(255, 255, 255, .5)', offset: 0.5}),
            style({opacity: 1, background: 'rgba(255, 255, 255, 1)',  offset: 1.0}),
          ]))]), {optional: true})
      ]),
      transition(':leave', [
        query('#reset-password', style({ opacity: 1, background: 'rgba(255, 255, 255, 1)' }), {optional: true}),
        query('#reset-password', stagger('10ms', [
          animate('.2s ease-in', keyframes([
            style({opacity: 1, background: 'rgba(255, 255, 255, 1)', offset: 0}),
            style({opacity: .5, background: 'rgba(255, 255, 255, .5)',  offset: 0.5}),
            style({opacity: 0, background: 'transparent',     offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])
  ],
  host: {'[@fadeInAnimation]': ''}
})
export class ResetPassComponent implements OnInit, OnDestroy {

  @ViewChild('inputPasswordOne') private _inputPassOne: ElementRef;
  @ViewChild('inputPasswordTwo') private _inputPassTwo: ElementRef;
  public load: boolean;
  public hideOne: boolean;
  public hideTwo: boolean;
  public newPassForm: FormGroup;
  private _subscriptionLoader: Subscription;
  private _user: any;
  constructor(
    private _dialogService: DialogService,
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _snackBarService: SnackBarService,
    private _auth: AuthService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load=>{this.load = load});
    this.initForm();
  }

  ngOnDestroy(): void{
    this._subscriptionLoader.unsubscribe();
  }

  public initForm(): void {
    this.newPassForm = this._formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmNewPassword: ['',[Validators.required]]
    });
    this.newPassForm.setValidators(ValidatePasswords);
  }

  public seeHidePassword(type: boolean): void{
    if(type){
      this.hideOne = !this.hideOne;
      this._inputPassOne.nativeElement.type = (this.hideOne)?'text':'password';
    }else{
      this.hideTwo = !this.hideTwo;
      this._inputPassTwo.nativeElement.type = (this.hideTwo)?'text':'password';
    }
  }

  public updatePassword(value: any): void{
   if(this.newPassForm.invalid){
      return;
   }
   this.signInWidthIdLink(value);
  }

  private signInWidthIdLink(value: any): void {
    this._auth.requestPermissionNotifications().subscribe((token: string | null)=>{
      this._api.signInWithLink(LocalStorageService.getItem(Constants.UpdatePassword), token).subscribe(response=>{
        switch (response.code){
          case 200:
            this._user = response.item;
            this.updatePersonPassword(value,token);
            break;
          default:
            break;
        }
      });
    });
  }

  private updatePersonPassword(value: any, token: string): void{
    this._user.password = md5(value.newPassword);
    this._api.updatePerson(this._user).subscribe(response=>{
      switch (response.code){
        case 200:
          this._auth.logIn(response.item,true, token);
          LocalStorageService.removeItem(Constants.UpdatePassword);
          this._snackBarService.openSnackBar('Contraseña actualizada', 'OK', 3000);
          break;
        default:
          this._snackBarService.openSnackBar('No se a podido actualizar la contraseña', 'OK', 3000);
          this._router.navigate(['/login']).then();
          break;
      }
    })
  }
}
