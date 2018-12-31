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
  public profileForm: FormGroup;
  public hide: boolean;
  public protocol: any = 'http';
  constructor(
    private _api: ApiService,
    private _formBuilder: FormBuilder,
    private _apiLoaderService: ApiLoaderService,
    private _snackBarService: SnackBarService,
    private _countryCode: CountryCodeService
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

  public openListCountry(): void {
    this._countryCode.openDialog().afterClosed().subscribe(response => {
      this.profileForm.patchValue({
        country: response.name,
        code: response.code
      });
    });
  }

  public updateProfile(data: any): void {
    this.user.name = data.name;
    this.user.lastName = data.lastName;
    this.user.country = data.country;
    this.user.phoneNumber = data.phoneNumber;
    this.user.jobTitle = data.jobTitle;
    this.user.password = data.password;
    this.user.website = this.protocol + data.website;
    this.consultancy.businessName = data.businessName;
    this.consultancy.rfc = data.rfc;
    this.consultancy.address = data.address;
    this.consultancy.officePhone = data. officePhone;

    this._api.updatePerson(this.user);
    this._api.getConsultancy(this.consultancy);
  }

  private getUserInfo(): void {
    this._api.getPerson(CookieService.getCookie(Constants.IdSession)).subscribe(response => {
      switch (response.code) {
        case 200:
          this.user = response.item;
          this._api.getConsultancy(this.user.refId).subscribe(response => {
            switch (response.code) {
              case 200:
                this.consultancy = response.item;
                this.profileForm.reset({
                  name: this.user.name,
                  lastName: this.user.lastName,
                  email: this.user.email,
                  country: this.user.country,
                  phoneNumber: this.user.phoneNumber,
                  role: this.user.role,
                  jobTitle: this.user.jobTitle,
                  website: this.user.website,
                  businessName: this.consultancy.businessName,
                  rfc: this.consultancy.rfc,
                  address: this.consultancy.address,
                  officePhone: this.consultancy.officePhone
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
      role: [{value: 0, disabled: true}, [Validators.required]],
      code: ['', []],
      phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
      jobTitle: ['', [Validators.required]],
      website: ['', []],
      businessName: ['', [Validators.required]],
      rfc: ['', [Validators.required]],
      address: ['', [Validators.required]],
      officePhone: ['', [Validators.minLength(8), Validators.maxLength(13)]]
    });
  }

}
