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
  @ViewChild('seePassword') private _see_pass: ElementRef;
  public user: any;
  public consultancy: any;
  public load: boolean;
  public role: any[] = [
    {value: 1, name: 'Director'},
    {value: 2, name: 'Gerente'},
    {value: 3, name: 'Asistente'},
    {value: 4, name: 'Dueño de estación'},
    {value: 5, name: 'Encargado de estación'},
    {value: 6, name: 'Gerente de estación'},
    {value: 7, name: 'Asistente de estación'}];
  public userRole: number;
  public profileForm: FormGroup;
  public hide: boolean = false;
  public protocol: string = 'http://';
  public profileImage: any;
  public country: any;

  constructor(
    private _api: ApiService,
    private _formBuilder: FormBuilder,
    private _apiLoaderService: ApiLoaderService,
    private _dialogService: DialogService,
    private _snackBarService: SnackBarService
  ) {
  }

  ngOnInit() {
    this.getUserInfo();
    this.initUserInfo();
    this._apiLoaderService.getProgress().subscribe(load => {this.load = load; });
  }

  public showPassword(): void {
    this.hide = !this.hide;
    this._see_pass.nativeElement.type = (this.hide) ? 'text' : 'password';
  }

  private getUserInfo(): void {
    this._api.getPerson(CookieService.getCookie(Constants.IdSession)).subscribe(response => {
      switch (response.code) {
        case 200:
          this.user = response.item;
          for (let country of Constants.countries){
            if (country.code === this.user.countryCode){
              this.country=country.name;
            }
          }
          let url=this.user.website;
          if (url.includes('http://')){
            url=url.replace('http://','');
            this.protocol = 'http://';
          }else if(url.includes('https://')) {
            url=url.replace('https://','');
            this.protocol = 'https://';
          }
          this.user.website=url;
          this.userRole = this.user.role;
          this._api.getConsultancy(this.user.refId).subscribe(response => {
            switch (response.code) {
              case 200:
                this.consultancy = response.item;
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
      website: ['', []],
      businessName: ['', [Validators.required]],
      rfc: ['', [Validators.required]],
      address: ['', [Validators.required]],
      officePhone: ['', [Validators.minLength(8), Validators.maxLength(13)]]
    });
  }

  private openListCountry(): void {
    this._dialogService.dialogList('').afterClosed().subscribe(response => {
      switch (response.code) {
        case 1:
          this.profileForm.patchValue({
            country: response.data.name,
            code: response.data.code
          });
          break;
      }
    });
  }

  private updateProfile(data: any): void {
    if (this.profileForm.invalid) {
      return;
    }
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

    this._api.updatePerson(this.user).subscribe(response=>{
      switch (response.code) {
        case 200:
          this._api.updateConsultancy(this.consultancy).subscribe(response =>{
            switch (response.code) {
              case 200:
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
