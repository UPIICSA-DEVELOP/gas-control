/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {ApiService} from '@app/core/services/api/api.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {SharedService} from '@app/core/services/shared/shared.service';
import {SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constants} from 'app/utils/constants/constants.utils';
import {Subscription} from 'rxjs';
import {DialogService} from '@app/shared/components/dialog/dialog.service';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {CountryCodeService} from '@app/shared/components/country-code/country-code.service';
import {UploadFileService} from '@app/shared/components/upload-file/upload-file.service';
import {SignaturePadService} from '@app/shared/components/signature-pad/signature-pad.service';
import {PdfVisorService} from '@app/shared/components/pdf-visor/pdf-visor.service';
import {UploadFileResponse} from '@app/shared/components/upload-file/upload-file.component';
import {Person} from '@app/utils/interfaces/person';
import {PersonInformation} from '@app/utils/interfaces/person-information';

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
  host: {'[@fadeInAnimation]': ''},
  encapsulation: ViewEncapsulation.None
})
export class AddCollaboratorComponent implements OnInit, OnDestroy {
  @ViewChild('phoneNumber', { static: true }) private _phoneNumberInput: ElementRef;
  public signature: any;
  public profileImage: any;
  public file: any;
  public blobSignature: string;
  public protocol: string;
  public newPerson: FormGroup;
  public blobImageProfile: string;
  public addImage: boolean;
  public addSign: boolean;
  public user: Person;
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
  private _subscriptionLoader: Subscription;
  constructor(
    private _api:ApiService,
    private _apiLoader: LoaderService,
    private _dialogService: DialogService,
    private _countryCodeService: CountryCodeService,
    private _uploadFileService: UploadFileService,
    private _signatureService: SignaturePadService,
    private _snackBarService: SnackBarService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _pdfVisor: PdfVisorService,
    private _sharedService: SharedService,
    private _activateRoute: ActivatedRoute
  ) {
    this.changes=false;
    this.roleType = Constants.roles;
    this.bloodGroup = Constants.bloodGroup;
    this.addImage = false;
    this.addSign = false;
    this.newFile = false;
    this.protocol = 'http://';
  }

  ngOnInit() {
    if (this._activateRoute.snapshot.queryParams.stationId) {
      this._refId = this._activateRoute.snapshot.queryParams.stationId;
    }
    this.user= LocalStorageService.getItem(Constants.UserInSession);
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {this.load = load; });
    this.initForm();
  }

  ngOnDestroy(): void{
    this._subscriptionLoader.unsubscribe();
  }

  public close():void{
    if (this.changes){
      this._dialogService.confirmDialog('¿Desea salir sin guardar cambios?',
        '',
        'ACEPTAR',
        'CANCELAR').afterClosed().subscribe(response=>{
        switch (response.code) {
          case 1:
            this._router.navigate(['/home']).then();
            break;
        }
      });
    }else{
      this._router.navigate(['/home']).then();
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
      code:['52',[]],
      phoneNumber:['',[Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
      role:['',[Validators.required]],
      jobTitle:['',[Validators.required]],
      website:['',[Validators.pattern('[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$')]],
      ssn:['',[]],
      bloodType:['',[]],
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
      active: false,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      refId: this._refId,
      country: this.country,
      countryCode: data.code,
      role: data.role,
      website: (data.website?this.protocol + data.website:undefined),
      jobTitle: data.jobTitle,
      phoneNumber: data.phoneNumber,
      profileImage:(this.profileImage?this.profileImage:undefined),
      signature:(this.signature?this.signature:undefined),
      bCard: undefined
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
    this.createBCard(person, personInformation);
  }

  private createPerson(person: Person, personInformation: PersonInformation):void{
    this._api.createReferencedPerson(person).subscribe(response=>{
      switch (response.code){
        case 200:
          personInformation.id=response.item.id;
          this.createInformationCollaborator(personInformation, person.email);
          break;
        default:
          this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
          break;
      }
    });
  }

  private createInformationCollaborator(personInformation: PersonInformation, email:string): void{
    this._api.savePersonInformation(personInformation).subscribe(response=>{
      switch (response.code){
        case 200:
          this._router.navigate(['/home']).then(() => {
            this._dialogService.alertDialog(
              'Información',
              'Hemos enviado un email de validación de cuenta a: ' + email,
              'ACEPTAR');
            this._sharedService.setNotification({value: true, type: SharedTypeNotification.Directory});
          });
          break;
        default:
          this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
          break;
      }
    });
  }

  public validateEmailExist():void{
    let email: any = {
      email: this.newPerson.controls['email'].value
    };
    this._api.personExists(email).subscribe(response=>{
      switch (response.code){
        case 200:
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
  public openStudy():void{
    this._pdfVisor.open({urlOrFile: this.file});
  }

  private createBCard(person: Person, personInformation: PersonInformation):void{
    this._snackBarService.openSnackBar('Espere un momento...','',0);
    const data = {
      name: person.name || '',
      lastName: person.lastName  || '',
      company: LocalStorageService.getItem(Constants.StationInDashboard).name || '',
      phone: person.phoneNumber || '',
      workPosition: person.jobTitle || '',
      email: person.email || '',
      countryCode : person.countryCode || '',
      industryCode: '1',
      website: person.website || '',
      profileImage: person.profileImage ? person.profileImage.blobName : null,
      profileImageThumbnail: person.profileImage ? person.profileImage.thumbnail + '=s1200': null
    };
    this._api.businessCardService(data).subscribe(response =>{
      switch (response.code){
        case 200:
          this._snackBarService.closeSnackBar();
          person.bCard = response.item;
          this.createPerson(person, personInformation);
          break;
        default:
          this._snackBarService.closeSnackBar();
          this._snackBarService.openSnackBar('Ha ocurrido un error, por favor, intente de nuevo', 'OK', 3000);
          break;
      }
    });
  }
}
