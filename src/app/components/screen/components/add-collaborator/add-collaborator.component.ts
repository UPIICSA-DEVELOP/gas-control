/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {ApiService} from '@app/core/services/api/api.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {CountryCodeService} from '@app/core/components/country-code/country-code.service';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {Constants} from '@app/core/constants.core';
import {User} from 'firebase';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';

export interface Person {
  name: string;
  lastName: string
  email: string;
  country: string;
  countryCode: string;
  phoneNumber: string;
  role: number;
  jobTitle: string;
  website?: string;
  refId: string;
  signature?:any;
  profileImage?: any;
}

export interface PersonInformation {
  id: string;
  bloodType?:string;
  concatcPhone?:string;
  contactKinship?:string;
  contactName?:string;
  ssn?: string;
  benzene?: any;
}

@Component({
  selector: 'app-add-collaborator',
  templateUrl: './add-collaborator.component.html',
  styleUrls: ['./add-collaborator.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ right: '-100%' }),
        animate('.40s ease-out', style({ right: '0'  }))
      ]),
      transition(':leave', [
        style({ right: '0'}),
        animate('.40s ease-in', style({ right: '-100%' }))
      ])
    ])
  ],
  host: {'[@fadeInAnimation]': ''}
})
export class AddCollaboratorComponent implements OnInit {
  @ViewChild('phoneNumber') private _phoneNumberInput: ElementRef;
  public signature: any;
  public profileImage: any;
  public file: any;
  public blobSignature: string;
  public protocol: string;
  public newPerson: FormGroup;
  public blobImageProfile: string;
  public addImage: boolean;
  public addSign: boolean;
  public user: any;
  public id: string;
  public country: string;
  public load: boolean;
  public bloodGroup: string[];
  public roleType: string[];
  public newFile: boolean;
  public bloodType: string;
  private _formImage:FormData;
  private _formSignature: FormData;
  private _formFile: FormData;
  private _refId: string;
  public changes: boolean;
  constructor(
    private _api:ApiService,
    private _apiLoader: ApiLoaderService,
    private _dialogService: DialogService,
    private _countryCodeService: CountryCodeService,
    private _uploadFileService: UploadFileService,
    private _signatureService: SignaturePadService,
    private _snackBarService: SnackBarService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {
    this.changes=false;
    this.roleType = Constants.roles;
    this.bloodGroup = Constants.bloodGroup;
    this.addImage = false;
    this.addSign = false;
    this.newFile = false;
    this.protocol = 'http://';
    this._refId = SessionStorageService.getItem('refId');
  }

  ngOnInit() {
    this.user= LocalStorageService.getItem(Constants.UserInSession);
    this._apiLoader.getProgress().subscribe(load => {this.load = load; });
    this.initForm();
  }

  public close():void{
    if (this.changes){
      this._dialogService.confirmDialog('¿Desea salir sin guardar cambios?',
        '',
        'ACEPTAR',
        'CANCELAR').afterClosed().subscribe(response=>{
        switch (response.code) {
          case 1:
            SessionStorageService.removeItem('refId');
            this._router.navigate(['/home']);
            break;
        }
      });
    }else{
      this._router.navigate(['/home']);
    }
  }

  public onLoadImage(event: UploadFileResponse):void{
    this.changes=true;
    this.blobImageProfile = event.url;
    this.addImage = true;
    this._formImage = new FormData();
    this._formImage.append('path','');
    this._formImage.append('filename','profileImage-'+this.user.refId+'-'+new Date().getTime()+'.png');
    this._formImage.append('isImage', 'true');
    this._formImage.append('file', event.blob);
  }

  public  onRemoveImage(): void{
    this.changes=true;
    this.blobImageProfile = '';
    this.addImage = false;
  }

  public selectCountryCode():void{
    this._countryCodeService.openDialog().afterClosed().subscribe(response=>{
      if (response) {
        this.changes=true;
        this.country = response.iso;
        this.newPerson.patchValue({
          country: response.name,
          code: response.code
        });
        this._phoneNumberInput.nativeElement.focus();
      }
    });
  }

  public onLoadFile(event: UploadFileResponse): void{
    this.changes=true;
    this.newFile = true;
    this.file = event.file;
    this._formFile = new FormData();
    this._formFile.append('path', '');
    this._formFile.append('fileName', 'benzene-'+this.user.refId+'-'+new Date().getTime()+'.pdf');
    this._formFile.append('file', event.file);
  }

  public addSignature(): void{
    this._signatureService.open().afterClosed().subscribe(response=>{
      switch (response.code) {
        case 1:
          this.changes=true;
          this.blobSignature = response.base64;
          this.addSign = true;
          this._formSignature = new FormData();
          this._formSignature.append('path', '');
          this._formSignature.append('fileName', 'signature-'+this.user.refId+'-'+new Date().getTime()+'.png');
          this._formSignature.append('isImage', 'true');
          this._formSignature.append('file', response.blob);
          break;
      }
    })
  }

  public uploadGenericFile(type:number): void{
    let form: FormData;
    switch (type){
      case 1:
        form = this._formImage;
        this.addImage = false;
        break;
      case 2:
        form = this._formSignature;
        this.addSign = false;
        break;
      case 3:
        form = this._formFile;
        this.newFile = false;
        break;
    }
    this._uploadFileService.upload(form).subscribe(response=>{
      if(response){
        switch (type){
          case 1:
            this.profileImage = {
              blobName: response.item.blobName || '',
              thumbnail: response.item.thumbnail || ''
            };
            break;
          case 2:
            this.signature = {
              blobName: response.item.blobName || '',
              thumbnail: response.item.thumbnail || ''
            };
            break;
          case 3:
            this.file = {
              blobName: response.item.blobName || '',
              thumbnail: response.item.thumbnail || ''
            };
            break;
        }
        this.validateForm(this.newPerson.value);
      }
    });
  }

  public validateForm(data: any):void{
    if (this.newPerson.invalid){
      return;
    }
    if (this.newFile){
      this.uploadGenericFile(3);
      return;
    }
    if (this.addImage){
      this.uploadGenericFile(1);
      return;
    }
    if (this.addSign){
      this.uploadGenericFile(2);
      return;
    }
    this.createCollaborator(data)
  }

  private initForm():void{
    this.newPerson = this._formBuilder.group({
      name:['',[Validators.required]],
      lastName:['',[Validators.required]],
      email:['',[Validators.required, Validators.email]],
      country:['México',[Validators.required]],
      code:['+52',[]],
      phoneNumber:['',[Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
      jobTitle:['',[Validators.required]],
      website:['',[Validators.pattern('[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$')]],
      ssn:['',[]],
      contactName:['',[]],
      contactPhoneNumber:['',[Validators.minLength(8), Validators.maxLength(13)]],
      contactKinship:['',[]]
    });
    this.country = 'MX';
    this.detectChange();
  }

  private detectChange(): void{
    this.newPerson.valueChanges.subscribe( value => {
      this.changes = true;
    })
  }

  private createCollaborator(data:any):void{
    data.code = data.code.replace('+','');
    let person: Person ={
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      refId: this._refId,
      country: this.country,
      countryCode: data.code,
      role: 6,
      website: (data.website?this.protocol + data.website:undefined),
      jobTitle: data.jobTitle,
      phoneNumber: data.phoneNumber,
      profileImage:(this.profileImage?this.profileImage:undefined),
      signature:(this.signature?this.signature:undefined)
    };
    let personInformation: PersonInformation = {
      id: '',
      benzene: (this.file?this.file:undefined),
      bloodType: (data.bloodType? data.bloodType:undefined),
      ssn: (data.ssn? data.ssn:undefined),
      contactName: (data.contactName? data.contactName:undefined),
      concatcPhone:(data.contactPhoneNumber? data.contactPhoneNumber:undefined),
      contactKinship: (data.contactKinship?data.contactKinship:undefined)
    };
    this._api.createReferencedPerson(person).subscribe(response=>{
        switch (response.code){
          case 200:
              personInformation.id=response.item.id;
              this.createInformationCollaborator(personInformation);
             break;
          default:
            this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
            break;
        }
    })
  }

  private createInformationCollaborator(personInfo: PersonInformation): void{
    this._api.savePersonInformation(personInfo).subscribe(response=>{
      switch (response.code){
        case 200:
          SessionStorageService.removeItem('refId');
          LocalStorageService.setItem('newCollaborator', true);
          this._router.navigate(['/home']);
          break;
        default:
          this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
          break;
      }
    });
  }

  public validateEmailExist():void{
    let verify={
      email: this.newPerson.controls['email'].value,
      password: '',
      token: '123'
    };
    this._api.signIn(verify).subscribe(response=>{
      switch (response.code){
        case 472:
          this._dialogService.alertDialog('Información',
            'El Email que está tratando de usar ya ha sido asociado a un usuario',
            'ACEPTAR');
          this.newPerson.controls['email'].setErrors({emailUsed: true});
          break;
        default:
          break;
      }
    })
  }
}
