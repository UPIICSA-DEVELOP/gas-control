/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/core/services/api/api.service';
import {UpdatePasswordService} from '@app/core/components/update-password/update-password.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {CountryCodeService} from '@app/core/components/country-code/country-code.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {Constants} from '@app/core/constants.core';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {PdfVisorService} from '@app/core/components/pdf-visor/pdf-visor.service';
import {Person, PersonInformation} from '@app/core/interfaces/interfaces';
import {Subscription} from 'rxjs/Rx';

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
export class UserProfileComponent implements OnInit, OnDestroy {
  @ViewChild('phoneNumber') private _phoneNumberInput: ElementRef;
  private _formData: FormData;
  private _formDeleteData: FormData;
  private _formFile: FormData;
  private _formSignature: FormData;
  public user: Person;
  public userInformation: PersonInformation;
  public load: boolean;
  public role: string[];
  public bloodGroup: string[];
  public bloodType: string;
  public userRole: string;
  public profileForm: FormGroup;
  public newImage: boolean;
  public deleteImage: boolean;
  public protocol: string;
  public profileImage: any;
  public newImageProfile: any;
  public country: string;
  public change: boolean;
  public blobName: any;
  public password: string;
  public file: any;
  public newFileSub: any;
  public newFile: boolean;
  public signature: any;
  public newSignature: boolean;
  public newSig: any;
  private _subscriptionLoader: Subscription;
  constructor(
    private _router: Router,
    private _api: ApiService,
    private _apiLoaderService: ApiLoaderService,
    private _updatePassword: UpdatePasswordService,
    private _dialogService: DialogService,
    private _countryCodeService: CountryCodeService,
    private _snackBarService: SnackBarService,
    private _uploadFile: UploadFileService,
    private _formBuilder: FormBuilder,
    private _signaturePad: SignaturePadService,
    private _params: ActivatedRoute,
    private _pdfVisor: PdfVisorService
  ) {
    this.role = Constants.roles;
    this.bloodGroup = Constants.bloodGroup;
    this.change = false;
    this.protocol = 'http://';
    this.newFile = false;
    this.newImage = false;
    this.deleteImage = false;
    this.newSignature = false;
  }

  ngOnInit() {
    this.initUserInfo();
    this.getUser(this._params.snapshot.data.data[0]);
    this.getUserInformation(this._params.snapshot.data.data[1]);
    this._subscriptionLoader = this._apiLoaderService.getProgress().subscribe(load => {this.load = load; });
  }

  ngOnDestroy(): void{
    this._subscriptionLoader.unsubscribe();
  }

  public closeProfile():void{
    if (LocalStorageService.getItem(Constants.NotSignature)){
      this._snackBarService.openSnackBar('Por favor, guarde su firma antes de salir','OK', 3000);
      return;
    }
    if (this.change){
      this.saveChangeBeforeExit();
      return;
    }
    if (!this.signature) {
      this._snackBarService.openSnackBar('Por favor, registre su firma','OK', 3000);
      return;
    }
    this._router.navigate(['/home']).then();
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
          this._router.navigate(['/home']).then();
          break;
      }
    })
  }

  public detectChange(): void{
    this.profileForm.valueChanges.subscribe( value => {
      this.change = true;
    })
  }

  public onLoadImage(event: UploadFileResponse): void{
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

  public onLoadFile(event: UploadFileResponse): void{
    this.newFile = true;
    this.change = true;
    this.file = event.file;
    this._formFile = new FormData();
    this._formFile.append('path', '');
    this._formFile.append('fileName', 'benzene-'+this.user.id+'-'+new Date().getTime()+'.pdf');
    this._formFile.append('file', event.file);
  }

  public changeSignature():void{
    this._signaturePad.open().afterClosed().subscribe(response=>{
      switch (response.code) {
        case 1:
          this.change= true;
          this.newSignature = true;
          this.signature = response.base64;
          this._formSignature = new FormData();
          this._formSignature.append('path', '');
          this._formSignature.append('fileName', 'signature-'+this.user.id+'-'+new Date().getTime()+'.png');
          this._formSignature.append('isImage', 'true');
          this._formSignature.append('file', response.blob);
          break;
      }
    })
  }

  public uploadSignature():void{
    this._uploadFile.upload(this._formSignature).subscribe(response => {
      if (response){
        this.newSig = {
          thumbnail: response.item.thumbnail || '',
          blob: response.item.blobName || ''
        };
        this.newSignature = false;
        if(LocalStorageService.getItem(Constants.NotSignature)){
          this.user.signature = this.newSig;
        }
        this.updateProfile(this.profileForm.value);
      }
    });
  }

  public onRemoveImage(): void {
    this.change = true;
    this.deleteImage = true;
    this.newImage = false;
    this.profileImage=undefined;
    this._formDeleteData = new FormData();
    this._formDeleteData.append('blobName', this.blobName);
  }

  public openListCountry(): void {
    this._countryCodeService.openDialog().afterClosed().subscribe(response => {
      if (response) {
        this.change = true;
        this.country = response.iso;
        this.profileForm.patchValue({
          country: response.name,
          code: response.code
        });
      }
      this._phoneNumberInput.nativeElement.focus();
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
          this.user.password = response.data;
          this.saveUser(true);
          break;
        default:
          break;
      }
    })
  }

  public uploadImage(): void{
    this._uploadFile.upload(this._formData).subscribe(response => {
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
    this._uploadFile.upload(this._formFile).subscribe(response => {
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
      email: ['', [Validators.required, Validators.email]],
      country: ['', [Validators.required]],
      code: ['', []],
      phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
      jobTitle: ['', [Validators.required]],
      website: ['', [Validators.pattern('[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$')]],
      contactPhone:['',[Validators.minLength(8), Validators.maxLength(13)]],
      contactKinship:['',[]],
      contactName:['',[]],
      ssn:['',[]]
    });
    //this.getUser();
  }

  private getUser(response: any): void{
    switch (response.code) {
      case 200:
        this.user = {
          id: response.item.id,
          refId: response.item.refId || undefined,
          name: response.item.name,
          lastName: response.item.lastName,
          email: response.item.email,
          countryCode: response.item.countryCode || '',
          country: (response.item.country?response.item.country:''),
          phoneNumber: response.item.phoneNumber,
          password: response.item.password,
          role: response.item.role,
          jobTitle: response.item.jobTitle,
          profileImage: (response.item.profileImage?{
            blobName: (response.item.profileImage.blobName? response.item.profileImage.blobName : undefined),
            thumbnail: (response.item.profileImage.thumbnail? response.item.profileImage.thumbnail : undefined)
          }:undefined),
          signature: (response.item.signature?{
            blobName: (response.item.signature?response.item.signature.blobName : undefined),
            thumbnail: (response.item.signature?response.item.signature.thumbnail : undefined),
          }:undefined),
          website: response.item.website,
          bCard: (response.item.bCard?response.item.bCard:undefined)
        };
        if (this.user.profileImage){
          this.profileImage = this.user.profileImage.thumbnail;
          this.blobName = this.user.profileImage.blobName;
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
        break;
    }
  }

  private getUserInformation(response: any):void{
    switch (response.code){
      case 200:
        this.userInformation = {
          id: response.item.id,
          ssn: response.item.ssn || undefined,
          bloodType: response.item.bloodType || undefined,
          concatcPhone: response.item.concatcPhone || undefined,
          contactName: response.item.contactName || undefined,
          contactKinship: response.item.contactKinship || undefined,
          benzene:(response.item.benzene?{
            blobName: (response.item.benzene.blobName?response.item.benzene.blobName: undefined),
            thumbnail: (response.item.benzene.thumbnail?response.item.benzene.thumbnail: undefined)
          }: undefined)
        };
        if (this.userInformation.benzene){
          this.file = this.userInformation.benzene.thumbnail
        }
        if(this.userInformation.bloodType){
          for (let bd in this.bloodGroup){
            if (this.bloodGroup[bd] === this.userInformation.bloodType){
              this.bloodType = this.bloodGroup[bd];
              break;
            }else {
              this.bloodType = '';
            }
          }
        }
        this.patchForm();
        break;
      default:
        this.bloodType = '';
        this.userInformation = {
          bloodType:undefined,
          concatcPhone:undefined,
          contactKinship:undefined,
          contactName:undefined,
          ssn:undefined,
          id:this.user.id,
          benzene: undefined
        };
        this.patchForm();
        break;
    }
  }

  private patchForm():void{
    let formCountry: string;
    if (this.user.country) {
      for (let country of Constants.countries){
        if (country.iso === this.user.country){
          this.country = country.iso;
          formCountry=country.name;
        }
      }
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
      contactPhone: this.userInformation.concatcPhone,
      contactKinship: this.userInformation.contactKinship,
      contactName: this.userInformation.contactName,
      ssn: this.userInformation.ssn
    });
    this.detectChange();
    if (LocalStorageService.getItem(Constants.NotSignature)) {
      this._signaturePad.open().afterClosed().subscribe(response=>{
        switch (response.code){
          case 1:
            this.signature = response.base64;
            this._formSignature = new FormData();
            this._formSignature.append('path', '');
            this._formSignature.append('fileName', 'signature-'+this.user.id+'-'+new Date().getTime()+'.png');
            this._formSignature.append('isImage', 'true');
            this._formSignature.append('file', response.blob);
            this.uploadSignature();
            break;
        }
      });
    }
  }

  public updateProfile(data: any):void{
    if (this.profileForm.invalid){
      return;
    }
    if(!this.signature){
      this._snackBarService.openSnackBar('Por favor, registre su firma','OK', 3000);
      return;
    }
    if (this.newImage){
      this.uploadImage();
      return;
    }
    if(this.deleteImage){
      this.newImageProfile = undefined;
      this.deleteImage=false;
      this.updateProfile(data);
    }
    if (this.newFile){
      this.uploadFile();
      return;
    }
    if(this.newSignature){
      this.uploadSignature();
      return;
    }
    this.saveProfileInformation(data);
  }

  private saveProfileInformation(data: any): void{
    const emailUpdate = this.user.email !== data.email;
    data.code = data.code.replace('+','');
    this.user.name = data.name;
    this.user.lastName = data.lastName;
    this.user.email = data.email;
    this.user.countryCode = data.code;
    this.user.country = this.country;
    this.user.phoneNumber = data.phoneNumber;
    this.user.jobTitle = data.jobTitle;
    this.userInformation.ssn = data.ssn;
    this.userInformation.bloodType = this.bloodType;
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
      LocalStorageService.setItem(Constants.UserInSession, {
        completeName: this.user.name+' '+this.user.lastName,
        profileImage: this.user.profileImage.thumbnail,
        role: this.user.role,
        refId: (this.user.refId? this.user.refId:null)
      });
    }else if(!this.profileImage){
      this.user.profileImage = null;
      LocalStorageService.setItem(Constants.UserInSession, {
        completeName: this.user.name+' '+this.user.lastName,
        profileImage: null,
        role: this.user.role,
        refId: (this.user.refId? this.user.refId:null)
      });
    }
    if (this.newFileSub) {
      this.userInformation.benzene = {
        thumbnail: this.newFileSub.thumbnail,
        blobName: this.newFileSub.blob
      }
    }
    if (this.newSig) {
      this.user.signature = {
        blobName: this.newSig.blob,
        thumbnail: this.newSig.thumbnail
      }
    }
    this.updateBusiness(emailUpdate);
  }


  private updateBusiness(isNewEmail: boolean):void{
    this._snackBarService.openSnackBar('Espere un momento...','',0);
    const data = {
      name: this.user.name || '',
      lastName: this.user.lastName  || '',
      company: (this.user.role===4 ? '':LocalStorageService.getItem(Constants.StationInDashboard).name) || '',
      phone: this.user.phoneNumber || '',
      workPosition: this.user.jobTitle || '',
      email: this.user.email || '',
      countryCode : this.user.countryCode || '',
      industryCode: '1',
      website: this.user.website || '',
      profileImage: this.user.profileImage ? this.user.profileImage.blobName : null,
      profileImageThumbnail: this.user.profileImage ? this.user.profileImage.thumbnail + '=s1200': null
    };
    this._api.businessCardService(data).subscribe(response => {
      switch (response.code){
        case 200:
          this._snackBarService.closeSnackBar();
          this.user.bCard = response.item;
          if (isNewEmail){
            this.updateProfileDataWithNewEmail()
          }else{
            this.saveUser();
          }
          break;
        default:
          this._snackBarService.closeSnackBar();
          this._snackBarService.openSnackBar('Ha ocurrido un error, por favor, intente de nuevo', 'OK', 3000);
          break;
      }
    });
  };

  private saveUser(redirect?:boolean):void{
    this._api.updatePerson(this.user).subscribe(response=>{
      switch (response.code){
        case 200:
          if(!redirect){
            this.saveInformation();
          }else{
            this._snackBarService.openSnackBar('Contraseña Actualizada','OK',3000);
          }
          break;
        default:
          this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
          break;
      }
    })
  }

  private updateProfileDataWithNewEmail():void{
    this._api.updatePersonWithDifferentEmail(this.user).subscribe(response=>{
      switch (response.code){
        case 200:
          this.saveInformation();
          break;
        default:
          this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
          break;
      }
    });
  }

  private saveInformation():void{
    this._api.savePersonInformation(this.userInformation).subscribe(response=>{
      switch (response.code){
        case 200:
          this.change = false;
          LocalStorageService.removeItem(Constants.NotSignature);
          this._snackBarService.openSnackBar('Información actualizada','OK',3000);
          this._router.navigate(['/home']).then();
          break;
        default:
          this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
          break;
      }
    })
  }

  public openStudy():void{
    this._pdfVisor.open({url: this.file, file: this.file, notIsUrl: this.newFile});
  }

  public validateEmailExist():void{
    let email: any = {
      email: this.profileForm.controls['email'].value
    };
    this._api.personExists(email).subscribe(response=>{
      switch (response.code){
        case 200:
          if(this.user.email !== email.email){
            this._dialogService.alertDialog('Información',
              'El Email que está tratando de usar ya ha sido asociado a un usuario',
              'ACEPTAR');
            this.profileForm.controls['email'].setErrors({emailUsed: true});
          }
          break;
        default:
          break;
      }
    });
  }
}
