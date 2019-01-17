/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
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

export interface person {
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
  public role: string[] = [
    'Director',
    'Gerente',
    'Asistente',
    'Representante legal',
    'Encargado de estación',
    'Gerente de estación',
    'Asistente de estación'];
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
  ) { }

  ngOnInit() {
    this._apiLoaderService.getProgress().subscribe(load => {this.load = load; });
    this.getCollaborators();
  }

  public onCloseCollaborators(): void{
    if (this.register) {
      this._dialogService.confirmDialog(
        '¿Desea salir sin guardar cambios?',
        '',
        'ACEPTAR',
        'CANCELAR').afterClosed().subscribe(response=>{
          switch (response.code) {
            case 1:
              this._route.navigate(['/home']);
              break;
            default:
              break;
          }
      })
    }else {
      this._route.navigate(['/home']);
    }
  }

  public getCollaborators(): void {
    this.id = CookieService.getCookie(Constants.IdSession);
    let user = SessionStorageService.getItem(Constants.UserInSession);
    this.user=user;
    this._api.listCollaborators(user.refId, 'true').subscribe(response=>{
      switch (response.code) {
        case 200:
          let user = null;
          this.collaborators = response.items;
          for (let i = 0; i< this.collaborators.length; i++){
            if(this.collaborators[i].id === this.id){
                user = this.collaborators[i];
            }
          }
          const index = this.collaborators.indexOf(user);
          this.collaborators.splice(index, 1);
          this.collaborators.unshift(user);
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
      console.log(response);
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
  }

  public addSignature(): void{
    this._signatureService.open().afterClosed().subscribe(response=>{
      switch (response.code) {
        case 1:
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
    this.blobImageProfile = event.url;
    this.addImage = true;
    this._formImage = new FormData();
    this._formImage.append('path','');
    this._formImage.append('filename','profileImage-'+this.user.refId+'-'+new Date().getTime()+'.png');
    this._formImage.append('isImage', 'true');
    this._formImage.append('file', event.blob);
  }

  public  onRemoveImage(): void{
    this.blobImageProfile = '';
    this.addImage = false;
  }

  public selectCountryCode():void{
    this._countryCodeService.openDialog().afterClosed().subscribe(response=>{
      if (response) {
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
    }
    if (this.addSign) {
      this.uploadImage(true);
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
    let newPerson: person = {
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
      signature:(this.signature? this.signature: undefined)
    };
    this._api.createReferencedPerson(newPerson).subscribe(response=>{
      switch (response.code) {
        case 200:
          this._snackBarService.openSnackBar('Colaborado creado','OK',3000);
          this.getCollaborators();
          this.register = false;
          break;
        default:
          this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
          break;
      }
    });
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
    debugger;
    const newArray = [];
    const text = (event.srcElement.value).toLowerCase();
    if(text === ''){
      this.collaborators = this.collaborator;
    }else{
      for(let x=0; x < this.collaborator.length; x++){
        if(UtilitiesService.removeDiacritics(this.collaborator[x].name).toLowerCase().includes(text) || this.collaborator[x].email.toLowerCase().includes(text) || this.collaborator[x].phoneNumber.includes(text) || UtilitiesService.removeDiacritics(this.collaborator[x].lastName).toLowerCase().includes(text) ){
          newArray.push(this.collaborator[x]);
        }else {
          switch (text.toLowerCase()) {
            case 'director':
              if (this.collaborator[x].role === 1) {
                newArray.push(this.collaborator[x]);
              }
              break;
            case 'gerente':
              if (this.collaborator[x].role === 2) {
                newArray.push(this.collaborator[x]);
              }
              break;
            case 'asistente':
              if (this.collaborator[x].role === 3) {
                newArray.push(this.collaborator[x]);
              }
              break;
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
}
