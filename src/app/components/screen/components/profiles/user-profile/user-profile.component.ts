/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/core/services/api/api.service';
import {UpdatePasswordService} from '@app/core/components/update-password/update-password.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {CountryCodeService} from '@app/core/components/country-code/country-code.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {UploadImageService} from '@app/core/components/upload-image/upload-image.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {Constants} from '@app/core/constants.core';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        query('#user-profile', style({ opacity: 0, background: 'transparent' }), {optional: true}),
        query('#user-profile', stagger('10ms', [
          animate('.2s ease-out', keyframes([
            style({opacity: 0, background: 'transparent', offset: 0}),
            style({opacity: .5, background: 'rgba(255, 255, 255, .5)', offset: 0.5}),
            style({opacity: 1, background: 'rgba(255, 255, 255, 1)',  offset: 1.0}),
          ]))]), {optional: true})
      ]),
      transition(':leave', [
        query('#user-profile', style({ opacity: 1, background: 'rgba(255, 255, 255, 1)' }), {optional: true}),
        query('#user-profile', stagger('10ms', [
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
export class UserProfileComponent implements OnInit {
  private _formData: FormData;
  private _formDeleteData: FormData;
  private _formFile: FormData;
  public user: any;
  public userInformation: any;
  public load: boolean;
  public role: string[] = [
    'Director',
    'Gerente',
    'Asistente',
    'Representante legal',
    'Encargado de estación',
    'Gerente de estación',
    'Asistente de estación'];
  public userRole: string;
  public profileForm: FormGroup;
  public newImage: boolean = false;
  public deleteImage: boolean = false;
  public protocol: string = 'http://';
  public profileImage: any;
  public newImageProfile: any;
  public country: any;
  public change: boolean = false;
  public blobName: any;
  public password: string;
  public file: any;
  public newFileSub: any;
  public newFile: boolean = false;
  public deleteFile: boolean = false;
  constructor(
    private _router: Router,
    private _api: ApiService,
    private _apiLoaderService: ApiLoaderService,
    private _updatePassword: UpdatePasswordService,
    private _dialogService: DialogService,
    private _countryCodeService: CountryCodeService,
    private _snackBarService: SnackBarService,
    private _uploadImage: UploadImageService,
    private _formBuilder: FormBuilder,
    private _UploadFile: UploadFileService
  ) { }

  ngOnInit() {
    this.initUserInfo();
    this._apiLoaderService.getProgress().subscribe(load => {this.load = load; });
  }
  public closeProfile():void{
    this._router.navigate(['/home']);
  }

  public onLoadImage(event): void{
    this.newImage = true;
    this.change = true;
    this.deleteImage = false;
    this.profileImage = event.url;
    this._formData = new FormData();
    this._formData.append('path', '');
    this._formData.append('fileName', 'profile-'+this.user.id+'-'+new Date().getTime()+'.png');
    this._formData.append('isImage', 'true');
    this._formData.append('file', event.blob);
  }

  public onLoadFile(event): void{
    this.newFile = true;
    this.deleteFile = false;
    this.change = true;
    this._formFile = new FormData();
    this._formFile.append('path', '');
    this._formFile.append('fileName', 'benzene-'+this.user.id+'-'+new Date().getTime()+'.pdf');
    this._formFile.append('file', event.blob);
  }

  public onRemoveFile(): void{
    this.newFile = false;
    this.deleteFile = true;
    this.change = true;
    this.file = ''
  }

  public onRemoveImage(): void {
    this.change = true;
    this.deleteImage = true;
    this.newImage = false;
    this.profileImage='';
    this._formData = new FormData();
    this._formData.append('file',this.blobName);
    this._formDeleteData = new FormData();
    this._formDeleteData.append('blobName', this.blobName);
  }

  public openListCountry(): void {
    this._countryCodeService.openDialog().afterClosed().subscribe(response => {
      this.profileForm.patchValue({
        country: response.name,
        code: response.code
      });
    });
  }

  public changePassword(){
    this._updatePassword.updatePassword(
      this.user.password,
      'Actualice su contraseña',
      '',
      'Contraseña actual',
      'Nueva contraseña',
      'Confirmar nueva contraseña',
      'ACEPTAR',
      'CANCELAR'
    ).afterClosed().subscribe(response =>{
      switch (response.code) {
        case 1:
          this.password = response.data.newPassword;
          break;
        default:
          this.profileForm.patchValue({

          });
          break;
      }
    })
  }

  private uploadImage(): void{
    this._uploadImage.uploadImage(this._formData).subscribe(response => {
      if (response){
        this.newImageProfile = {
          thumbnail: response.item.thumbnail || '',
          blob: response.item.blobName || ''
        };
        this.newImage = false;
        this.updateProfile(this.profileForm.value);
      }
    });
  }

  private uploadFile(): void{
    this._UploadFile.uploadFile(this._formFile).subscribe(response => {
      if (response){
        this.newFileSub = {
          thumbnail: response.item.thumbnail || '',
          blob: response.item.blobName || ''
        };
        this.newFile = false;
        this.updateProfile(this.profileForm.value);
      }
    });
  }

  private initUserInfo(): void {
    this.profileForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      country: ['', [Validators.required]],
      code: ['', []],
      phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
      jobTitle: ['', [Validators.required]],
      website: ['', [Validators.pattern('[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$')]],
      bloodType: ['',[Validators.pattern('^(A|B|AB|O)[+-]$')]],
      contactPhone:['',[Validators.minLength(8), Validators.maxLength(13)]],
      contactKinship:['',[]],
      contactName:['',[]],
      ssn:['',[]]
    });
    this.getUser();
  }

  private getUser(): void{
    this._api.getPerson(CookieService.getCookie(Constants.IdSession)).subscribe(response=>{
      switch (response.code) {
        case 200:
          this.user = response.item;
          if (this.user.profileImage){
            this.profileImage = this.user.profileImage.thumbnail;
            this.blobName = this.user.profileImage.blobName;
          }
          if (this.user.countryCode){
            if (!this.user.countryCode.includes('+')) {
              this.user.countryCode = '+' + this.user.countryCode;
            }
            for (let country of Constants.countries){
              if (country.code === this.user.countryCode){
                this.country=country.name;
              }
            }
          }
          if (this.user.website){
            if (this.user.website.includes('http://')){
              this.user.website = this.user.website.replace('http://','');
              this.protocol = 'http://';
            } else {
              this.user.website = this.user.website.replace('https://','');
              this.protocol = 'https://';
            }
          }
          this.userRole = this.role[this.user.role-1];
          this._api.getPersonInformation(this.user.id).subscribe(response =>{
            switch (response.code) {
              case 200:
                this.userInformation = response.item;
                if (this.userInformation.benzene){
                  this.file = this.userInformation.benzene.thumbnail
                }
                this.profileForm.patchValue({
                  name: this.user.name,
                  lastName: this.user.lastName,
                  email: this.user.email,
                  country: this.country,
                  code: this.user.countryCode,
                  phoneNumber: this.user.phoneNumber,
                  jobTitle: this.user.jobTitle,
                  website: this.user.website,
                  bloodType: this.userInformation.bloodType,
                  contactPhone: this.userInformation.concatcPhone,
                  contactKinship: this.userInformation.contactKinship,
                  contactName: this.userInformation.contactName,
                  ssn: this.userInformation.ssn
                });
                break;
              default:
                this.profileForm.patchValue({
                  name: this.user.name,
                  lastName: this.user.lastName,
                  email: this.user.email,
                  country: this.country,
                  code: this.user.countryCode,
                  phoneNumber: this.user.phoneNumber,
                  jobTitle: this.user.jobTitle,
                  website: this.user.website
                });
                this.userInformation = {
                  bloodType:'',
                  concatcPhone:'',
                  contactKinship:'',
                  contactName:'',
                  ssn:'',
                  id:'',
                  benzene: {
                    thumbnail: '',
                    blobName: ''
                  }
                };
                break;
            }
          });
          break;
      }
    })
  }

  private updateProfile(data: any, event?: any):void{
    if (this.profileForm.invalid){
      return;
    }
    if (this.newImage){
      this.uploadImage();
    }
    if(this.deleteImage){
      this.newImageProfile = {
        thumbnail: '',
        blob: ''
      };
      this.deleteImage=false;
      this.updateProfile(data);
    }
    if (this.newFile){
      this.uploadFile();
    }
    if (this.deleteFile) {
      this.newFileSub = {
        thumbnail: '',
        blob: ''
      };
      this.deleteFile= false;
      this.uploadFile();
    }
    this.saveProfileInformation(data);
  }

  private saveProfileInformation(data: any): void{
    data.code = data.code.replace('+','');
    this.user.name = data.name;
    this.user.lastName = data.lastName;
    this.user.countryCode = data.code;
    this.user.phoneNumber = data.phoneNumber;
    this.user.jobTitle = data.jobTitle;
    this.userInformation.ssn = data.ssn;
    this.userInformation.bloodType = data.bloodType;
    this.userInformation.concatcPhone = data.contactPhone;
    this.userInformation.contactName = data.contactName;
    this.userInformation.contactKinship = data.contactKinship;
    if (this.password) {
      this.user.password = this.password;
    }
    this.user.website = (data.website? this.protocol+data.website : '');
    if (this.newImageProfile){
      this.user.profileImage = {
        blobName: this.newImageProfile.blob,
        thumbnail: this.newImageProfile.thumbnail
      };
      SessionStorageService.setItem(Constants.UserInSession, {
        profileImage: this.user.profileImage.thumbnail,
        role : this.user.role
      });
    }
    if (this.newFileSub) {
      this.userInformation.benzene = {
        thumbnail: this.newFileSub.thumbnail,
        blobName: this.newFileSub.blob
      }
    }
    this._api.updatePerson(this.user).subscribe(response=>{
      switch (response.code) {
        case 200:
            this.userInformation.id = this.user.id;
            this._api.savePersonInformation(this.userInformation).subscribe(response=>{
              switch (response.code) {
                case 200:
                  this.change = false;
                  this._snackBarService.openSnackBar('Información actualizada','OK',3000);
                  this._router.navigate(['/home']);
                  break;
                default:
                  this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
                  break;
              }
            });
          break;
        default:
          this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
          break;
      }
    });
  }
}
