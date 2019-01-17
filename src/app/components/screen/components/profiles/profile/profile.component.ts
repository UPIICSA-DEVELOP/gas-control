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
import {CountryCodeService} from '@app/core/components/country-code/country-code.service';
import {LocationService} from '@app/core/components/location/location.service';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {Router} from '@angular/router';
import {UpdatePasswordService} from '@app/core/components/update-password/update-password.service';
import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';

export interface Person {
  id: string;
  refId: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
  role: number;
  jobTitle: string;
  website?: string;
  profileImage?: any;
  signature: any;
  password: string;
  bCard?: any;
}

export interface Consultancy {
  id: string;
  businessName: string;
  rfc: string;
  address: string;
  location: any;
  officePhone?: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        query('#profile', style({ opacity: 0, background: 'transparent' }), {optional: true}),
        query('#profile', stagger('10ms', [
          animate('.2s ease-out', keyframes([
            style({opacity: 0, background: 'transparent', offset: 0}),
            style({opacity: .5, background: 'rgba(255, 255, 255, .5)', offset: 0.5}),
            style({opacity: 1, background: 'rgba(255, 255, 255, 1)',  offset: 1.0}),
          ]))]), {optional: true})
      ]),
      transition(':leave', [
        query('#profile', style({ opacity: 1, background: 'rgba(255, 255, 255, 1)' }), {optional: true}),
        query('#profile', stagger('10ms', [
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
export class ProfileComponent implements OnInit {
  @ViewChild('phoneNumber') private _phoneNumberInput: ElementRef;
  private _formData: FormData;
  private _formDeleteData: FormData;
  private _formSignature: FormData;
  public user: Person;
  public consultancy: Consultancy;
  public latLong: any;
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
  public signature: any;
  public newSignature: boolean = false;
  public newSig: any;

  constructor(
    private _api: ApiService,
    private _formBuilder: FormBuilder,
    private _apiLoaderService: ApiLoaderService,
    private _snackBarService: SnackBarService,
    private _countryCode: CountryCodeService,
    private _locationService: LocationService,
    private _dialogService: DialogService,
    private _uploadImage: UploadFileService,
    private _router:Router,
    private _updatePasswordService: UpdatePasswordService,
    private _signaturePad: SignaturePadService
  ) {

  }

  ngOnInit() {
    this.initUserInfo();
    this._apiLoaderService.getProgress().subscribe(load => {this.load = load; });
  }

  public closeProfile(){
    if (this.change){
      this.saveChangeBeforeExit();
      return;
    }
    if (!this.signature) {
      this._snackBarService.openSnackBar('Por favor, registre su firma','OK', 3000);
      return;
    }
    this._router.navigate(['/home']);
  }

  public onLoadImage(event: UploadFileResponse): void{
    this.newImage = true;
    this.change = true;
    this.deleteImage = false;
    this.profileImage = event.url;
    this._formData = new FormData();
    this._formData.append('path', this.consultancy.rfc);
    this._formData.append('fileName', 'profile-'+this.user.id+'-'+new Date().getTime()+'.png');
    this._formData.append('isImage', 'true');
    this._formData.append('file', event.blob);
  }

  public onRemoveImage(): void {
    this.change = true;
    this.deleteImage = true;
    this.newImage = false;
    this.profileImage=undefined;
    this._formDeleteData = new FormData();
    this._formDeleteData.append('blobName', this.blobName);
  }

  public changePassword(){
    this._updatePasswordService.updatePassword(
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
          this.change = true;
          this.password = response.data.newPassword;
          break;
        default:
          break;
      }
    })
  }

  public detectChange(): void{
    this.profileForm.valueChanges.subscribe( value => {
      this.change = true;
    })
  }

  public openListCountry(): void {
    this._countryCode.openDialog().afterClosed().subscribe(response => {
      if (response) {
        this.change = true;
        this.country = response.iso;
        this.profileForm.patchValue({
          country: response.name,
          code: response.code
        });
        this._phoneNumberInput.nativeElement.focus();
      }
    });
  }

  public openSelectAddress(): void{
    this._locationService.open().afterClosed().subscribe(response => {
      switch (response.code) {
        case 1:
          this.latLong ={
            latitude: response.location.lat,
            longitude: response.location.lng
          };
          this.profileForm.patchValue({
            address: response.location.address
          });
          break;
        default:
          this.profileForm.patchValue({
            address: this.consultancy.address
          });
          break;
      }
    })
  }

  private uploadImage(): void{
    this._uploadImage.upload(this._formData).subscribe(response => {
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

  public saveChangeBeforeExit(): void{
      this._dialogService.confirmDialog(
        '¿Desea salir sin guardar cambios?',
        '',
        'ACEPTAR',
        'CANCELAR'
      ).afterClosed().subscribe(response=>{
        switch (response.code) {
          case 1:
            this.change = false;
            this._router.navigate(['/home']);
            break;
        }
      })
  }

  public changeSignature():void{
    this._signaturePad.open().afterClosed().subscribe(response=>{
      switch (response.code) {
        case 1:
          this.change= true;
          this.newSignature = true;
          this.signature = response.base64;
          this._formSignature = new FormData();
          this._formSignature.append('path', this.consultancy.rfc);
          this._formSignature.append('fileName', 'signature-'+this.user.id+'-'+new Date().getTime()+'.png');
          this._formSignature.append('isImage', 'true');
          this._formSignature.append('file', response.blob);
          break;
      }
    })
  }

  private uploadSignature():void{
    this._uploadImage.upload(this._formSignature).subscribe(response => {
      if (response){
        this.newSig = {
          thumbnail: response.item.thumbnail || '',
          blob: response.item.blobName || ''
        };
        this.newSignature = false;
        this.updateProfile(this.profileForm.value);
      }
    });
  }

  private getUserInfo(): void {
    this._api.getPerson(CookieService.getCookie(Constants.IdSession)).subscribe(response => {
      switch (response.code) {
        case 200:
          this.user = {
            id: response.item.id,
            refId: response.item.refId,
            country: (response.item.country?response.item.country:''),
            countryCode: response.item.countryCode || '',
            email: response.item.email,
            jobTitle: response.item.jobTitle,
            lastName: response.item.lastName,
            name: response.item.name,
            password: response.item.password,
            phoneNumber: response.item.phoneNumber,
            profileImage: (response.item.profileImage?{
              blobName: (response.item.profileImage? response.item.profileImage.blobName : undefined),
              thumbnail: (response.item.profileImage? response.item.profileImage.thumbnail : undefined)
            }:undefined),
            role: response.item.role,
            signature: (response.item.signature?{
              blobName: (response.item.signature?response.item.signature.blobName : undefined),
              thumbnail: (response.item.signature?response.item.signature.thumbnail : undefined),
            }:undefined),
            website: response.item.website || '',
            bCard: (response.item.bCard?response.item.bCard:null)
          };
          if (this.user.profileImage){
            this.profileImage = this.user.profileImage.thumbnail;
            this.blobName = this.user.profileImage.blobName;
          }
          let formCountry: string;
          if (this.user.country){
            for (let country of Constants.countries){
              if (country.iso === this.user.country){
                this.country = country.iso;
                formCountry=country.name;
                break;
              }
            }
          }
          if (this.user.countryCode){
            if (!this.user.countryCode.includes('+')) {
              this.user.countryCode = '+' + this.user.countryCode;
            }
          }
          if(this.user.signature){
            this.signature = this.user.signature.thumbnail
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
          this._api.getConsultancy(this.user.refId).subscribe(response => {
            switch (response.code) {
              case 200:
                this.consultancy = {
                  address: response.item.address,
                  businessName: response.item.businessName,
                  id: response.item.id,
                  location: {
                    latitude: (response.item.location?response.item.location.latitude : 19.432675),
                    longitude: (response.item.location?response.item.location.longitude : -99.133461)
                  },
                  officePhone: response.item.officePhone || '',
                  rfc: response.item.rfc
                };
                if (this.consultancy.location){
                  this.latLong = {
                    latitude: this.consultancy.location.latitude,
                    longitude: this.consultancy.location.longitude
                  };
                }
                this.profileForm.patchValue({
                  name: this.user.name,
                  lastName: this.user.lastName,
                  email: this.user.email,
                  country: formCountry,
                  code: this.user.countryCode,
                  phoneNumber: this.user.phoneNumber,
                  jobTitle: this.user.jobTitle,
                  website: this.user.website,
                  businessName: this.consultancy.businessName,
                  rfc: this.consultancy.rfc,
                  address: this.consultancy.address,
                  officePhone: this.consultancy.officePhone
                });
                if (this.user.role !== 1) {
                  this.profileForm.controls['businessName'].disable();
                  this.profileForm.controls['rfc'].disable();
                  this.profileForm.controls['address'].disable();
                  this.profileForm.controls['officePhone'].disable();
                }
                this.detectChange();
                if (LocalStorageService.getItem('notSign')) {
                  this.changeSignature();
                }
                break;
            }
          });
          break;
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
      businessName: ['', [Validators.required]],
      rfc: ['', [Validators.required]],
      address: ['', [Validators.required]],
      officePhone: ['', [Validators.minLength(8), Validators.maxLength(13)]]
    });
    this.getUserInfo();
  }

  public updateProfile(data: any, event?: any): void {
    if (this.profileForm.invalid) {
      return;
    }
    if(!this.signature){
      this._snackBarService.openSnackBar('Por favor, registre su firma','OK', 3000);
      return;
    }
    if(this.newImage){
      this.uploadImage();
    }
    if (this.deleteImage){
      this.newImageProfile = undefined;
      this.deleteImage =false;
      this.updateProfile(data, event);
    }
    if(this.newSignature){
      this.uploadSignature();
    }
      this.saveInfoUserAndConsultancy(data);
  }

  private saveInfoUserAndConsultancy(data: any): void{
    data.code = data.code.replace('+','');
    this.user.name = data.name;
    this.user.lastName = data.lastName;
    this.user.countryCode = data.code;
    this.user.country = this.country;
    this.user.phoneNumber = data.phoneNumber;
    this.user.jobTitle = data.jobTitle;
    if (this.password) {
      this.user.password = this.password;
    }
    this.user.website = (data.website? this.protocol+data.website : '');
    this.consultancy.businessName = data.businessName;
    this.consultancy.rfc = data.rfc;
    this.consultancy.address = data.address;
    this.consultancy.officePhone = (data.officePhone? data.officePhone: '');
    if (this.latLong) {
      this.consultancy.location.latitude = (this.latLong.latitude? this.latLong.latitude: 19.432675);
      this.consultancy.location.longitude = (this.latLong.longitude? this.latLong.longitude:-99.133461);
    }
    if (this.newImageProfile){
      this.user.profileImage = {
        blobName: this.newImageProfile.blob,
        thumbnail: this.newImageProfile.thumbnail
      };
      SessionStorageService.setItem(Constants.UserInSession, {
        profileImage: this.user.profileImage.thumbnail,
        role: this.user.role,
        refId: (this.user.refId? this.user.refId:null)
      });
    }else if(!this.profileImage){
      this.user.profileImage = null;
      SessionStorageService.setItem(Constants.UserInSession, {
        profileImage: null,
        role: this.user.role,
        refId: (this.user.refId? this.user.refId:null)
      });
    }
    if (this.newSig) {
      this.user.signature = {
        blobName: this.newSig.blob,
        thumbnail: this.newSig.thumbnail
      }
    }
    this._api.updatePerson(this.user).subscribe(response=>{
      switch (response.code) {
        case 200:
          this._api.updateConsultancy(this.consultancy).subscribe(response =>{
            switch (response.code) {
              case 200:
                this.change = false;
                LocalStorageService.removeItem('notSign');
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
