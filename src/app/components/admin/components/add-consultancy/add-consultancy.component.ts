/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constants} from 'app/core/constants.core';
import {SignaturePadService} from 'app/core/components/signature-pad/signature-pad.service';
import {LocationService} from 'app/core/components/location/location.service';
import {CountryCodeService} from 'app/core/components/country-code/country-code.service';
import {MatDialogRef, MatStepper} from '@angular/material';
import {SnackBarService} from 'app/core/services/snackbar/snackbar.service';
import {ApiService} from 'app/core/services/api/api.service';
import {UploadFileResponse} from 'app/core/components/upload-file/upload-file.component';
import {UploadFileService} from 'app/core/components/upload-file/upload-file.service';
import {ApiLoaderService} from 'app/core/services/api/api-loader.service';
import {Consultancy, Person} from '@app/core/interfaces/interfaces';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-add-consultancy',
  templateUrl: './add-consultancy.component.html',
  styleUrls: ['./add-consultancy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddConsultancyComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: true }) private _stepper: MatStepper;
  @ViewChild('phoneNumber', { static: false }) private _phoneNumberInput: ElementRef;
  public load: boolean;
  public roles: any[];
  public protocols: any[];
  public ownerForm: FormGroup;
  public consultancyForm: FormGroup;
  public signature: any;
  public userImage: any;
  public showOwnerForm: boolean;
  public showConsultancyForm: boolean;
  public doneStep: boolean;
  public progress: boolean;
  public country: string;
  private _location: any;
  private _ownerInfo: Person;
  private _consultancyInfo: Consultancy;
  private _subscriptionLoader: Subscription;
  constructor(
    private _dialog: MatDialogRef<AddConsultancyComponent>,
    private _formBuilder: FormBuilder,
    private _apiLoader: ApiLoaderService,
    private _signatureService: SignaturePadService,
    private _locationService: LocationService,
    private _snackBar: SnackBarService,
    private _countryCode: CountryCodeService,
    private _uploadFile: UploadFileService,
    private _api: ApiService
  ) {
    this.progress = false;
    this.signature = {
      path: null,
      blob: null,
      original: null
    };
    this.userImage = {
      base64: null,
      blob: null,
      original: null
    };
    this._location = {
      address: null,
      location: null
    };
    this.roles = Constants.roles2;
    this.protocols = Constants.protocols;
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {this.load = load});
    this.showOwnerForm = true;
    this.country = 'MX';
    this.ownerForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      country:  ['México', [Validators.required]],
      countryCode:  ['52', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(13),Validators.minLength(8)]],
      rol: [{value: 1, disabled: true}, [Validators.required]],
      jobTitle: ['', [Validators.required]],
      protocol: ['http://',[]],
      website: ['', [Validators.pattern(Constants.REGEX_WEBSITE)]]
    });
  }

  ngOnDestroy(): void{
    this._subscriptionLoader.unsubscribe();
  }

  public onSelectionChange(ev: any): void{
    switch (ev.selectedIndex){
      case 0:
        this.doneStep = false;
        this.showOwnerForm = true;
        this.showConsultancyForm = false;
        this.ownerForm.enable();
        break;
      case 1:
        this.doneStep = false;
        this.showOwnerForm = false;
        this.showConsultancyForm = true;
        this.initFormConsultancy(false);
        break;
      case 2:
        this.showOwnerForm = true;
        this.showConsultancyForm = true;
        this.ownerForm.disable();
        this.consultancyForm.disable();
        this.doneStep = true;
        break;
    }
  }

  public onLoadImage(ev: UploadFileResponse): void{
    this.userImage.blob = ev.blob;
    this.userImage.base64 = ev.url;
  }

  public onRemoveImage(): void{
    this.userImage.blob = null;
    this.userImage.base64 = null;
  }

  public addInfOwner(data: any): void{
    if(this.ownerForm.invalid){
      return;
    }
    this._ownerInfo = {
      refId: null,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      countryCode: data.countryCode.replace('+', ''),
      country: this.country,
      role: 1,
      jobTitle: data.jobTitle,
      website: (data.website?data.protocol+data.website:undefined),
      signature: null
    };
    this.initFormConsultancy(true);
  }

  public addInfoConsultancy(data: any): void{
    if(this.consultancyForm.invalid){
      return;
    }
    this._consultancyInfo = {
      businessName: data.company,
      rfc: data.rfc,
      address: this._location.address,
      location: this._location.location,
      officePhone: data.consultancyNumber,
      group: data.group
    };
    this._stepper.next();
  }

  public done(): void{
    this.progress = true;
    this._snackBar.openSnackBar('Espere un momento...','',0);
    this.createConsultancy();
  }

  public addSignature(): void{
    this._signatureService.open().afterClosed().subscribe((response) => {
      switch (response.code){
        case 1:
          this.signature.path = response.base64;
          this.signature.blob = response.blob;
          break;
      }
    });
  }

  public addLocation(): void{
    this._locationService.open().afterClosed().subscribe(response => {
      switch (response.code){
        case 1:
          this._location.address = response.location.address;
          this._location.location = {
            latitude: response.location.lat,
            longitude: response.location.lng
          };
          this.consultancyForm.patchValue({address: response.location.address});
          break;
      }
    })
  }

  public addCountry(): void{
    this._countryCode.openDialog().afterClosed().subscribe(response => {
      if(response){
        this.country = response.iso;
        this.ownerForm.patchValue({country: response.name, countryCode: response.code});
        this._phoneNumberInput.nativeElement.focus();
      }
    });
  }

  private initFormConsultancy(next: boolean): void{
    if(!this.consultancyForm){
      this.consultancyForm = this._formBuilder.group({
        company: ['', [Validators.required]],
        rfc: ['', [Validators.required]],
        address: ['', [Validators.required]],
        consultancyNumber: ['',[Validators.minLength(8), Validators.maxLength(13), Validators.required]],
        group: [false, [Validators.required]]
      });
    }else{
      this.consultancyForm.enable();
    }
    if(next){
      this._stepper.next();
    }
  }

  private createConsultancy(): void{
    this._api.createConsultancy(this._consultancyInfo).subscribe(response => {
      switch (response.code){
        case 200:
          this._consultancyInfo = response.item;
          this.createPerson(this._consultancyInfo.id);
          break;
        case 470:
          this.progress = false;
          this._snackBar.openSnackBar('Ya existe una consultora registrada con esta información','OK',3000);
          break;
        default:
          this.onErrorOccurred();
          break;
      }
    }, error => {
      console.error(error);
      this.onErrorOccurred();
    });

  }

  private createPerson(refId: any): void{
    this._ownerInfo.refId = refId;
    this._api.createReferencedPerson(this._ownerInfo).subscribe(response => {
      switch (response.code){
        case 200:
          this._ownerInfo = response.item;
          this.validateProfileImage();
          break;
        default:
          this.onErrorOccurred();
          break;
      }
    }, error => {
      console.error(error);
      this.onErrorOccurred();
    });
  }

  private updatePerson(person: any): void{
    this._api.updatePerson(person).subscribe(response => {
      switch (response.code){
        case 200:
          this._snackBar.closeSnackBar();
         this.exit(true, 200);
          break;
        default:
          this.onErrorOccurred();
          break;
      }
    }, error => {
      console.error(error);
      this.onErrorOccurred();
    });
  }

  private validateProfileImage(): void{
    if(this.userImage.blob){
      const form = new FormData();
      form.append('path', this._consultancyInfo.rfc);
      form.append('fileName', 'profileImage-'+this._consultancyInfo.id+'-'+new Date().getTime()+'.png');
      form.append('isImage', 'true');
      form.append('file', this.userImage.blob);
      this._uploadFile.upload(form).subscribe(response => {
        switch (response.code){
          case 200:
            this.userImage.original = response.item;
            this.makeBusinessCard();
            break;
          default:
            this.onErrorOccurred();
            break;
        }
      }, error => {
        console.error(error);
        this.onErrorOccurred();
      });
    }else{
      this.makeBusinessCard();
    }
  }

  private validateSignature(): void{
    if(this.signature.blob){
      const form = new FormData();
      form.append('path', this._consultancyInfo.rfc);
      form.append('fileName', 'signature-'+this._consultancyInfo.id+'-'+new Date().getTime()+'.png');
      form.append('isImage', 'true');
      form.append('file', this.signature.blob);
      this._uploadFile.upload(form).subscribe(response => {
        switch (response.code){
          case 200:
            this.signature.original = response.item;
            this.finishCreateConsultancy();
            break;
          default:
            this.onErrorOccurred();
            break;
        }
      });
    }else{
      this.finishCreateConsultancy();
    }
  }

  private uploadBusinessCard(bCard: any): void{
    this._ownerInfo.bCard = bCard;
    this.validateSignature();
  }

  private finishCreateConsultancy(): void{
    if(this.userImage.original){
      this._ownerInfo.profileImage = this.userImage.original;
    }
    if(this.signature.original){
      this._ownerInfo.signature = this.signature.original;
    }
    this.updatePerson(this._ownerInfo);
  }

  public exit(snack: boolean, code: number): void{
    if(snack){
      this._snackBar.openSnackBar('Consultora creada con éxito', 'OK', 3000);
    }
    this._dialog.close({code: code});
  }

  private onErrorOccurred(): void{
    this._snackBar.openSnackBar('Ha ocurrido un error, por favor, intente de nuevo', 'OK', 3000);
  }

  public makeBusinessCard(): void{
    const data = {
      name: this._ownerInfo.name || '',
      lastName: this._ownerInfo.lastName  || '',
      company: this._consultancyInfo.businessName || '',
      phone: this._ownerInfo.phoneNumber || '',
      workPosition: this._ownerInfo.jobTitle || '',
      email: this._ownerInfo.email || '',
      countryCode : this._ownerInfo.countryCode || '',
      industryCode: '1',
      website: this._ownerInfo.website || '',
      profileImage: this._ownerInfo.profileImage ? this._ownerInfo.profileImage.blobName : null,
      profileImageThumbnail: this._ownerInfo.profileImage ? this._ownerInfo.profileImage.thumbnail + '=s1200': null
    };
    this._api.businessCardService(data).subscribe(response => {
      switch (response.code){
        case 200:
          this.uploadBusinessCard(response.item);
          break;
        default:
          this.progress = false;
          this.onErrorOccurred();
          break;
      }
    });
  }

  public validateEmailExist():void{
    const option = {
      email: this.ownerForm.controls['email'].value
    };
    this._api.personExists(option).subscribe(response=>{
      switch (response.code){
        case 200:
          this.ownerForm.controls['email'].setErrors({emailUsed: true});
          break;
      }
    })
  }
}
