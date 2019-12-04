/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from 'app/utils/constants/constants.utils';
import {ApiService} from 'app/core/services/api/api.service';
import {SignaturePadService} from 'app/shared/components/signature-pad/signature-pad.service';
import {CountryCodeService} from 'app/shared/components/country-code/country-code.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DialogService} from 'app/shared/components/dialog/dialog.service';
import {UploadFileService} from 'app/shared/components/upload-file/upload-file.service';
import {UtilitiesService} from 'app/utils/utilities/utilities';
import {Subscription} from 'rxjs';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {Person} from '@app/utils/interfaces/person';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {EntityResponse} from '@app/utils/class/entity-response';
import {ANIMATION} from '@app/ui/dashboard/pages/collaborators-list/animation';
import {CookieService, LocalStorageService, SnackBarService} from '@maplander/core';
import {UserMedia} from '@app/utils/interfaces/user-media';

@Component({
  selector: 'app-collaborators-list',
  templateUrl: './collaborators-list.component.html',
  styleUrls: ['./collaborators-list.component.scss'],
  animations: [ANIMATION]
})
export class CollaboratorsListComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation')

  @ViewChild('phoneNumber', {static: true}) private _phoneNumberInput: ElementRef;
  public collaborators: Person[];
  public register: boolean;
  public signature: any;
  public blobSignature: string;
  public protocol: string;
  public newPerson: FormGroup;
  public blobImageProfile: string;
  public profileImage: any;
  public addImage: boolean;
  public addSign: boolean;
  public user: Person;
  public country: string;
  public load: boolean;
  public collaborator: any[];
  private _formImage: FormData;
  private _formSignature: FormData;
  public role: string[];
  public changes: boolean;
  public emptySearch: boolean;
  private _subscriptionLoader: Subscription;
  private _refId: string;

  constructor(
    private _route: Router,
    private _api: ApiService,
    private _apiLoaderService: LoaderService,
    private _snackBarService: SnackBarService,
    private _signatureService: SignaturePadService,
    private _countryCodeService: CountryCodeService,
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _uploadFile: UploadFileService,
    private _activateRouter: ActivatedRoute
  ) {
    this.register = false;
    this.emptySearch = false;
    this.changes = false;
    this.protocol = 'http://';
    this.addImage = false;
    this.addSign = false;
  }

  ngOnInit() {
    this.role = Constants.roles;
    this._subscriptionLoader = this._apiLoaderService.getProgress().subscribe(load => {
      this.load = load;
    });
    if (this._activateRouter.snapshot.queryParams['consultancy']) {
      this._refId = this._activateRouter.snapshot.queryParams['consultancy'];
      this.getCollaborators();
    }
  }

  ngOnDestroy(): void {
    this._subscriptionLoader.unsubscribe();
  }

  public onCloseCollaborators(): void {
    if (this.changes) {
      this._dialogService.confirmDialog(
        '¿Desea salir sin guardar cambios?',
        '',
        'ACEPTAR',
        'CANCELAR').afterClosed().subscribe(response => {
        if (response.code === 1) {
          this._route.navigate(['/home']).then();
        } else {
        }
      });
    } else {
      this._route.navigate(['/home']).then();
    }
  }

  public getCollaborators(): void {
    const id = CookieService.getCookie(Constants.IdSession);
    this.user = LocalStorageService.getItem(Constants.UserInSession);
    this._api.listCollaborators(this._refId, 'true').subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        let user = null;
        this.collaborators = UtilitiesService.sortJSON(response.items, 'name', 'asc');
        for (let i = 0; i < this.collaborators.length; i++) {
          if (this.collaborators[i].id === id) {
            user = this.collaborators[i];
          }
        }
        if (user) {
          const index = this.collaborators.indexOf(user);
          this.collaborators.splice(index, 1);
        }
        this.collaborator = this.collaborators;
      } else {
      }
    });
  }

  public deleteCollaborator(id: string, index: number): void {
    this._dialogService.confirmDialog(
      '¿Desea eliminar este registro?',
      '',
      'ACEPTAR',
      'CANCELAR'
    ).afterClosed().subscribe(response => {
      if (response.code === 1) {
        this._api.deletePerson(id).subscribe(deletePerson => {
          if (deletePerson.code === HttpResponseCodes.OK) {
            this.collaborators.splice(index, 1);
          } else {
          }
        });
      } else {
      }
    });
  }

  public changeRoleCollaborator(person: Person): void {
    let newRole = 0;
    switch (person.role) {
      case 2:
        newRole = 3;
        break;
      case 3:
        newRole = 2;
        break;
    }
    const message = '¿Desea cambiar el rol de ' + person.name + ' ' + person.lastName + ' a ' + this.role[newRole - 1] + '?';
    this._dialogService.confirmDialog(message, '', 'ACEPTAR', 'CANCELAR').afterClosed().subscribe(response => {
      if (response.code === 1) {
        this._api.updateRolePerson(person.id, newRole).subscribe((updatePerson: EntityResponse<Person>) => {
          if (updatePerson.code === HttpResponseCodes.OK) {
            this._snackBarService.setMessage('Rol actualizado', 'OK', 2000);
            this.getCollaborators();
          } else {
            this._snackBarService.setMessage('No se ha podido actualizar el rol', 'OK', 2000);
            this.getCollaborators();
          }
        });
      }
    });
  }

  public addCollaborator(): void {
    this.newPerson = this._formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      country: ['México', [Validators.required]],
      code: ['52', []],
      phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
      role: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      website: ['', [Validators.pattern('[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$')]]
    });
    this.country = 'MX';
    this.register = true;
    this.detectChanges();
  }

  private detectChanges(): void {
    this.newPerson.valueChanges.subscribe(() => {
      this.changes = true;
    });
  }

  public addSignature(): void {
    this._signatureService.open().afterClosed().subscribe(response => {
      if (response.code === 1) {
        this.changes = true;
        this.blobSignature = response.base64;
        this.addSign = true;
        this._formSignature = new FormData();
        this._formSignature.append('path', '');
        this._formSignature.append('fileName', 'signature-' + this._refId + '-' + new Date().getTime() + '.png');
        this._formSignature.append('isImage', 'true');
        this._formSignature.append('file', response.blob);
      }
    });
  }

  public onLoadImage(event: UserMedia): void {
    if (event == null) {
      this.changes = true;
      this.blobImageProfile = '';
      this.addImage = false;
    }
    this.changes = true;
    this.blobImageProfile = event.url;
    this.addImage = true;
    this._formImage = new FormData();
    this._formImage.append('path', '');
    this._formImage.append('filename', 'profileImage-' + this._refId + '-' + new Date().getTime() + '.png');
    this._formImage.append('isImage', 'true');
    this._formImage.append('file', event.blob);
  }

  public selectCountryCode(): void {
    this._countryCodeService.openDialog().afterClosed().subscribe(response => {
      if (response) {
        this.changes = true;
        this.country = response.iso;
        this.newPerson.patchValue({
          country: response.name,
          code: response.code
        });
        this._phoneNumberInput.nativeElement.focus();
      }
    });
  }

  public validateImgAndSignature(data: any) {
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

  public uploadImage(isSignature: boolean): void {
    if (!isSignature) {
      this._uploadFile.upload(this._formImage).subscribe(response => {
        if (response) {
          this.profileImage = {
            blobName: response.item.blobName || '',
            thumbnail: response.item.thumbnail || ''
          };
          this.addImage = false;
          this.validateImgAndSignature(this.newPerson.value);
        }
      });
    } else {
      this._uploadFile.upload(this._formSignature).subscribe(response => {
        if (response) {
          this.signature = {
            blobName: response.item.blobName || '',
            thumbnail: response.item.thumbnail || ''
          };
          this.addSign = false;
          this.validateImgAndSignature(this.newPerson.value);
        }
      });
    }
  }

  private saveUser(data: any): void {
    data.code = data.code.replace('+', '');
    const newPerson: Person = {
      active: false,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      countryCode: data.code,
      refId: this._refId,
      country: this.country,
      jobTitle: data.jobTitle,
      phoneNumber: data.phoneNumber,
      role: data.role,
      website: (data.website ? this.protocol + data.website : undefined),
      profileImage: (this.profileImage ? this.profileImage : undefined),
      signature: (this.signature ? this.signature : undefined),
      bCard: undefined
    };
    this.createBCard(newPerson);
  }

  public back(): void {
    if (this.changes) {
      this._dialogService.confirmDialog(
        '¿Desea salir sin guardar cambios?',
        '',
        'ACEPTAR',
        'CANCELAR').afterClosed().subscribe(response => {
        if (response.code === 1) {
          this.register = false;
          this.changes = false;
        } else {
        }
      });
    } else {
      this.register = false;
    }
  }

  public search(event: any): void {
    const newArray = [];
    const text = (event.target.value).toLowerCase();
    if (text === '') {
      this.collaborators = this.collaborator;
    } else {
      for (let x = 0; x < this.collaborator.length; x++) {
        if (UtilitiesService.removeDiacritics(this.collaborator[x].name).toLowerCase().includes(text) ||
          this.collaborator[x].email.toLowerCase().includes(text) || this.collaborator[x].phoneNumber.includes(text) ||
          UtilitiesService.removeDiacritics(this.collaborator[x].lastName).toLowerCase().includes(text)) {
          newArray.push(this.collaborator[x]);
        } else {
          for (let y = 0; y < this.role.length; y++) {
            if (UtilitiesService.removeDiacritics(this.role[y]).toLowerCase().includes(text) && this.collaborator[x].role === y + 1) {
              newArray.push(this.collaborator[x]);
            }
          }
        }
      }
      if (newArray.length > 0) {
        this.collaborators = newArray;
      } else {
        this.collaborators = newArray;
        this.emptySearch = (newArray.length === 0);
      }
    }
  }

  public validateEmailExist(): void {
    const email: any = {
      email: this.newPerson.controls['email'].value
    };
    this._api.personExists(email).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._dialogService.alertDialog('Información',
          'El Email que está tratando de usar ya ha sido asociado a un usuario',
          'ACEPTAR');
        this.newPerson.controls['email'].setErrors({emailUsed: true});
      } else {
      }
    });
  }

  private createBCard(person: Person): void {
    this._snackBarService.setMessage('Espere un momento...', '', 0);
    const data = {
      name: person.name || '',
      lastName: person.lastName || '',
      company: LocalStorageService.getItem(Constants.ConsultancyInSession).name || '',
      phone: person.phoneNumber || '',
      workPosition: person.jobTitle || '',
      email: person.email || '',
      countryCode: person.countryCode || '',
      industryCode: '1',
      website: person.website || '',
      profileImage: person.profileImage ? person.profileImage.blobName : null,
      profileImageThumbnail: person.profileImage ? person.profileImage.thumbnail + '=s1200' : null
    };
    this._api.businessCardService(data).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._snackBarService.closeSnackBar();
        person.bCard = response.item;
        this.createPerson(person);
      } else {
        this._snackBarService.closeSnackBar();
        this._snackBarService.setMessage('Ha ocurrido un error, por favor, intente de nuevo', 'OK', 3000);
      }
    });
  }

  private createPerson(person: Person): void {
    this._api.createReferencedPerson(person).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this.blobImageProfile = undefined;
        this.blobSignature = undefined;
        this._dialogService.alertDialog(
          'Información',
          'Hemos enviado un email de validación de cuenta a: ' + person.email,
          'ACEPTAR');
        this.getCollaborators();
        this.register = false;
        this.changes = false;
      } else {
        this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
      }
    });
  }
}
