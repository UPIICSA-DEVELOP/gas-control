/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {Subscription} from 'rxjs';
import {Dispensers, FuelTanks, GasStation, WorkShifts} from '@app/core/interfaces/interfaces';

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
export class StationProfileComponent implements OnInit, OnDestroy {
  public workShifts:WorkShifts[];
  public tanks:FuelTanks[];
  public dispensers:Dispensers[];
  public stationForm: FormGroup;
  public station: GasStation;
  public load: boolean;
  public utils: any;
  public user: any;
  public yearSelector: number[];
  private _latLng: any;
  private _change: boolean;
  private _subscriptionLoader: Subscription;
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
    private _locationService: LocationService,
    private _snackBarService: SnackBarService,
    private _dialogService: DialogService,
    private _activatedRouter: ActivatedRoute
  ) {
    this.yearSelector = [];
    this.workShifts = [];
    this.tanks = [];
    this.dispensers = [];
    this.user = LocalStorageService.getItem(Constants.UserInSession);
  }

  ngOnInit() {
    this.initYears();
    this.initForm();
    this.getStation(this._activatedRouter.snapshot.data.data.station);
    this.getUtils(this._activatedRouter.snapshot.data.data.utils);
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {this.load = load;});
  }

  ngOnDestroy(): void{
    this._subscriptionLoader.unsubscribe();
  }

  public detectChanges(): void{
    this.stationForm.valueChanges.subscribe(() => {
      this._change = true;
    })
  }

  public closeProfile():void{
    if (this._change){
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
      });
    }else{
      this._router.navigate(['/home']).then();
    }
  }

  public openLocation():void{
    let latLng: LocationOptions = {
      lat: 19.432675,
      lng: -99.133461
    };
    if (this._latLng){
      latLng = {
        lat: this._latLng.latitude,
        lng: this._latLng.longitude
      }
    }
    this._locationService.open(latLng).afterClosed().subscribe(response=>{
      switch (response.code) {
        case 1:
          this._latLng ={
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

  public getUtils(response: any): void{
    switch (response.code) {
      case 200:
        this.utils = response.item;
        break;
    }
  }

  private initForm():void{
    this.stationForm = this._formBuilder.group({
      name:['',[Validators.required]],
      businessName:['',[Validators.required]],
      legalRepresentative:[{value:'', disabled: true},[]],
      rfc: [{value: '', disabled: true},[Validators.required]],
      crePermission:['',[]],
      address:['',[Validators.required]],
      phoneNumber:['',[Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
      email:['', [Validators.required, Validators.email]],
      /*managerName:[{value:'', disabled: true},[]],*/
      vrs: [{value: false, disabled: true}, []],
      workers:['',[]],
      monitoringWells:['',[]],
      observationWells:['',[]]
    });
  }

  private getStation(response: any):void{
    switch (response.code) {
      case 200:
        this.station = {
          address: response.item.address,
          businessName: response.item.businessName,
          complete: response.item.complete,
          crePermission: response.item.crePermission,
          dispensers: response.item.dispensers,
          doneTasks: response.item.doneTasks,
          email: response.item.email,
          endPaymentDate: response.item.endPaymentDate,
          folio: response.item.folio,
          fuelTanks: response.item.fuelTanks,
          id: response.item.id,
          idConsultancy: response.item.idConsultancy,
          idLegalRepresentative: response.item.idLegalRepresentative,
          legalRepresentativeName: response.item.legalRepresentativeName,
          location: response.item.location,
          monitoringWells: response.item.monitoringWells,
          name: response.item.name,
          observationWells: response.item.observationWells,
          paymentDate: response.item.paymentDate,
          phoneNumber: response.item.phoneNumber,
          progress: response.item.progress,
          rfc: response.item.rfc,
          stationTaskId: response.item.stationTaskId,
          totalTasks: response.item.totalTasks,
          type: response.item.type,
          vapourRecoverySystem: response.item.vapourRecoverySystem,
          workShifts: response.item.workShifts,
          workers: response.item.workers
        };
        if (this.station.dispensers) {
          this.dispensers = Object.assign([], this.station.dispensers);
        }else{
          this.dispensers.push({hoses: undefined, identifier: undefined, magna: false, premium: false, diesel: false});
        }
        if (this.station.fuelTanks){
          this.tanks = Object.assign([], this.station.fuelTanks);
        }else{
          this.tanks.push({capacity: undefined, fuelType: undefined, year: undefined});
        }
        if (this.station.workShifts){
          this.workShifts = Object.assign([],this.station.workShifts);
        }else{
          this.workShifts.push({start: undefined, end: undefined});
        }
        if (this.station.location) {
          this._latLng = {
            latitude: this.station.location.latitude,
            longitude: this.station.location.longitude
          }
        }
        this.patchForm();
        break;
      default:
        this._snackBarService.openSnackBar('No se ha podido acceder, intente más tarde','OK',3000);
        this._router.navigate(['/home']).then();
        break;
    }
  }

  private patchForm():void{
    this.stationForm.patchValue({
      name:this.station.name,
      businessName:this.station.businessName,
      rfc: this.station.rfc,
      crePermission:this.station.crePermission,
      address:this.station.address,
      phoneNumber:this.station.phoneNumber,
      email:this.station.email,
      /*managerName:this.station.managerName,*/
      vrs: this.station.vapourRecoverySystem,
      workers:this.station.workers,
      monitoringWells:this.station.monitoringWells,
      observationWells: this.station.observationWells,
      legalRepresentative: this.station.legalRepresentativeName
    });
    if (this.user.role===6){
      this.stationForm.disable();
    }
    this.detectChanges();
  }

  public saveStationInformation(data: any): void{
    if (this.stationForm.invalid) {
      return;
    }
    if(!this.validateStationArrays()){
      return;
    }
    this.station.crePermission = (data.crePermission ? data.crePermission: undefined);
    this.station.name = data.name;
    this.station.businessName = data.businessName;
    //this.station.rfc = data.rfc;
    this.station.address = data.address;
    this.station.phoneNumber = data.phoneNumber;
    this.station.email = data.email;
    this.station.workers = data.workers;
    this.station.observationWells = data.observationWells;
    this.station.monitoringWells = data.monitoringWells;
    if (this._latLng) {
      this.station.location.latitude = (this._latLng.latitude?this._latLng.latitude:19.432675);
      this.station.location.longitude = (this._latLng.longitude? this._latLng.longitude: -99.133461);
    }
    this.station.workShifts = this.workShifts.filter(function (item) {return item !== undefined;});
    this.station.fuelTanks = this.tanks.filter(function (item) {return item !== undefined;});
    this.station.dispensers = this.dispensers.filter(function (item) {return item !== undefined;});
   this._api.updateStation(this.station).subscribe(response => {
      switch (response.code) {
        case 200:
          this._change = false;
          this._snackBarService.openSnackBar('Información actualizada','OK',3000);
          break;
        default:
          this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
          break;
      }
    })
  }

  public addRemoveTurn(remove: boolean, type: number, index?: number): void{
    this._change = true;
    if(!remove){
      switch (type) {
        case 1:
          this.workShifts.push({start: undefined, end: undefined});
          break;
        case 2:
          this.tanks.push({capacity: undefined, fuelType: undefined, year: undefined});
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
      if((this.dispensers[k].hoses)&&(this.dispensers[k].magna === false && this.dispensers[k].premium === false && this.dispensers[k].diesel === false)){
        this._snackBarService.openSnackBar('Complete los campos para el dispensario ' + (k+1),'OK',3000);
        return false;
      }else if((!this.dispensers[k].hoses)&&(this.dispensers[k].magna === true || this.dispensers[k].premium === true || this.dispensers[k].diesel === true)){
        this._snackBarService.openSnackBar('Complete los campos para el dispensario ' + (k+1),'OK',3000);
        return false;
      }
    }
    return true;
  }

  public onArrayChange():void{
    this._change = true;
  }


  public changeDate(ev: any, index: number, isStart: boolean):void{
    this._change = true;
    const time = ev.mTime.replace(':','');
    if(isStart){
      this.workShifts[index].start = time;
    }else{
      this.workShifts[index].end = time;
    }
  }

  private initYears():void{
    const year = new Date();
    for(let x = 1969; x<=year.getFullYear(); x++){
      this.yearSelector.push(x);
    }
  }

  public goToDocumentation(): void{
    if(this.user.role !== 6){
      this._router.navigate(['/home/documents', this.station.id]).then();
    }else{
      this._snackBarService.openSnackBar('Usted no tiene permiso para visualizar este módulo','OK',3000);
    }
  }
}
