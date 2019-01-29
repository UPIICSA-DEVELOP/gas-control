/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Component, OnInit } from '@angular/core';
import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/core/services/api/api.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {LocationOptions, LocationService} from '@app/core/components/location/location.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {Constants} from '@app/core/constants.core';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';

@Component({
  selector: 'app-station-profile',
  templateUrl: './station-profile.component.html',
  styleUrls: ['./station-profile.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        query('#station-profile', style({ opacity: 0, background: 'transparent' }), {optional: true}),
        query('#station-profile', stagger('10ms', [
          animate('.2s ease-out', keyframes([
            style({opacity: 0, background: 'transparent', offset: 0}),
            style({opacity: .5, background: 'rgba(255, 255, 255, .5)', offset: 0.5}),
            style({opacity: 1, background: 'rgba(255, 255, 255, 1)',  offset: 1.0}),
          ]))]), {optional: true})
      ]),
      transition(':leave', [
        query('#station-profile', style({ opacity: 1, background: 'rgba(255, 255, 255, 1)' }), {optional: true}),
        query('#station-profile', stagger('10ms', [
          animate('.2s ease-in', keyframes([
            style({opacity: 1, background: 'rgba(255, 255, 255, 1)', offset: 0}),
            style({opacity: .5, background: 'rgba(255, 255, 255, .5)',  offset: 0.5}),
            style({opacity: 0, background: 'transparent',     offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])
  ],
  host: {'[@fadeInAnimation]': ''}
})
export class StationProfileComponent implements OnInit {
  public workShifts = [];
  public tanks = [];
  public dispensers = [];
  public stationForm: FormGroup;
  public station: any;
  public gasImage: string;
  public change: boolean = false;
  public latLng: any;
  public load: boolean;
  public gasName: string;
  private id: string;
  public user: any;
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _locationService: LocationService,
    private _snackBarService: SnackBarService,
    private _dialogService: DialogService,
    private _activatedRouter: ActivatedRoute
  ) { }

  ngOnInit() {
    this.user = LocalStorageService.getItem(Constants.UserInSession);
    if (this._activatedRouter.snapshot.queryParams.id) {
      this.id = this._activatedRouter.snapshot.queryParams.id;
      this.initForm();
    }
    this._apiLoader.getProgress().subscribe(load => {this.load = load; });
  }

  public detectChanges(): void{
    this.stationForm.valueChanges.subscribe(value => {
      this.change = true;
    })
  }

  public closeProfile():void{
    if (this.change){
      this._dialogService.confirmDialog(
        '¿Desea salir sin guardar cambios?',
        '',
        'ACEPTAR',
        'CANCELAR'
      ).afterClosed().subscribe(response=>{
        switch (response.code) {
          case 1:
            this._router.navigate(['/home']).then();
            break;
        }
      })
    } else {
      this._router.navigate(['/home']).then();
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
          this.stationForm.patchValue({
            address: response.location.address
          });
          break;
        default:
          break;
      }
    });
  }

  public getUtils(): void{
    this._api.getUtils().subscribe(response=>{
      switch (response.code) {
        case 200:
          this.gasName = response.item.groupIcons[this.station.type-1].name;
          this.gasImage = response.item.groupIcons[this.station.type-1].fileCS.thumbnail;
          break;
      }
    })
  }

  private initForm():void{
    this.stationForm = this._formBuilder.group({
      name:['',[Validators.required]],
      businessName:['',[Validators.required]],
      legalRepresentative:[{value:'', disabled: true},[]],
      rfc: ['',[Validators.required]],
      crePermission:['',[]],
      address:['',[Validators.required]],
      phoneNumber:['',[Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
      email:['', [Validators.required, Validators.email]],
      managerName:[{value:'', disabled: true},[]],
      workers:['',[]],
      monitoringWells:['',[]],
      observationWells:['',[]]
    });
    this.getStation();
  }

  private getStation():void{
    this._api.getStation(this.id).subscribe(response=>{
      switch (response.code) {
        case 200:
          this.station = response.item;
          if (this.station.dispensers) {
            this.dispensers = this.station.dispensers;
          }else{
            this.dispensers.push({hoses: '', identifier: '', magna: false, premium: false, diesel: false});
          }
          if (this.station.fuelTanks){
            this.tanks = this.station.fuelTanks;
          }else{
            this.tanks.push({capacity: '', fuelType: 0});
          }
          if (this.station.workShifts){
            this.workShifts = this.station.workShifts;
          }else{
            this.workShifts.push({start: '', end: ''});
          }
          if (this.station.location) {
            this.latLng = {
              latitude: this.station.location.latitude,
              longitude: this.station.location.longitude
            }
          }
          this.stationForm.patchValue({
            name:this.station.name,
            businessName:this.station.businessName,
            rfc: this.station.rfc,
            crePermission:this.station.crePermission,
            address:this.station.address,
            phoneNumber:this.station.phoneNumber,
            email:this.station.email,
            managerName:this.station.managerName,
            workers:this.station.workers,
            monitoringWells:this.station.monitoringWells,
            observationWells: this.station.observationWells,
            legalRepresentative: this.station.legalRepresentativeName
          });
          this.getUtils();
          if (this.user.role===6 || this.user.role===7){
            this.stationForm.disable();
          }
          this.detectChanges();
          break;
        default:
          break;
      }
    });
  }

  public saveStationInformation(data: any): void{
    if (this.stationForm.invalid) {
      return;
    }
    this.station.name = data.name;
    this.station.businessName = data.businessName;
    this.station.rfc = data.rfc;
    this.station.address = data.address;
    this.station.phoneNumber = data.phoneNumber;
    this.station.email = data.email;
    this.station.workers = data.workers;
    if (this.latLng) {
      this.station.location.latitude = (this.latLng.latitude?this.latLng.latitude:19.432675);
      this.station.location.longitude = (this.latLng.longitude? this.latLng.longitude: -99.133461);
    }
    this.station.workShifts = this.workShifts;
    this.station.fuelTanks = this.tanks;
    this.station.dispensers = this.dispensers;
   this._api.updateStation(this.station).subscribe(response => {
      switch (response.code) {
        case 200:
          this.change = false;
          this._snackBarService.openSnackBar('Información actualizada','OK',3000);
          this._router.navigate(['/home'],{queryParams:{station: this.station.id}});
          break;
        default:
          this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
          break;
      }
    })
  }

  public addRemoveTurn(remove: boolean, type: number, index?: number): void{
    if(!remove){
      switch (type) {
        case 1:
          this.workShifts.push({start: '0000', end: '1200'});
          break;
        case 2:
          this.tanks.push({capacity: 0, fuelType: 1});
          break;
        case 3:
          this.dispensers.push({hoses: 0, identifier: '', magna: false, premium: false, diesel: false});
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
    if (this.station.workShifts.length != this.workShifts.length){
      this.change=true;
    }
    if (this.station.dispensers.length != this.dispensers) {
      this.change=true;
    }
    if (this.station.fuelTanks.length != this.tanks) {
      this.change=true;
    }
  }

}
