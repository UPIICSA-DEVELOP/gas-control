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
  private _formImage:FormData;
  private _formSignature: FormData;
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
  ) { }

  ngOnInit() {
    this.user= SessionStorageService.getItem(Constants.UserInSession);
    this._apiLoader.getProgress().subscribe(load => {this.load = load; });
    this.initForm();
  }

  public close():void{
    this._dialogService.confirmDialog('¿Desea salir sin guardar cambios?',
      '',
      'ACEPTAR',
      'CANCELAR').afterClosed().subscribe(response=>{
        switch (response.code) {
          case 1:
            this._router.navigate(['/home']);
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

  private initForm():void{
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
}
