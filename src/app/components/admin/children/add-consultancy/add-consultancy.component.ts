import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constants} from '@app/core/constants.core';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {LocationService} from '@app/core/components/location/location.service';
import {CountryCodeService} from '@app/core/components/country-code/country-code.service';
import {MatStepper} from '@angular/material';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {ApiService} from '@app/core/services/api/api.service';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';

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

@Component({
  selector: 'app-add-consultancy',
  templateUrl: './add-consultancy.component.html',
  styleUrls: ['./add-consultancy.component.scss']
})
export class AddConsultancyComponent implements OnInit {
  @ViewChild('stepper') private _stepper: MatStepper;
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
  public testUrl: any;
  private _location: any;
  private _ownerInfo: Person;
  private _consultancyInfo: any;
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _formBuilder: FormBuilder,
    private _apiLoader: ApiLoaderService,
    private _signatureService: SignaturePadService,
    private _locationService: LocationService,
    private _snackBar: SnackBarService,
    private _countryCode: CountryCodeService,
    private _uploadFile: UploadFileService,
    private _api: ApiService,
    private _router: Router
  ) {
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
    this._apiLoader.getProgress().subscribe(load => {this.load = load});
    this.showOwnerForm = true;
    this.ownerForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      country:  ['', [Validators.required]],
      countryCode:  ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      rol: [1, [Validators.required]],
      jobTitle: ['', [Validators.required]],
      protocol: [''],
      website: ['', [Validators.pattern(Constants.REGEX_WEBSITE)]]
    });
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
      countryCode: data.countryCode,
      country: data.country,
      role: 1,
      jobTitle: data.jobTitle,
      website: data.website
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
      officePhone: data.consultancyNumber
    };
    this._stepper.next();
  }

  public done(): void{
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
        this.ownerForm.patchValue({country: response.name, countryCode: response.code});
      }
    });
  }

  private initFormConsultancy(next: boolean): void{
    if(!this.consultancyForm){
      this.consultancyForm = this._formBuilder.group({
        company: ['', [Validators.required]],
        rfc: ['', [Validators.required]],
        address: ['', [Validators.required]],
        consultancyNumber: ['']
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
    this._api.createPerson(this._ownerInfo).subscribe(response => {
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
         this.exit(true);
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
      form.append('path', this._consultancyInfo.rfc);
      form.append('fileName', 'signature-'+this._consultancyInfo.id+'-'+new Date().getTime()+'.png');
      form.append('isImage', 'true');
      form.append('file', this.signature.blob);
      this._uploadFile.upload(form).subscribe(response => {
        this.signature.original = response.item;
        this.finishCreateConsultancy();
      });
    }else{
      this.finishCreateConsultancy();
    }
  }

  private finishCreateConsultancy(): void{
    if(this.userImage.original){
      this._ownerInfo.profileImage = this.userImage.original;
    }
    if(this.signature.original){
      this._ownerInfo.signature = this.signature.original;
    }
    if(this.userImage.original || this.signature.original){
      this.updatePerson(this._ownerInfo);
    }else{
      this.exit(true);
    }
  }

  public exit(snack: boolean): void{
    this._router.navigate(['/admin']).then(() => {
      if(snack){
        this._snackBar.openSnackBar('Consultora creada con éxito', 'OK', 3000);
      }
    });
  }

  private onErrorOccurred(): void{
    this._snackBar.openSnackBar('Ha ocurrido un error, por favor, intente de nuevo', 'OK', 3000);
  }

  public makeBusinessCard(): void{
    /*const data = {
      company: this._consultancyInfo.businessName,
      name: this._ownerInfo.name + ' ' + this._ownerInfo.lastName,
      workPosition: this._ownerInfo.jobTitle,
      phone: this._ownerInfo.countryCode + this._ownerInfo.phoneNumber,
      email: this._ownerInfo.email,
      website: this._ownerInfo.website
    };*/
    const data = {
      company: 'ALX Developer',
      name: 'Alejandro Lopez',
      workPosition: 'CEO and Developer',
      phone: '556518512',
      email: 'program.alopez@gmail.com',
      website: 'https://alx-developer.herokuapp.com'
    };
    this._api.businessCardService(data).subscribe(response => {
      const reader = new FileReader();
      reader.readAsDataURL(response);
      reader.onloadend = () => {
        this.testUrl = reader.result;
        console.log(reader.result);
      }
    });
  }

}
