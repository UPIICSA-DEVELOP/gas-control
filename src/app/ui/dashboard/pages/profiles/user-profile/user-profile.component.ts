/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from 'app/core/services/api/api.service';
import {UpdatePasswordService} from 'app/shared/components/update-password/update-password.service';
import {DialogService} from 'app/shared/components/dialog/dialog.service';
import {Constants} from 'app/utils/constants/constants.utils';
import {SignaturePadService} from 'app/shared/components/signature-pad/signature-pad.service';
import {PdfVisorService} from 'app/shared/components/pdf-visor/pdf-visor.service';
import {Subscription} from 'rxjs';
import {ShareService} from 'app/shared/components/share/share.service';
import {AuthService} from 'app/core/services/auth/auth.service';
import {HashService} from 'app/utils/utilities/hash.service';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {Person} from '@app/utils/interfaces/person';
import {PersonInformation} from '@app/utils/interfaces/person-information';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {ANIMATION} from '@app/ui/dashboard/pages/profiles/user-profile/animation';
import {CountryCodeService, LocalStorageService, SnackBarService} from '@maplander/core';
import {UserMedia} from '@app/utils/interfaces/user-media';
import {UploadFileService} from '@app/shared/components/upload-file/upload-file.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  animations: [ANIMATION]
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation')

  @ViewChild('phoneNumber', {static: true}) private _phoneNumberInput: ElementRef;
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
    private _apiLoaderService: LoaderService,
    private _updatePassword: UpdatePasswordService,
    private _dialogService: DialogService,
    private _countryCodeService: CountryCodeService,
    private _snackBarService: SnackBarService,
    private _uploadFile: UploadFileService,
    private _formBuilder: FormBuilder,
    private _signaturePad: SignaturePadService,
    private _params: ActivatedRoute,
    private _pdfVisor: PdfVisorService,
    private _shareService: ShareService,
    private _auth: AuthService
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
    this.getUser(this._params.snapshot.data.data.user);
    this.getUserInformation(this._params.snapshot.data.data.userInfo);
    this._subscriptionLoader = this._apiLoaderService.getProgress().subscribe(load => {
      this.load = load;
    });
  }

  ngOnDestroy(): void {
    this._subscriptionLoader.unsubscribe();
  }

  public closeProfile(): void {
    if (this.change) {
      this.saveChangeBeforeExit();
      return;
    }
    if (!this.signature) {
      this._snackBarService.setMessage('Por favor, registre su firma', 'OK', 3000);
      return;
    }
    this._router.navigate(['/home']).then();
  }

  public saveChangeBeforeExit(): void {
    this._dialogService.confirmDialog(
      '¿Desea salir sin guardar cambios?',
      '',
      'ACEPTAR',
      'CANCELAR'
    ).afterClosed().subscribe(response => {
      if (response.code === 1) {
        this.change = false;
        this._router.navigate(['/home']).then();
      }
    });
  }

  public detectChange(): void {
    this.profileForm.valueChanges.subscribe(() => {
      this.change = true;
    });
  }

  public onLoadImage(event: UserMedia): void {
    if (event == null) {
      this.change = true;
      this.deleteImage = true;
      this.newImage = false;
      this.profileImage = null;
      this._formDeleteData = new FormData();
      this._formDeleteData.append('blobName', this.blobName);
    }
    this.newImage = true;
    this.change = true;
    this.deleteImage = false;
    this.profileImage = event.url;
    this._formData = new FormData();
    this._formData.append('path', '');
    this._formData.append('fileName', 'profile-' + this.user.id + '-' + new Date().getTime() + '.png');
    this._formData.append('isImage', 'true');
    this._formData.append('file', event.blob);
  }

  public onLoadFile(event: UserMedia): void {
    this.newFile = true;
    this.change = true;
    this.file = event.blob;
    this._formFile = new FormData();
    this._formFile.append('path', '');
    this._formFile.append('fileName', 'benzene-' + this.user.id + '-' + new Date().getTime() + '.pdf');
    this._formFile.append('file', event.blob);
  }

  public changeSignature(): void {
    this._signaturePad.open().afterClosed().subscribe(response => {
      if (response.code === 1) {
        this.change = true;
        this.newSignature = true;
        this.signature = response.base64;
        this._formSignature = new FormData();
        this._formSignature.append('path', '');
        this._formSignature.append('fileName', 'signature-' + this.user.id + '-' + new Date().getTime() + '.png');
        this._formSignature.append('isImage', 'true');
        this._formSignature.append('file', response.blob);
      }
    });
  }

  public uploadSignature(): void {
    this._uploadFile.upload(this._formSignature).subscribe(response => {
      if (response) {
        this.newSig = {
          thumbnail: response.item.thumbnail || '',
          blob: response.item.blobName || ''
        };
        this.newSignature = false;
        this.updateProfile(this.profileForm.value);
      }
    });
  }

  public openListCountry(): void {
    this._countryCodeService.open().afterClosed().subscribe(response => {
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

  public changePassword() {
    this._updatePassword.updatePassword(
      this.user.password,
      'Actualice su contraseña',
      '',
      'Contraseña actual',
      'Nueva contraseña',
      'Confirmar nueva contraseña',
      'ACEPTAR',
      'CANCELAR'
    ).afterClosed().subscribe(response => {
      if (response.code === 1) {
        this.user.password = response.data;
        this.saveUser(true);
      } else {
      }
    });
  }

  public uploadImage(): void {
    this._uploadFile.upload(this._formData).subscribe(response => {
      if (response) {
        this.newImageProfile = {
          thumbnail: response.item.thumbnail || '',
          blob: response.item.blobName || ''
        };
        this.newImage = false;
        this.updateProfile(this.profileForm.value);
      }
    });
  }

  private uploadFile(): void {
    this._uploadFile.upload(this._formFile).subscribe(response => {
      if (response) {
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
      contactPhone: ['', [Validators.minLength(8), Validators.maxLength(13)]],
      contactKinship: ['', []],
      contactName: ['', []],
      ssn: ['', []]
    });
    // this.getUser();
  }

  private getUser(response: any): void {
    if (response.code === HttpResponseCodes.OK) {
      this.user = {
        active: response.item.active,
        id: response.item.id,
        refId: response.item.refId || undefined,
        name: response.item.name,
        lastName: response.item.lastName,
        email: response.item.email,
        countryCode: response.item.countryCode || '',
        country: (response.item.country ? response.item.country : ''),
        phoneNumber: response.item.phoneNumber,
        password: response.item.password,
        role: response.item.role,
        jobTitle: response.item.jobTitle,
        profileImage: (response.item.profileImage ? {
          blobName: (response.item.profileImage.blobName ? response.item.profileImage.blobName : undefined),
          thumbnail: (response.item.profileImage.thumbnail ? response.item.profileImage.thumbnail : undefined)
        } : undefined),
        signature: (response.item.signature ? {
          blobName: (response.item.signature ? response.item.signature.blobName : undefined),
          thumbnail: (response.item.signature ? response.item.signature.thumbnail : undefined),
        } : undefined),
        website: response.item.website,
        bCard: (response.item.bCard ? response.item.bCard : undefined)
      };
      if (this.user.profileImage) {
        this.profileImage = this.user.profileImage.thumbnail;
        this.blobName = this.user.profileImage.blobName;
      }
      if (this.user.signature) {
        this.signature = this.user.signature.thumbnail;
      }
      if (this.user.website) {
        if (this.user.website.includes('http://')) {
          this.user.website = this.user.website.replace('http://', '');
          this.protocol = 'http://';
        } else {
          this.user.website = this.user.website.replace('https://', '');
          this.protocol = 'https://';
        }
      }
      this.userRole = this.role[this.user.role - 1];
    }
  }

  private getUserInformation(response: any): void {
    if (response.code === HttpResponseCodes.OK) {
      this.userInformation = {
        id: response.item.id,
        ssn: response.item.ssn || undefined,
        bloodType: response.item.bloodType || undefined,
        concatcPhone: response.item.concatcPhone || undefined,
        contactName: response.item.contactName || undefined,
        contactKinship: response.item.contactKinship || undefined,
        benzene: (response.item.benzene ? {
          blobName: (response.item.benzene.blobName ? response.item.benzene.blobName : undefined),
          thumbnail: (response.item.benzene.thumbnail ? response.item.benzene.thumbnail : undefined)
        } : undefined)
      };
      if (this.userInformation.benzene) {
        this.file = this.userInformation.benzene.thumbnail;
      }
      if (this.userInformation.bloodType) {
        for (const bd in this.bloodGroup) {
          if (this.bloodGroup[bd] === this.userInformation.bloodType) {
            this.bloodType = this.bloodGroup[bd];
            break;
          } else {
            this.bloodType = '';
          }
        }
      }
      this.patchForm();
    } else {
      this.bloodType = '';
      this.userInformation = {
        bloodType: undefined,
        concatcPhone: undefined,
        contactKinship: undefined,
        contactName: undefined,
        ssn: undefined,
        id: this.user.id,
        benzene: undefined
      };
      this.patchForm();
    }
  }

  private patchForm(): void {
    let formCountry: string;
    if (this.user.country) {
      for (const country of Constants.countries) {
        if (country.iso === this.user.country) {
          this.country = country.iso;
          formCountry = country.name;
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
  }

  public updateProfile(data: any): void {
    if (this.profileForm.invalid) {
      return;
    }
    if (!this.signature) {
      this._snackBarService.setMessage('Por favor, registre su firma', 'OK', 3000);
      return;
    }
    if (this.newImage) {
      this.uploadImage();
      return;
    }
    if (this.deleteImage) {
      this.newImageProfile = undefined;
      this.deleteImage = false;
      this.updateProfile(data);
    }
    if (this.newFile) {
      this.uploadFile();
      return;
    }
    if (this.newSignature) {
      this.uploadSignature();
      return;
    }
    this.saveProfileInformation(data);
  }

  private saveProfileInformation(data: any): void {
    const emailUpdate = this.user.email !== data.email;
    data.code = data.code.replace('+', '');
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
    this.user.website = (data.website ? this.protocol + data.website : '');
    if (this.newImageProfile) {
      this.user.profileImage = {
        blobName: this.newImageProfile.blob,
        thumbnail: this.newImageProfile.thumbnail
      };
      this._auth.updateUserInSession(this.user);
    } else if (!this.profileImage) {
      this.user.profileImage = null;
      this._auth.updateUserInSession(this.user);
    }
    if (this.newFileSub) {
      this.userInformation.benzene = {
        thumbnail: this.newFileSub.thumbnail,
        blobName: this.newFileSub.blob
      };
    }
    if (this.newSig) {
      this.user.signature = {
        blobName: this.newSig.blob,
        thumbnail: this.newSig.thumbnail
      };
    }
    this.updateBusiness(emailUpdate);
  }


  private updateBusiness(isNewEmail: boolean): void {
    this._snackBarService.setMessage('Espere un momento...', '', 0);
    let company;
    if (LocalStorageService.getItem<{id: string, name: string}>(Constants.StationInDashboard)) {
      company = LocalStorageService.getItem<{id: string, name: string}>(Constants.StationInDashboard).name;
    } else {
      company = '';
    }
    const data = {
      name: this.user.name || '',
      lastName: this.user.lastName || '',
      company: this.user.role === 4 ? '' : (company || ''),
      phone: this.user.phoneNumber || '',
      workPosition: this.user.jobTitle || '',
      email: this.user.email || '',
      countryCode: this.user.countryCode || '',
      industryCode: '1',
      website: this.user.website || '',
      profileImage: this.user.profileImage ? this.user.profileImage.blobName : null,
      profileImageThumbnail: this.user.profileImage ? this.user.profileImage.thumbnail + '=s1200' : null,
      bCardId: this.user.bCard ? this.user.bCard.id : null
    };
    this._api.businessCardService(data).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._snackBarService.closeSnackBar();
        this.user.bCard = response.item;
        if (isNewEmail) {
          this.updateProfileDataWithNewEmail();
        } else {
          this.saveUser();
        }
      } else {
        this._snackBarService.closeSnackBar();
        this._snackBarService.setMessage('Ha ocurrido un error, por favor, intente de nuevo', 'OK', 3000);
      }
    });
  }

  private saveUser(redirect?: boolean): void {
    this._api.updatePerson(this.user).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        if (!redirect) {
          this.saveInformation();
        } else {
          this._dialogService.alertDialog('Información', 'Contraseña actualizada');
        }
      } else {
        this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
      }
    });
  }

  private updateProfileDataWithNewEmail(): void {
    this._api.updatePersonWithDifferentEmail(this.user).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this.saveInformation();
      } else {
        this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
      }
    });
  }

  private saveInformation(): void {
    this._api.savePersonInformation(this.userInformation).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this.change = false;
        this._snackBarService.setMessage('Información actualizada', 'OK', 3000);
      } else {
        this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
      }
    });
  }

  public openStudy(): void {
    this._pdfVisor.open({urlOrFile: this.newFile ? this.file : HashService.set('123456$#@$^@1ERF', this.file), hideDownload: false});
  }

  public validateEmailExist(): void {
    const email: any = {
      email: this.profileForm.controls['email'].value
    };
    this._api.personExists(email).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        if (this.user.email !== email.email) {
          this._dialogService.alertDialog('Información',
            'El Email que está tratando de usar ya ha sido asociado a un usuario',
            'ACEPTAR');
          this.profileForm.controls['email'].setErrors({emailUsed: true});
        }
      } else {
      }
    });
  }

  public share(): void {
    if (this.user.bCard && this.user.bCard.dynamicLink) {
      this._shareService.open(this.user.bCard.dynamicLink);
    }
  }

}
