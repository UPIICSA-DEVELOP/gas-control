import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ApiService} from '@app/core/services/api/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constants} from '@app/core/constants.core';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {CountryCodeService} from '@app/core/components/country-code/country-code.service';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {Person} from '@app/components/admin/children/add-consultancy/add-consultancy.component';
import {DialogService} from '@app/core/components/dialog/dialog.service';

@Component({
  selector: 'app-list-collaborators',
  templateUrl: './list-collaborators.component.html',
  styleUrls: ['./list-collaborators.component.scss']
})
export class ListCollaboratorsComponent implements OnInit {

  public collaboratorsList: any[];
  public addCollaboratorVisible: boolean;
  public userForm: FormGroup;
  public signature: any;
  public userImage: any;
  public roles: any[];
  public protocols: any[];
  private _location: any;
  private _userInfo: Person;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialog: MatDialogRef<ListCollaboratorsComponent>,
    private _formBuilder: FormBuilder,
    private _signatureService: SignaturePadService,
    private _uploadService: UploadFileService,
    private _snackBar: SnackBarService,
    private _countryCode: CountryCodeService,
    private _dialogService: DialogService,
    private _api: ApiService
  ) {
    this.collaboratorsList = [];
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
    this.roles = Constants.rolesConsutancy;
    this.protocols = Constants.protocols;
  }

  ngOnInit() {
    this.getList(this._data.id);
  }

  public close(): void{
    if(this.addCollaboratorVisible){
      this.userForm = null;
      this.userImage.blob = null;
      this.userImage.base64 = null;
      this.userImage.original = null;
      this.signature.blob = null;
      this.signature.path = null;
      this.signature.original = null;
      this.addCollaboratorVisible = false;
    }else{
      this._dialog.close();
    }
  }

  public deleteCollaborator(person: any): void{
    this._dialogService.confirmDialog('¿Desea elminar este registro?', '').afterClosed().subscribe(response => {
      switch (response.code){
        case 1:
          this._uploadService.delete(person.profileImage.blobName).subscribe(response => {
            console.log(response);
          });

          this._api.deletePerson(person.id).subscribe((response) => {
            switch (response.code){
              case 200:
                this.getList(this._data.id);
                break;
            }
          }, error => {
            console.error(error);
            this.onErrorOccurred();
          });
          break;
      }
    });
  }

  public changeRole(person: any): void{
    let title = '¿Desea cambiar el rol de ' + person.name + ' ' + person.lastName + ' a ';
    title += ((person.role===2)?'Asistente':'Gerente') + '?';
    this._dialogService.confirmDialog(title, '').afterClosed().subscribe(response => {
      switch (response.code){
        case 1:
          person.role = (person.role===2)?3:2;
          this._api.updatePerson(person).subscribe(response => {
            switch (response.code){
              case 200:
                this._snackBar.openSnackBar('Usuario actualizado', 'OK', 3000);
                break;
              default:
                this.onErrorOccurred();
                break;
            }
          });
          break;
      }
    });
  }

  public onLoadImage(ev: UploadFileResponse): void{
    this.userImage.blob = ev.blob;
    this.userImage.base64 = ev.url;
  }

  public onRemoveImage(): void{
    this.userImage.blob = null;
    this.userImage.base64 = null;
  }

  public showCreateCollaborator(): void{
    this.addCollaboratorVisible = !this.addCollaboratorVisible;
    if(!this.userForm){
      this.userForm = this._formBuilder.group({
        name: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        country:  ['', [Validators.required]],
        countryCode:  ['', [Validators.required]],
        phoneNumber: ['', [Validators.required]],
        rol: ['', [Validators.required]],
        jobTitle: ['', [Validators.required]],
        protocol: [''],
        website: ['', [Validators.pattern(Constants.REGEX_WEBSITE)]]
      });
    }
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

  public addCountry(): void{
    this._countryCode.openDialog().afterClosed().subscribe(response => {
      if(response){
        this.userForm.patchValue({country: response.name, countryCode: response.code});
      }
    });
  }

  public getDataCollaborator(data: any): void{
    if(this.userForm.invalid){
      return;
    }
    this._userInfo = {
      refId: this._data.id,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      countryCode: data.countryCode,
      country: data.country,
      role: data.rol,
      jobTitle: data.jobTitle,
      website: data.website
    };
    this.createCollaborator(this._userInfo);
  }

  private getList(id: any): void{
    this._api.listCollaborators(id, 'true').subscribe(response => {
      switch (response.code){
        case 200:
          this.collaboratorsList = response.items;
          break;
        default:
          this.onErrorOccurred();
          break;
      }
    });
  }

  private validateProfileImage(): void{
    if(this.userImage.blob){
      const form = new FormData();
      form.append('path', 'rfc');
      form.append('fileName', 'profileImage-'+this._data.id+'-'+new Date().getTime()+'.png');
      form.append('isImage', 'true');
      form.append('file', this.userImage.blob);
      this._uploadService.upload(form).subscribe(response => {
        this.userImage.original = response.item;
        this.validateSignature();
      }, error => {
        console.error(error);
        this.onErrorOccurred();
      });
    }else{
      this.validateSignature();
    }
  }

  private validateSignature(): void{
    if(this.signature.blob){
      const form = new FormData();
      form.append('path', 'rfc');
      form.append('fileName', 'signature-'+this._data.id+'-'+new Date().getTime()+'.png');
      form.append('isImage', 'true');
      form.append('file', this.signature.blob);
      this._uploadService.upload(form).subscribe(response => {
        this.signature.original = response.item;
        this.validateImages();
      }, error => {
        console.error(error);
        this.onErrorOccurred();
      });
    }else{
     this.validateImages();
    }
  }

  private validateImages(): void{
    if(this.userImage.original){
      this._userInfo.profileImage = this.userImage.original;
    }
    if(this.signature.original){
      this._userInfo.signature = this.signature.original;
    }
    if(this.userImage.original || this.signature.original){
      this.updateCollaborator(this._userInfo);
    }else{
      this.finishCreationCollaborator();
    }
  }

  private createCollaborator(person: any): void{
    this.userForm.disable();
    this._api.createReferencedPerson(person).subscribe(response => {
        switch (response.code){
          case 200:
            this._userInfo = response.item;
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

  private updateCollaborator(person: any): void{
    this._api.updatePerson(person).subscribe(response => {
      switch (response.code){
        case 200:
          this.finishCreationCollaborator();
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

  private finishCreationCollaborator(): void{
    this._snackBar.openSnackBar('Colaborador creado con éxito', 'OK', 3000);
    this.close();
    this.getList(this._data.id);
  }

  private onErrorOccurred(): void{
    this._snackBar.openSnackBar('Ha ocurrido un error, por favor, intente de nuevo', 'OK', 3000);
  }

}
