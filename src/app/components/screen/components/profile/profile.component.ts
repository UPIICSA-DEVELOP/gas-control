/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {Constants} from '@app/core/constants.core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {CountryCodeService} from '@app/core/components/country-code/country-code.service';
import {LocationService} from '@app/core/components/location/location.service';
import {UploadImageService} from '@app/core/components/upload-file/upload-image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private _formData: FormData;
  public user: any;
  public consultancy: any;
  public latLong: any;
  public load: boolean;
  public role: any[] = [
    {value: 1, name: 'Director'},
    {value: 2, name: 'Gerente'},
    {value: 3, name: 'Asistente'},
    {value: 4, name: 'Representante legal'},
    {value: 5, name: 'Encargado de estación'},
    {value: 6, name: 'Gerente de estación'},
    {value: 7, name: 'Asistente de estación'}];
  public userRole: number;
  public profileForm: FormGroup;
  public hide: boolean = false;
  public newImage: boolean = false;
  public protocol: string = 'http://';
  public profileImage: any;
  public newImageProfile: any;
  public country: any;
  public change: boolean = false;

  constructor(
    private _api: ApiService,
    private _formBuilder: FormBuilder,
    private _apiLoaderService: ApiLoaderService,
    private _snackBarService: SnackBarService,
    private _countryCode: CountryCodeService,
    private _locationService: LocationService,
    private _dialogService: DialogService,
    private _uploadImage: UploadImageService
  ) {
    this._formData = new FormData();
  }

  ngOnInit() {
    this.initUserInfo();

    this._apiLoaderService.getProgress().subscribe(load => {this.load = load; });
  }

  ngOnDestroy(): void {
    this.saveChangeBeforeExit();
  }

  public onLoadImage(event): void{
    this.newImage = true;
    this.profileImage = event.url;
    this._formData.append('path', this.consultancy.rfc);
    this._formData.append('fileName', 'profile-'+this.user.id+'-'+new Date().toISOString()+'.png');
    this._formData.append('isImage', 'true');
    this._formData.append('file', event.blob);
  }

  public changePassword(){
    this._dialogService.alertWithDoubleInput('Actualice su contraseña',
      '',
      'Nueva contraseña',
      'Confirmar nueva contraseña',
      'ACEPTAR',
      '',
      '').afterClosed().subscribe(response =>{
        switch (response.code) {
          case 1:
            this.profileForm.patchValue({
              password: response.data.password
            });
            break;
        }
    })
  }

  public detectChange(): void{
    this.change = true;
  }

  public openListCountry(): void {
    this._countryCode.openDialog().afterClosed().subscribe(response => {
      this.profileForm.patchValue({
        country: response.name,
        code: response.code
      });
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
    this._uploadImage.uploadImage(this._formData).subscribe(response => {
      if (response){
        this.newImageProfile = {
          thumbnail: response.item.thumbnail,
          blob: response.item.blobName
        };
        this.saveInfoUserAndConsultancy(this.profileForm.value);
      }
    });
  }

  private saveChangeBeforeExit(): void{
    if (this.change){
      this._dialogService.confirmDialog(
        '¿Desea salir sin guardar cambios?',
        '',
        'ACEPTAR',
        'CANCELAR'
      ).afterClosed().subscribe(response=>{
        switch (response.code) {
          case 1:
            this.updateProfile(this.profileForm.value, null);
            break;
        }
      })
    }
  }

  private getUserInfo(): void {
    this._api.getPerson(CookieService.getCookie(Constants.IdSession)).subscribe(response => {
      switch (response.code) {
        case 200:
          this.user = response.item;
          if (this.user.profileImage){
            this.profileImage = this.user.profileImage.thumbnail;
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
          this.userRole = this.user.role;
          this._api.getConsultancy(this.user.refId).subscribe(response => {
            switch (response.code) {
              case 200:
                this.consultancy = response.item;
                this.latLong = {
                  latitude: this.consultancy.location.latitude,
                  longitude: this.consultancy.location.longitude
                };
                this.profileForm.patchValue({
                  name: this.user.name,
                  lastName: this.user.lastName,
                  email: this.user.email,
                  country: this.country,
                  code: this.user.countryCode,
                  phoneNumber: this.user.phoneNumber,
                  jobTitle: this.user.jobTitle,
                  website: this.user.website,
                  businessName: this.consultancy.businessName,
                  rfc: this.consultancy.rfc,
                  address: this.consultancy.address,
                  officePhone: this.consultancy.officePhone,
                  password: this.user.password
                });
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
      password:['',[]],
      website: ['', [Validators.pattern('[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$')]],
      businessName: ['', [Validators.required]],
      rfc: ['', [Validators.required]],
      address: ['', [Validators.required]],
      officePhone: ['', [Validators.minLength(8), Validators.maxLength(13)]]
    });
    this.getUserInfo();
  }

  private updateProfile(data: any, event: any): void {
    if (this.profileForm.invalid) {
      return;
    }
    if(this.newImage){
      this.uploadImage();
    }else{
      this.saveInfoUserAndConsultancy(data);
    }

  }

  private saveInfoUserAndConsultancy(data: any): void{
    data.code = data.code.replace('+','');
    this.user.name = data.name;
    this.user.lastName = data.lastName;
    this.user.countryCode = data.code;
    this.user.phoneNumber = data.phoneNumber;
    this.user.jobTitle = data.jobTitle;
    this.user.password = data.password;
    this.user.website = (data.website? this.protocol+data.website : '');
    this.consultancy.businessName = data.businessName;
    this.consultancy.rfc = data.rfc;
    this.consultancy.address = data.address;
    this.consultancy.officePhone = (data.officePhone? data.officePhone: '');
    this.consultancy.location.latitude = this.latLong.latitude;
    this.consultancy.location.longitude = this.latLong.longitude;
    if (this.newImage){
      this.user.profileImage = {
        blobName: this.newImageProfile.blob,
        thumbnail: this.newImageProfile.thumbnail
      }
    }
    this._api.updatePerson(this.user).subscribe(response=>{
      switch (response.code) {
        case 200:
          this._api.updateConsultancy(this.consultancy).subscribe(response =>{
            switch (response.code) {
              case 200:
                this.change = false;
                this._snackBarService.openSnackBar('Información actualizada','OK',3000);
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
