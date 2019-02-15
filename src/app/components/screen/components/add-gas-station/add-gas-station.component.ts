/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {Router} from '@angular/router';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {Constants} from '@app/core/constants.core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {CountryCodeService} from '@app/core/components/country-code/country-code.service';
import {LocationOptions, LocationService} from '@app/core/components/location/location.service';
import {ModalStationService} from '@app/components/screen/components/modal-station/modal-station.service';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {PdfVisorOptions, PdfVisorService} from '@app/core/components/pdf-visor/pdf-visor.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UtilitiesService} from '@app/core/utilities/utilities.service';

interface Person {
  id?: string;
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
  signature?: any;
  profileImage?: any;
}

interface Station {
  id?: string;
  businessName: string;
  rfc: string;
  crePermission?: string;
  name: string;
  email: string;
  address: string;
  location: any;
  phoneNumber: string;
  workers: string;
  idConsultancy: string;
  progress: number;
  monitoringWells: number;
  observationWells: number;
  type: number;
  idManager?: string;
  idLegalRepresentative?: string;
  managerName?: string;
  legalRepresentativeName?: string;
  workShifts?: any;
  fuelTanks?: any;
  dispensers?: any;
}

interface PersonInformation {
  id: string;
  bloodType?: string;
  concatcPhone?: string;
  contactKinship?: string;
  contactName?: string;
  ssn?: string;
  benzene?: any;
}

interface Task {
  creationDate: number;
  editedTasks: any;
  stationId: string;
  status: number;
  progress: number;
  startDate: number;
}

@Component({
  selector: 'app-add-gas-station',
  templateUrl: './add-gas-station.component.html',
  styleUrls: ['./add-gas-station.component.scss']
})
export class AddGasStationComponent implements OnInit {
  @ViewChild('phoneNumber') private _phoneNumberInput: ElementRef;
  @ViewChild('modalScroll') private _modalScroll: ElementRef;
  public step: number;
  public disableClose: boolean;
  public utils: any[];
  public tasks: any[];
  public manger: Person;
  public mangerInformation: PersonInformation;
  public legalRepresentative: Person;
  public legalRepresentativeInformation: PersonInformation;
  public station: Station;
  public user: any;
  public newManager: FormGroup;
  public newLegalRep: FormGroup;
  public newStation: FormGroup;
  public protocol: string;
  public country: string;
  public addImage: boolean;
  public addSign: boolean;
  public newFile: boolean;
  public protocolTwo: string;
  public countryTwo: string;
  public addImageTwo: boolean;
  public addSignTwo: boolean;
  public newFileTwo: boolean;
  public bloodGroup: string[];
  public workShifts:any[];
  public tanks:any[];
  public dispensers:any[];
  public calendar:any[];
  public latLng: any;
  public stationType: any;
  public signature: any;
  public profileImage: any;
  public file:any;
  public signatureTwo: any;
  public profileImageTwo: any;
  public fileTwo: any;
  public listRepresentative: any;
  public listExist: boolean;
  public bloodType: string;
  public bloodTypeTwo: string;
  public load: boolean;
  public startDate: Date;
  public tomorrow: Date;
  public zone: string[];
  public frequency: string[];
  public priority: string[];
  public capacities: any[];
  public legalId: string;
  public managerId: string;
  public legalName: string;
  public managerName: string;
  private _formImage:FormData;
  private _formSignature: FormData;
  private _formFile: FormData;
  private _formImageTwo:FormData;
  private _formSignatureTwo: FormData;
  private _formFileTwo: FormData;
  private _stationId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _api: ApiService,
    private _apiLoaderService: ApiLoaderService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _signature: SignaturePadService,
    private _snackBarService: SnackBarService,
    private _uploadFileService: UploadFileService,
    private _countryCodeService: CountryCodeService,
    private _locationService: LocationService,
    private _modalStation: ModalStationService,
    private _dialogService: DialogService,
    private _pdfVisor: PdfVisorService,
    private _dialogRef: MatDialogRef<AddGasStationComponent>
  ) {
    this.listExist = true;
    this.capacities = Constants.Capacities;
    this.bloodGroup = Constants.bloodGroup;
    this.frequency = Constants.Frecuency;
    this.priority = Constants.Level;
    this.zone = Constants.Zones;
    this.addImage = false;
    this.addSign = false;
    this.newFile = false;
    this.addImageTwo = false;
    this.addSignTwo = false;
    this.newFileTwo = false;
    this.workShifts = [];
    this.tanks = [];
    this.dispensers = [];
    this.calendar=[];
    this.countryTwo = 'MX';
    this.countryTwo = 'MX';
    this.protocol = 'http://';
    this.protocolTwo = 'http://';
    this.startDate = new Date();
    this.tomorrow = new Date(this.startDate.getTime() + (24 * 60 * 60 * 1000));
    this.step = this._data?this._data.stepActive:0;
    this.disableClose = this._data?this._data.disableClose:false;
    this._stationId = this._data?this._data.stationId:null;
  }

  ngOnInit() {
    this.initCalendar();
    this.initManagerForm();
    this.initStationForm();
    this.initRepresentativeForm();
    this.user = LocalStorageService.getItem(Constants.UserInSession);
    this.getUtilities();
    this.dispensers.push({hoses: undefined, identifier: undefined, magna: false, premium: false, diesel: false});
    this.tanks.push({capacity: undefined, fuelType: undefined});
    this.workShifts.push({start: undefined, end: undefined});
    this.getListRepresentative();
    this._apiLoaderService.getProgress().subscribe(load=>{this.load = load});
  }

  private getUtilities(): void {
    this._api.getUtils().subscribe(response => {
      if (response){
        this.utils = response.item.groupIcons;
        this.tasks = response.item.taskTemplates;
        this.tasks = this.tasks.filter(task => {
          if(task.editable){
            return task;
          }
        });
      }
    });
  }

  private initStationForm(): void {
    this.newStation = this._formBuilder.group({
      businessName: ['', [Validators.required]],
      rfc: ['', [Validators.required]],
      crePermission: ['', []],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
      legalRepresentative:['',[Validators.required]],
      manager:['',[Validators.required]],
      workers: ['', []],
      monitoringWells: ['', []],
      observationWells: ['', []]
    });
  }

  private initManagerForm(): void {
    this.newManager = this._formBuilder.group({
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
    this.countryTwo = 'MX';
    this.protocolTwo = 'http://';
  }

  private initRepresentativeForm():void{
    this.newLegalRep = this._formBuilder.group({
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
    this.country='MX';
    this.protocol = 'http://';
  }

  public addRemoveTurn(remove: boolean, type: number, index?: number): void{
    if(!remove){
      switch (type) {
        case 1:
          this.workShifts.push({start: undefined, end: undefined});
          break;
        case 2:
          this.tanks.push({capacity: undefined, fuelType: undefined});
          break;
        case 3:
          this.dispensers.push({hoses: undefined, identifier: undefined, magna: false, premium: false, diesel: false});
          break;
      }
    }else {
      switch (type) {
        case 1:
          this.workShifts.splice(index, 1);
          break;
        case 2:
          this.tanks.splice(index, 1);
          break;
        case 3:
          this.dispensers.splice(index, 1);
          break;
      }
    }
  }

  public openLocation():void{
    let latLng: LocationOptions = {
      lat: 19.432675,
      lng: -99.133461
    };
    if (this.latLng){
      latLng = {
        lat: this.latLng.latitude,
        lng: this.latLng.longitude
      }
    }
    this._locationService.open(latLng).afterClosed().subscribe(response=>{
      switch (response.code) {
        case 1:
          this.latLng ={
            latitude: response.location.lat,
            longitude: response.location.lng
          };
          this.newStation.patchValue({
            address: response.location.address
          });
          break;
        default:
          break;
      }
    });
  }

  public openModal():void{
    this._modalStation.open(this.utils).afterClosed().subscribe(response=>{
      switch (response.code){
        case 1:
          this.stationType=response.data;
          break;
      }
    });
  }

  public onLoadImage(event: UploadFileResponse, isManager?: boolean): void{
    if (isManager){
      this.addImageTwo = true;
      this.profileImageTwo = event.url;
      this._formImage = new FormData();
      this._formImage.append('path', '');
      this._formImage.append('fileName', 'profile-'+this.user.id+'-'+new Date().getTime()+'.png');
      this._formImage.append('isImage', 'true');
      this._formImage.append('file', event.blob);
    }else{
      this.addImage = true;
      this.profileImage = event.url;
      this._formImageTwo = new FormData();
      this._formImageTwo.append('path', '');
      this._formImageTwo.append('fileName', 'profile-'+this.user.id+'-'+new Date().getTime()+'.png');
      this._formImageTwo.append('isImage', 'true');
      this._formImageTwo.append('file', event.blob);
    }
  }

  public onRemoveImage(isManager?: boolean): void {
    if (isManager){
      this.addImageTwo = false;
      this.profileImageTwo = undefined;
    }else{
      this.addImage = false;
      this.profileImage=undefined;
    }
  }

  public onLoadFile(event: UploadFileResponse, isManager?:boolean): void{
    if (isManager){
      this.newFileTwo = true;
      this.fileTwo = event.file;
      this._formFileTwo = new FormData();
      this._formFileTwo.append('path', '');
      this._formFileTwo.append('fileName', 'benzene-'+this.user.id+'-'+new Date().getTime()+'.pdf');
      this._formFileTwo.append('file', event.file);
    }else{
      this.newFile = true;
      this.file = event.file;
      this._formFile = new FormData();
      this._formFile.append('path', '');
      this._formFile.append('fileName', 'benzene-'+this.user.id+'-'+new Date().getTime()+'.pdf');
      this._formFile.append('file', event.file);
    }
  }

  public changeSignature(isManager?:boolean):void{
    this._signature.open().afterClosed().subscribe(response=>{
      switch (response.code) {
        case 1:
          if (isManager){
            this.addSignTwo = true;
            this.signatureTwo = response.base64;
            this._formSignatureTwo = new FormData();
            this._formSignatureTwo.append('path', '');
            this._formSignatureTwo.append('fileName', 'signature-'+this.user.id+'-'+new Date().getTime()+'.png');
            this._formSignatureTwo.append('isImage', 'true');
            this._formSignatureTwo.append('file', response.blob);
          }else{
            this.addSign = true;
            this.signature = response.base64;
            this._formSignature = new FormData();
            this._formSignature.append('path', '');
            this._formSignature.append('fileName', 'signature-'+this.user.id+'-'+new Date().getTime()+'.png');
            this._formSignature.append('isImage', 'true');
            this._formSignature.append('file', response.blob);
          }
          break;
      }
    })
  }

  public openListCountry(type: number): void {
    this._countryCodeService.openDialog().afterClosed().subscribe(response => {
      if (response) {
        switch (type){
          case 1:
            this.country = response.iso;
            this.newLegalRep.patchValue({
              country: response.name,
              code: response.code
            });
            break;
          case 2:
            this.countryTwo = response.iso;
            this.newManager.patchValue({
              country: response.name,
              code: response.code
            });
            break;
        }
        this._phoneNumberInput.nativeElement.focus();
      }
    });
  }

  public getListRepresentative():void{
    this._api.listPersonStationByConsultancy(LocalStorageService.getItem(Constants.UserInSession).refId).subscribe(response=>{
      switch (response.code){
        case 200:
          this.listExist = true;
          if (response.items){
            this.listRepresentative = response.items;
          }else{
            this.listRepresentative = [];
          }
          break;
      }
    })
  }

  public validateStation(data:any){
    if(this.newStation.invalid || !this.stationType){
      if(!this.stationType){
        this._snackBarService.openSnackBar('Asigne la imagen del grupo gasolinero correspondiente','OK', 3000);
        return;
      }
      return;
    }else if(!this.validateStationArrays()){
      return;
    }else{
      this.clearStationArray();
      this.station = {
        location: (this.latLng?this.latLng:undefined),
        address: data.address,
        businessName: data.businessName,
        crePermission: (data.crePermission?data.crePermission:undefined),
        email: data.email,
        name: data.name,
        phoneNumber: data.phoneNumber,
        workers: (data.workers?data.workers:undefined),
        type: this.stationType.id,
        observationWells:(data.observationWells?data.observationWells:undefined),
        monitoringWells:(data.monitoringWells?data.monitoringWells:undefined),
        workShifts: (this.workShifts.length>0? this.workShifts:undefined),
        dispensers: (this.dispensers.length>0?this.dispensers:undefined),
        fuelTanks: (this.tanks.length>0?this.tanks:undefined),
        idConsultancy: LocalStorageService.getItem(Constants.UserInSession).refId,
        rfc: data.rfc,
        progress: 0,
        idLegalRepresentative: this.legalId,
        legalRepresentativeName: this.legalName,
        idManager: this.managerId,
        managerName: this.managerName
      };
      this.createStation();
    }
  }

  public selectLegalRep(person: any){
    this.legalId = person.id;
    this.legalName = person.name+' '+ person.lastName;
    this.newStation.patchValue({
      legalRepresentative: this.legalName
    });
    this._modalScroll.nativeElement.scroll({top: 0});
    this.step = 0
  }

  public uploadGenericFile(type:number, isManager?:boolean): void{
    let form: FormData;
    if(isManager){
      switch (type){
        case 1:
          form = this._formImageTwo;
          this.addImageTwo = false;
          break;
        case 2:
          form = this._formSignatureTwo;
          this.addSignTwo = false;
          break;
        case 3:
          form = this._formFileTwo;
          this.newFileTwo = false;
          break;
      }
    }else{
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
    }
    this._uploadFileService.upload(form).subscribe(response=>{
      if(response){
        if (isManager){
          switch (type){
            case 1:
              this.profileImageTwo = {
                blobName: response.item.blobName || '',
                thumbnail: response.item.thumbnail || ''
              };
              break;
            case 2:
              this.signatureTwo = {
                blobName: response.item.blobName || '',
                thumbnail: response.item.thumbnail || ''
              };
              break;
            case 3:
              this.fileTwo = {
                blobName: response.item.blobName || '',
                thumbnail: response.item.thumbnail || ''
              };
              break;
          }
        }else {
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
        }
        if(isManager){
          this.validateManager(this.newManager.value);
        }else{
          this.validateLegal(this.newLegalRep.value);
        }
      }
    });
  }

  public validateLegal(data:any):void{
    if(this.newLegalRep.invalid){
      return;
    }else if(this.addImage){
      this.uploadGenericFile(1, false);
      return;
    }else if(this.addSign){
      this.uploadGenericFile(2, false);
      return;
    }else if(this.newFile){
      this.uploadGenericFile(3, false);
      return;
    }else{
      data.code = data.code.replace('+','');
      this.legalRepresentative = {
        refId: LocalStorageService.getItem(Constants.UserInSession).refId,
        signature: (this.signature?this.signature:undefined),
        profileImage:(this.profileImage?this.profileImage:undefined),
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        countryCode: data.code,
        country: this.country,
        website: (data.website?this.protocol+data.website: undefined),
        jobTitle: data.jobTitle,
        role: 4,
      };
      this.legalRepresentativeInformation = {
        id:'',
        contactKinship:(data.contactKinship?data.contactKinship:undefined),
        concatcPhone:(data.contactPhoneNumber?data.contactPhoneNumber:undefined),
        ssn: (data.ssn ?data.ssn:undefined),
        bloodType: this.bloodType,
        contactName:(data.contactName?data.contactName:undefined),
        benzene:(this.file?this.file:undefined)
      };
      this.createLegal();
    }
  }

  public validateManager(data:any):void{
    if(this.newManager.invalid){
      return;
    }else if(this.addImageTwo){
      this.uploadGenericFile(1, true);
      return;
    }else if(this.addSignTwo){
      this.uploadGenericFile(2, true);
      return;
    }else if(this.newFileTwo){
      this.uploadGenericFile(3, true);
      return;
    }else{
      data.code = data.code.replace('+','');
      this.manger = {
        refId: LocalStorageService.getItem(Constants.UserInSession).refId,
        signature: (this.signatureTwo?this.signatureTwo:undefined),
        profileImage:(this.profileImageTwo?this.profileImageTwo:undefined),
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        countryCode: data.code,
        country: this.countryTwo,
        website: (data.website?this.protocolTwo+data.website: undefined),
        jobTitle: data.jobTitle,
        role: 5,
      };
      this.mangerInformation = {
        id:'',
        contactKinship:(data.contactKinship?data.contactKinship:undefined),
        concatcPhone:(data.contactPhoneNumber?data.contactPhoneNumber:undefined),
        ssn: (data.ssn ?data.ssn:undefined),
        bloodType: this.bloodTypeTwo,
        contactName:(data.contactName?data.contactName:undefined),
        benzene:(this.fileTwo?this.fileTwo:undefined)
      };
      this.createManager();
    }
  }

  public createLegal():void{
    if(!this.legalRepresentative.id){
      this._api.createReferencedPerson(this.legalRepresentative).subscribe(response=>{
        switch (response.code){
          case 200:
            this.legalRepresentative.id = response.item.id;
            this.legalRepresentativeInformation.id = response.item.id;
            this.legalId = response.item.id;
            this.legalName = response.item.name + ' ' + response.item.lastName;
            this._api.savePersonInformation(this.legalRepresentativeInformation).subscribe(response=>{
              switch (response.code){
                case 200:
                  this.newStation.patchValue({
                    legalRepresentative: this.legalName
                  });
                  this._dialogService.alertDialog(
                    'Información',
                    'Hemos enviado un email de validación de cuenta a: ' + this.legalRepresentative.email,
                    'ACEPTAR').afterClosed().subscribe(response=>{
                      this.step = 0; this.listExist = true;
                      this._modalScroll.nativeElement.scroll({top: 0});
                    });
                  break;
              }
            });
            break;
        }
      })
    }else{
      this._api.updatePersonWithDifferentEmail(this.legalRepresentative).subscribe(response =>{
        switch (response.code){
          case 200:
            this.legalName = response.item.name + ' ' + response.item.lastName;
            this._api.savePersonInformation(this.legalRepresentativeInformation).subscribe(response=>{
              switch (response.code){
                case 200:
                  this.newStation.patchValue({
                    legalRepresentative: this.legalName
                  });
                  this._dialogService.alertDialog(
                    'Información',
                    'Hemos enviado un email de validación de cuenta a: ' + this.legalRepresentative.email,
                    'ACEPTAR').afterClosed().subscribe(response=>{
                      this.step = 0; this.listExist = true;
                      this._modalScroll.nativeElement.scroll({top: 0});
                    });
                  break;
              }
            });
            break;
        }
      });
    }
  }

  public createManager():void{
    if (!this.manger.id){
      this._api.createReferencedPerson(this.manger).subscribe(response=>{
        switch (response.code){
          case 200:
            this.manger.id = response.item.id;
            this.mangerInformation.id = response.item.id;
            this.managerId = response.item.id;
            this.managerName = response.item.name + ' ' + response.item.lastName;
            this._api.savePersonInformation(this.mangerInformation).subscribe(response=>{
              switch (response.code){
                case 200:
                  this.newStation.patchValue({
                    manager: this.managerName
                  });
                  this._dialogService.alertDialog(
                    'Información',
                    'Hemos enviado un email de validación de cuenta a: ' + this.manger.email,
                    'ACEPTAR').afterClosed().subscribe(response=>{
                      this.step = 0;
                      this._modalScroll.nativeElement.scroll({top: 0});
                    });
                  break;
              }
            });
            break;
        }
      });
    }else{
      this._api.updatePersonWithDifferentEmail(this.manger).subscribe(response=>{
        switch (response.code){
          case 200:
            this.managerName = response.item.name + ' ' + response.item.lastName;
            this._api.savePersonInformation(this.mangerInformation).subscribe(response=>{
              switch (response.code){
                case 200:
                  this.newStation.patchValue({
                    manager: this.managerName
                  });
                  this._dialogService.alertDialog(
                    'Información',
                    'Hemos enviado un email de validación de cuenta a: ' + this.manger.email,
                    'ACEPTAR').afterClosed().subscribe(response=>{
                      this.step = 0;
                      this._modalScroll.nativeElement.scroll({top: 0});
                    });
                  break;
              }
            });
             break;
        }
      })
    }
  }

  private createStation():void{
    this._api.createStation(this.station).subscribe(response=>{
      switch (response.code){
        case 200:
          this.station.id = response.item.id;
          this.step = 3;
          break;
        case 470:
          this._snackBarService.openSnackBar('Ya existe una estación con esta información', 'OK',3000);
          break;
        default:
          break;
      }
    })
  }

  public validateEmailExist(isManager: boolean):void{
    let email: any = {
      email: ''
    };
    if (isManager){
      email.email = this.newManager.controls['email'].value;
    }else{
      email.email = this.newLegalRep.controls['email'].value;
    }
    this._api.personExists(email).subscribe(response=>{
      switch (response.code){
        case 200:
          if (isManager){
            if(this.manger){
              if(email.email !== this.manger.email){
                this._dialogService.alertDialog('Información',
                  'El Email que está tratando de usar ya ha sido asociado a un usuario',
                  'ACEPTAR');
                this.newManager.controls['email'].setErrors({emailUsed: true});
              }
            }else{
              this._dialogService.alertDialog('Información',
                'El Email que está tratando de usar ya ha sido asociado a un usuario',
                'ACEPTAR');
              this.newManager.controls['email'].setErrors({emailUsed: true});
            }
          }else{
            if(this.legalRepresentative){
              if(email.email !== this.legalRepresentative.email){
                this._dialogService.alertDialog('Información',
                  'El Email que está tratando de usar ya ha sido asociado a un usuario',
                  'ACEPTAR');
                this.newLegalRep.controls['email'].setErrors({emailUsed: true});
              }
            }else{
              this._dialogService.alertDialog('Información',
                'El Email que está tratando de usar ya ha sido asociado a un usuario',
                'ACEPTAR');
              this.newLegalRep.controls['email'].setErrors({emailUsed: true});
            }
          }
          break;
        default:
          break;
      }
    })
  }

  public closeAddStation():void{
    switch (this.step){
      case 0:
        this._dialogService.confirmDialog(
          '¿Desea salir sin guardar cambios?',
          '',
          'ACEPTAR',
          'CANCELAR'
        ).afterClosed().subscribe(response=>{
          switch (response.code){
            case 1:
              this._dialogRef.close();
              break;
          }
        });
        break;
      case 1:
        this._modalScroll.nativeElement.scroll({top: 0});
          this.step = 0;
        break;
      case 2:
        this._modalScroll.nativeElement.scroll({top: 0});
        this.step = 0;
         break;
      case 3:
        this._router.navigate(['/home'],{queryParams:{station: this._stationId?this._stationId:this.station.id}}).then(()=>{
          this._dialogRef.close();
        });
         break;
    }
  }

  private createStationTasks(stationId: string):void{
    const date = new Date();
    const today = UtilitiesService.createPersonalTimeStamp(date).timeStamp;
    let editedTasks: any[] = [];
    let copyCalendar: any[] = Object.assign([], this.calendar);
    for (let d=0;d<copyCalendar.length; d++){
      copyCalendar[d] = UtilitiesService.createPersonalTimeStamp(copyCalendar[d]).timeStamp;
      editedTasks.push({startDate: copyCalendar[d], differenceOfDays:(copyCalendar[d]-today), type: this.tasks[d].id});
    }
    let task: Task = {
      creationDate: today,
      stationId: stationId,
      progress: 0,
      status: 0,
      editedTasks: editedTasks,
      startDate: today
    };
    this._api.createStationTask(task).subscribe(response=>{
      switch (response.code){
        case 200:
          LocalStorageService.removeItem(Constants.NotCalendarTask);
          this._dialogRef.close();
          break;
      }
    });
  }

  public validateCompleteCalendar():void{
    for(let i = 0; i<this.calendar.length; i++){
      if(!this.calendar[i]){
        this._snackBarService.openSnackBar('Para continuar es necesario programar todas las tareas','OK', 3000);
        return;
      }
    }
    this.createStationTasks(this._stationId?this._stationId:this.station.id);
  }

  public openStudy(isManager: boolean):void{
    let options: PdfVisorOptions;
    if (!isManager){
      options={
        url: this.file,
        file: this.file,
        notIsUrl: this.newFile
      }
    }else{
      options={
        url: this.fileTwo,
        file: this.fileTwo,
        notIsUrl: this.newFileTwo
      }
    }
    this._pdfVisor.open(options);
  }

  public openPersonForm(isManager: boolean):void{
    this._modalScroll.nativeElement.scroll({top: 0});
    if(isManager){
      this.step = 2;
    }else{
      this.getListRepresentative();
      this.step=1;
    }
  }

  private validateStationArrays():boolean{
    for (let i = 0; i<this.workShifts.length; i++){
      if((this.workShifts[i].start && !this.workShifts[i].end) || (!this.workShifts[i].start && this.workShifts[i].end)){
        this._snackBarService.openSnackBar('Complete los campos para el turno ' + (i+1),'OK',3000);
        return false;
      }
    }
    for(let j = 0; j<this.tanks.length; j++){
      if((!this.tanks[j].capacity && this.tanks[j].fuelType) || (this.tanks[j].capacity && !this.tanks[j].fuelType)){
        this._snackBarService.openSnackBar('Complete los campos para el tanque ' + (j+1),'OK',3000);
        return false;
      }
    }
    for (let k = 0; k<this.dispensers.length; k++){
      if((this.dispensers[k].hoses || this.dispensers[k].identifier)&&(this.dispensers[k].magna === false && this.dispensers[k].premium === false && this.dispensers[k].diesel === false)){
        this._snackBarService.openSnackBar('Complete los campos para el dispensario ' + (k+1),'OK',3000);
        return false;
      }else if((!this.dispensers[k].hoses || !this.dispensers[k].identifier)&&(this.dispensers[k].magna === true || this.dispensers[k].premium === true || this.dispensers[k].diesel === true)){
        this._snackBarService.openSnackBar('Complete los campos para el dispensario ' + (k+1),'OK',3000);
        return false;
      }
    }
    return true;
  }

  private clearStationArray():void{
    for (let i = 0; i<this.workShifts.length; i++){
      if(!this.workShifts[i].start && !this.workShifts[i].end){
        this.workShifts.splice(i, 1);
      }
    }
    for(let j = 0; j<this.tanks.length; j++){
      if(!this.tanks[j].capacity && !this.tanks[j].fuelType){
        this.tanks.splice(j,1);
      }
    }
    for (let k = 0; k<this.dispensers.length; k++){
      if(!this.dispensers[k].hoses && !this.dispensers[k].identifier && this.dispensers[k].magna === false && this.dispensers[k].premium === false && this.dispensers[k].diesel === false){
        this.dispensers.splice(k, 1);
      }
    }
  }

  private initCalendar():void{
    for (let i =0; i<26; i++){
      this.calendar.push(undefined);
    }
  }

  public blockEnd():boolean{
    for(let i = 0; i<this.calendar.length; i++){
      if(!this.calendar[i]){
        return true;
      }
    }
    return false;
  }
}
