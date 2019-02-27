/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {Constants} from '@app/core/constants.core';
import {ApiService} from '@app/core/services/api/api.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {CountryCodeService} from '@app/core/components/country-code/country-code.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {Person} from '@app/core/interfaces/interfaces';

@Component({
  selector: 'app-collaborators-list',
  templateUrl: './collaborators-list.component.html',
  styleUrls: ['./collaborators-list.component.scss'],
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
export class CollaboratorsListComponent implements OnInit {
  @ViewChild('phoneNumber') private _phoneNumberInput: ElementRef;
  public collaborators: any[];
  public register: boolean = false;
  public signature: any;
  public blobSignature: string;
  public protocol: string = 'http://';
  public newPerson: FormGroup;
  public blobImageProfile: string;
  public profileImage: any;
  public addImage: boolean=false;
  public addSign: boolean=false;
  public user: any;
  public id: string;
  public country: string;
  public load: boolean;
  public collaborator: any[];
  private _formImage:FormData;
  private _formSignature: FormData;
  public role: string[];
  public changes: boolean;
  constructor(
    private _route: Router,
    private _api: ApiService,
    private _apiLoaderService: ApiLoaderService,
    private _snackBarService: SnackBarService,
    private _signatureService: SignaturePadService,
    private _countryCodeService: CountryCodeService,
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _uploadFile: UploadFileService
  ) {
    this.changes=false;
  }

  ngOnInit() {
    this.role = Constants.roles;
    this._apiLoaderService.getProgress().subscribe(load => {this.load = load; });
    this.getCollaborators();
  }

  public onCloseCollaborators(): void{
    if (this.changes) {
      this._dialogService.confirmDialog(
        '¿Desea salir sin guardar cambios?',
        '',
        'ACEPTAR',
        'CANCELAR').afterClosed().subscribe(response=>{
          switch (response.code) {
            case 1:
              this._route.navigate(['/home']).then();
              break;
            default:
              break;
          }
      })
    }else {
      this._route.navigate(['/home']).then();
    }
  }

  public getCollaborators(): void {
    this.id = CookieService.getCookie(Constants.IdSession);
    let user = LocalStorageService.getItem(Constants.UserInSession);
    this.user=user;
    this._api.listCollaborators(user.refId, 'true').subscribe(response=>{
      switch (response.code) {
        case 200:
          let user = null;
          this.collaborators = UtilitiesService.sortJSON(response.items,'name','asc');
          for (let i = 0; i< this.collaborators.length; i++){
            if(this.collaborators[i].id === this.id){
                user = this.collaborators[i];
            }
          }
          if (user){
            const index = this.collaborators.indexOf(user);
            this.collaborators.splice(index, 1);
          }
          this.collaborator = this.collaborators;
          break;
        default:
          break;
      }
    });
  }

  public deleteCollaborator(id: string, index: number): void{
    this._dialogService.confirmDialog(
      '¿Desea eliminar este registro?',
      '',
      'ACEPTAR',
      'CANCELAR'
    ).afterClosed().subscribe(response=>{
      switch (response.code) {
        case 1:
          this._api.deletePerson(id).subscribe(response=>{
            switch (response.code) {
              case 200:
                this.collaborators.splice(index, 1);
                break;
              default:
                break;
            }
          });
          break;
        default:
          break;
      }
    });
  }

  public changeRoleCollaborator(id: string, newRole: number):void{
    this._api.updateRolePerson(id, newRole).subscribe(response=>{
      switch (response.code) {
        case 200:
          this._snackBarService.openSnackBar('Rol actualizado', 'OK', 2000);
          this.getCollaborators();
          break;
        default:
          this._snackBarService.openSnackBar('No se ha podido actualizar el rol', 'OK', 2000);
          this.getCollaborators();
          break;
      }
    });
  }

  public addCollaborator():void{
    this.newPerson = this._formBuilder.group({
      name:['',[Validators.required]],
      lastName:['',[Validators.required]],
      email:['',[Validators.required, Validators.email]],
      country:['México',[Validators.required]],
      code:['+52',[]],
      phoneNumber:['',[Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
      role:['',[Validators.required]],
      jobTitle:['',[Validators.required]],
      website:['',[Validators.pattern('[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$')]]
    });
    this.country = 'MX';
    this.register = true;
    this.detectChanges();
  }

  private detectChanges():void{
    this.newPerson.valueChanges.subscribe(value=>{
      this.changes = true;
    });
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

  public validateImgAndSignature(data: any){
    if (this.newPerson.invalid) {
      return;
    }
    if (this.addImage) {
      this.uploadImage(false);
      return;
    }
    if (this.addSign) {
      this.uploadImage(true);
      return;
    }
    this.saveUser(data);
  }

  public uploadImage(isSignature: boolean): void{
    if (!isSignature) {
      this._uploadFile.upload(this._formImage).subscribe(response=>{
        if (response) {
          this.profileImage = {
            blobName: response.item.blobName || '',
            thumbnail: response.item.thumbnail || ''
          };
          this.addImage = false;
          this.validateImgAndSignature(this.newPerson.value);
        }
      })
    }else {
      this._uploadFile.upload(this._formSignature).subscribe(response=>{
        if (response) {
          this.signature = {
            blobName: response.item.blobName || '',
            thumbnail: response.item.thumbnail || ''
          };
          this.addSign = false;
          this.validateImgAndSignature(this.newPerson.value);
        }
      })
    }
  }

  private saveUser(data:any):void{
    data.code = data.code.replace('+','');
    let newPerson: Person = {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      countryCode: data.code,
      refId: this.user.refId,
      country: this.country,
      jobTitle: data.jobTitle,
      phoneNumber: data.phoneNumber,
      role: data.role,
      website: (data.website? this.protocol + data.website:undefined),
      profileImage:(this.profileImage? this.profileImage: undefined),
      signature:(this.signature? this.signature: undefined),
      bCard: undefined
    };
    this.createBCard(newPerson);
  }

  public back():void{
    this._dialogService.confirmDialog(
      '¿Desea salir sin guardar cambios?',
      '',
      'ACEPTAR',
      'CANCELAR').afterClosed().subscribe(response=>{
      switch (response.code) {
        case 1:
          this.register=false;
          break;
        default:
          break;
      }
    })
  }

  public search(event: any): void{
    const newArray = [];
    const text = (event.srcElement.value).toLowerCase();
    if(text === ''){
      this.collaborators = this.collaborator;
    }else{
      for(let x=0; x < this.collaborator.length; x++){
        if(UtilitiesService.removeDiacritics(this.collaborator[x].name).toLowerCase().includes(text) || this.collaborator[x].email.toLowerCase().includes(text) || this.collaborator[x].phoneNumber.includes(text) || UtilitiesService.removeDiacritics(this.collaborator[x].lastName).toLowerCase().includes(text) ){
          newArray.push(this.collaborator[x]);
        }else {
          for (let y = 0; y < this.role.length; y++){
            if (UtilitiesService.removeDiacritics(this.role[y]).toLowerCase().includes(text) && this.collaborator[x].role === y+1){
              newArray.push(this.collaborator[x]);
            }
          }
        }
      }
      if(newArray.length > 0){
        this.collaborators = newArray;
      }else{
        this.collaborators = this.collaborator;
      }
    }
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

  private createBCard(person: any):void{
    this._snackBarService.openSnackBar('Espere un momento...','',0);
    const data = {
      name: person.name || '',
      lastName: person.lastName  || '',
      company: LocalStorageService.getItem(Constants.ConsultancyInSession).name || '',
      phone: person.phoneNumber || '',
      workPosition: person.jobTitle || '',
      email: person.email || '',
      countryCode : person.countryCode || '',
      industryCode: '1',
      website: person.website || '',
      profileImage: person.profileImage ? person.profileImage.blobName : null,
      profileImageThumbnail: person.profileImage ? person.profileImage.thumbnail + '=s1200': null
    };
    this._api.businessCardService(data).subscribe(response=>{
      switch (response.code){
        case 200:
          this._snackBarService.closeSnackBar();
          person.bCard = response.item;
          this.createPerson(person);
          break;
        default:
          this._snackBarService.closeSnackBar();
          this._snackBarService.openSnackBar('Ha ocurrido un error, por favor, intente de nuevo', 'OK', 3000);
          break;
      }
    });
  }

  private createPerson(newPerson: any):void{
    this._api.createReferencedPerson(newPerson).subscribe(response=>{
      switch (response.code) {
        case 200:
          this.blobImageProfile = undefined;
          this.blobSignature = undefined;
          this._dialogService.confirmDialog(
            'Información',
            'Hemos enviado un email de validación de cuenta a: ' + newPerson.email,
            'ACEPTAR');
          this.getCollaborators();
          this.register = false;
          break;
        default:
          this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
          break;
      }
    });
  }
}
