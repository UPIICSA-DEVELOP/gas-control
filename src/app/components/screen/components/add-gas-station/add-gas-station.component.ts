/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {Router} from '@angular/router';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {Constants} from '@app/core/constants.core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {CountryCodeService} from '@app/core/components/country-code/country-code.service';
import {LocationOptions, LocationService} from '@app/core/components/location/location.service';
import {ModalStationService} from '@app/core/components/modal-station/modal-station.service';
import {UploadFileResponse} from '@app/core/components/upload-file/upload-file.component';

interface Person {
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

interface Document {
  id?: string;
  idStation: string;
  regulationType: number;
  type: number;
  file: any;
}

@Component({
  selector: 'app-add-gas-station',
  templateUrl: './add-gas-station.component.html',
  styleUrls: ['./add-gas-station.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        query('#create-station', style({opacity: 0, background: 'transparent'}), {optional: true}),
        query('#create-station', stagger('10ms', [
          animate('.2s ease-out', keyframes([
            style({opacity: 0, background: 'transparent', offset: 0}),
            style({opacity: .5, background: 'rgba(255, 255, 255, .5)', offset: 0.5}),
            style({opacity: 1, background: 'rgba(255, 255, 255, 1)', offset: 1.0}),
          ]))]), {optional: true})
      ]),
      transition(':leave', [
        query('#create-station', style({opacity: 1, background: 'rgba(255, 255, 255, 1)'}), {optional: true}),
        query('#create-station', stagger('10ms', [
          animate('.2s ease-in', keyframes([
            style({opacity: 1, background: 'rgba(255, 255, 255, 1)', offset: 0}),
            style({opacity: .5, background: 'rgba(255, 255, 255, .5)', offset: 0.5}),
            style({opacity: 0, background: 'transparent', offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])
  ],
  host: {'[@fadeInAnimation]': ''}
})
export class AddGasStationComponent implements OnInit {
  @ViewChild('phoneNumber') private _phoneNumberInput: ElementRef;
  @ViewChild('stepper') private _stepper;
  public step: number;
  public utils: any[];
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
  public bloodGroup: string[];
  public workShifts:any[];
  public tanks:any[];
  public dispensers:any[];
  public latLng: any;
  public stationType: any;
  public signature: any;
  public profileImage: any;
  public file:any;
  public listRepresentative: any;
  public listExist: boolean;
  public bloodType: string;
  private _formImage:FormData;
  private _formSignature: FormData;
  private _formFile: FormData;

  constructor(
    private _api: ApiService,
    private _apiLoaderService: ApiLoaderService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _signature: SignaturePadService,
    private _snackBarService: SnackBarService,
    private _uploadfileService: UploadFileService,
    private _countryCodeService: CountryCodeService,
    private _locationService: LocationService,
    private _modalStation: ModalStationService
  ) {
    this.listExist = false;
    this.bloodGroup = Constants.bloodGroup;
    this.addImage = false;
    this.addSign = false;
    this.newFile = false;
    this.workShifts = [];
    this.tanks = [];
    this.dispensers = [];
    this.protocol = 'http://';
  }

  ngOnInit() {
    this.initManagerForm();
    this.initStationForm();
    this.initRepresentativeForm();
    this.user = LocalStorageService.getItem(Constants.UserInSession);
    this.getUtilities();
    this.step = 0;
    this.dispensers.push({hoses: '', identifier: '', magna: false, premium: false, diesel: false});
    this.tanks.push({capacity: '', fuelType: 0});
    this.workShifts.push({start: '', end: ''});
    this.getListRepresentative();
  }

  private getUtilities(): void {
    this._api.getUtils().subscribe(response => {
      this.utils = response.item.groupIcons;
    });
  }

  public changeStep(step: any) {
    switch (step.previouslySelectedIndex) {
      case 0:
        this.step = step.selectedIndex;
        break;
      case 1:
        this.step = step.selectedIndex;
        break;
      case 2:
        this.step = step.selectedIndex;
        break;
      case 3:
        this.step = step.selectedIndex;
        break;
      case 4:
        this.step = step.selectedIndex;
        break;
      default:
        this.step = 1;
        break;
    }
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
    this.country='MX';
    this.protocol = 'http://';
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
          this.workShifts.push({start: '', end: ''});
          break;
        case 2:
          this.tanks.push({capacity: '', fuelType: 0});
          break;
        case 3:
          this.dispensers.push({hoses: '', identifier: '', magna: false, premium: false, diesel: false});
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

  public onLoadImage(event: UploadFileResponse): void{
    this.addImage = true;
    this.profileImage = event.url;
    this._formImage = new FormData();
    this._formImage.append('path', '');
    this._formImage.append('fileName', 'profile-'+this.user.id+'-'+new Date().getTime()+'.png');
    this._formImage.append('isImage', 'true');
    this._formImage.append('file', event.blob);
  }
  public onRemoveImage(): void {
    this.addImage = false;
    this.profileImage=undefined;
  }

  public onLoadFile(event: UploadFileResponse): void{
    this.newFile = true;
    this.file = event.file;
    this._formFile = new FormData();
    this._formFile.append('path', '');
    this._formFile.append('fileName', 'benzene-'+this.user.id+'-'+new Date().getTime()+'.pdf');
    this._formFile.append('file', event.file);
  }

  public changeSignature():void{
    this._signature.open().afterClosed().subscribe(response=>{
      switch (response.code) {
        case 1:
          this.addSign = true;
          this.signature = response.base64;
          this._formSignature = new FormData();
          this._formSignature.append('path', '');
          this._formSignature.append('fileName', 'signature-'+this.user.id+'-'+new Date().getTime()+'.png');
          this._formSignature.append('isImage', 'true');
          this._formSignature.append('file', response.blob);
          break;
      }
    })
  }

  public openListCountry(type: number): void {
    this._countryCodeService.openDialog().afterClosed().subscribe(response => {
      if (response) {
        this.country = response.iso;
        switch (type){
          case 1:
            this.newLegalRep.patchValue({
              country: response.name,
              code: response.code
            });
            break;
          case 2:
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

  private getListRepresentative():void{
    this._api.listPersonStationByConsultancy(LocalStorageService.getItem(Constants.UserInSession).refId).subscribe(response=>{
      switch (response.code){
        case 200:
          this.listExist = true;
          if (response.item){
            this.listRepresentative = response.item;
          }
          break;
      }
    })
  }

  public validateStation(data:any){
    if(this.newStation.invalid || !this.stationType){
      return;
    }else{
      this.station = {
        location: (this.latLng?this.latLng:undefined),
        address: data.address,
        businessName: data.businessName,
        crePermission: (data.crePermission?data.crePermission:undefined),
        email: data.email,
        name: data.email,
        phoneNumber: data.phoneNumber,
        workers: (data.workers?data.workers:undefined),
        type: this.stationType.id,
        observationWells:(data.observationWells?data.observationWells:undefined),
        monitoringWells:(data.monitoringWells?data.monitoringWells:undefined),
        workShifts: this.workShifts,
        dispensers: this.dispensers,
        fuelTanks: this.tanks,
        idConsultancy: LocalStorageService.getItem(Constants.UserInSession).refId,
        rfc: data.rfc,
        progress: 0
      };
      this.step=1;
      this._stepper.next();
    }
  }
  public selectLegalRep(person: any){

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
    this._uploadfileService.upload(form).subscribe(response=>{
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
        this.validateLegal(this.newLegalRep.value);
      }
    });
  }

  public validateLegal(data:any):void{
    if(this.newLegalRep.invalid){
      return;
    }else if(this.addImage){
      this.uploadGenericFile(1);
      return;
    }else if(this.addSign){
      this.uploadGenericFile(2);
      return;
    }else if(this.newFile){
      this.uploadGenericFile(3);
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
      this._stepper.next();
      this.step=2;
    }
  }

  public validateManager(data:any):void{
    if(this.newManager.invalid){
      return;
    }else if(this.addImage){
      this.uploadGenericFile(1);
      return;
    }else if(this.addSign){
      this.uploadGenericFile(2);
      return;
    }else if(this.newFile){
      this.uploadGenericFile(3);
      return;
    }else{
      data.code = data.code.replace('+','');
      this.manger = {
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
        role: 5,
      };
      this.mangerInformation = {
        id:'',
        contactKinship:(data.contactKinship?data.contactKinship:undefined),
        concatcPhone:(data.contactPhoneNumber?data.contactPhoneNumber:undefined),
        ssn: (data.ssn ?data.ssn:undefined),
        bloodType: this.bloodType,
        contactName:(data.contactName?data.contactName:undefined),
        benzene:(this.file?this.file:undefined)
      };
      this.step=4;
      this._stepper.next();
    }
  }

  public createLegal():void{
    if(this.legalRepresentative){
      this._api.createReferencedPerson(this.legalRepresentative).subscribe(response=>{
        switch (response.code){
          case 200:
            this.legalRepresentativeInformation.id = response.item.id;
            this.station.idLegalRepresentative = response.item.id;
            this.station.legalRepresentativeName = response.item.name + ' ' + response.item.lastName;
            this._api.savePersonInformation(this.legalRepresentativeInformation).subscribe(response=>{
              switch (response.code){
                case 200:
                  this.createManager();
                  break;
              }
            });
            break;
        }
      })
    }else{
      this.createManager();
    }
  }

  public createManager():void{
    this._api.createReferencedPerson(this.manger).subscribe(response=>{
      switch (response.code){
        case 200:
          this.mangerInformation.id = response.item.id;
          this.station.idLegalRepresentative = response.item.id;
          this.station.managerName = response.item.name + ' ' + response.item.lastName;
          this._api.savePersonInformation(this.mangerInformation).subscribe(response=>{
            switch (response.code){
              case 200:
                this.createStation();
                break;
            }
          });
          break;
      }
    })
  }

  private createStation():void{
    this._api.createStation(this.station).subscribe(response=>{
      switch (response.code){
        case 200:
          this._router.navigate(['/home'],{queryParams:{station: response.item.id}});
          break;
      }
    })
  }
}
