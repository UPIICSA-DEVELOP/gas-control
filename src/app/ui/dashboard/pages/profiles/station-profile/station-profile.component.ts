/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from 'app/core/services/api/api.service';
import {LocationService} from 'app/shared/components/location/location.service';
import {DialogService} from 'app/shared/components/dialog/dialog.service';
import {Constants} from 'app/utils/constants/constants.utils';
import {Subscription} from 'rxjs';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {FormatTimePipe} from '@app/shared/pipes/format-time/format-time.pipe';
import {UtilitiesService} from '@app/utils/utilities/utilities';
import {WorkShift} from '@app/utils/interfaces/work-shift';
import {FuelTank} from '@app/utils/interfaces/fuel-tank';
import {Dispenser} from '@app/utils/interfaces/dispenser';
import {Station} from '@app/utils/interfaces/station';
import {Person} from '@app/utils/interfaces/person';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {ANIMATION} from '@app/ui/dashboard/pages/profiles/station-profile/animation';
import {AppUtil} from '@app/utils/interfaces/app-util';
import {LocalStorageService, SnackBarService} from '@maplander/core';
import {GroupIcon} from '@app/utils/interfaces/group-icon';
import {ModalStationService} from '@app/shared/components/modal-station/modal-station.service';
import {SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';

@Component({
  selector: 'app-station-profile',
  templateUrl: './station-profile.component.html',
  styleUrls: ['./station-profile.component.scss'],
  animations: [ANIMATION]
})
export class StationProfileComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation')

  @ViewChild('close', {static: true}) private _close: ElementRef;
  public workShifts: WorkShift[];
  public tanks: FuelTank[];
  public dispensers: Dispenser[];
  public stationForm: FormGroup;
  public station: Station;
  public group: GroupIcon;
  public load: boolean;
  public user: Person;
  public yearSelector: Array<number>;
  private _latLng: any;
  private _change: boolean;
  private _utils: AppUtil;
  private _subscriptionLoader: Subscription;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _api: ApiService,
    private _apiLoader: LoaderService,
    private _locationService: LocationService,
    private _snackBarService: SnackBarService,
    private _sharedService: SharedService,
    private _dialogService: DialogService,
    private _activatedRouter: ActivatedRoute,
    private _formatTime: FormatTimePipe,
    private _modalStation: ModalStationService
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
    this.getUtils(this._activatedRouter.snapshot.data.data.utils);
    this.getStation(this._activatedRouter.snapshot.data.data.station);
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {
      this.load = load;
    });
  }

  ngOnDestroy(): void {
    this._subscriptionLoader.unsubscribe();
  }

  public detectChanges(): void {
    this.stationForm.valueChanges.subscribe(() => {
      this._change = true;
    });
  }

  public changeGroup(): void {
    this._modalStation.open(this._utils.groupIcons).afterClosed().subscribe((response) => {
      if (response.code === 1) {
        this.group = response.data;
        this.station.type = Number(this.group.id);
        this.updateStation();
      }
    });
  }

  public closeProfile(): void {
    if (this._change) {
      this._dialogService.confirmDialog(
        '¿Desea salir sin guardar cambios?',
        '',
        'ACEPTAR',
        'CANCELAR'
      ).afterClosed().subscribe(response => {
        if (response.code === 1) {
          this._router.navigate(['/home']).then();
        }
      });
    } else {
      this._router.navigate(['/home']).then();
    }
  }

  public openLocation(): void {
    const latLng = {
      lat: this._latLng ? this._latLng.latitude : 19.432675,
      lng: this._latLng ? this._latLng.longitude : -99.133461
    };
    this._locationService.open(latLng).afterClosed().subscribe(response => {
      if (response.code === 1) {
        this._latLng = {
          latitude: response.location.lat,
          longitude: response.location.lng
        };
        this.stationForm.patchValue({
          address: response.location.address
        });
      } else {
      }
    });
  }

  public getUtils(response: any): void {
    if (response.code === HttpResponseCodes.OK) {
      this._utils = response.item;
    }
  }

  private initForm(): void {
    this.stationForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      businessName: ['', [Validators.required]],
      legalRepresentative: [{value: '', disabled: true}, []],
      rfc: [{value: '', disabled: true}, [Validators.required]],
      crePermission: ['', []],
      address: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
      email: ['', [Validators.required, Validators.email]],
      vrs: [{value: false, disabled: true}, []],
      workers: ['', []],
      monitoringWells: ['', []],
      observationWells: ['', []]
    });
  }

  private getStation(response: any): void {
    if (response.code === HttpResponseCodes.OK) {
      this.station = {
        paymentStatus: response.item.paymentStatus,
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
      } else {
        this.dispensers.push({hoses: undefined, identifier: undefined, magna: false, premium: false, diesel: false});
      }
      if (this.station.fuelTanks) {
        this.tanks = Object.assign([], this.station.fuelTanks);
      } else {
        this.tanks.push({capacity: undefined, fuelType: undefined, year: undefined});
      }
      if (this.station.workShifts) {
        const arr = [];
        this.station.workShifts.forEach(value => {
          arr.push({
            start: this._formatTime.transform(value.start),
            end: this._formatTime.transform(value.end)
          });
        });
        this.workShifts = Object.assign([], arr);
      } else {
        this.workShifts.push({start: undefined, end: undefined});
      }
      if (this.station.location) {
        this._latLng = this.station.location;
      }
      this.group = UtilitiesService.getObjectsByKeyValue(this._utils.groupIcons, 'id', '' + this.station.type)[0] as GroupIcon;
      this.patchForm();
    } else {
      this._snackBarService.setMessage('No se ha podido acceder, intente más tarde', 'OK', 3000);
      this._router.navigate(['/home']).then();
    }
  }

  private patchForm(): void {
    this.stationForm.patchValue({
      name: this.station.name,
      businessName: this.station.businessName,
      rfc: this.station.rfc,
      crePermission: this.station.crePermission,
      address: this.station.address,
      phoneNumber: this.station.phoneNumber,
      email: this.station.email,
      vrs: this.station.vapourRecoverySystem,
      workers: this.station.workers,
      monitoringWells: this.station.monitoringWells,
      observationWells: this.station.observationWells,
      legalRepresentative: this.station.legalRepresentativeName
    });
    if (this.user.role === 6) {
      this.stationForm.disable();
    }
    this.detectChanges();
  }

  public saveStationInformation(data: any): void {
    if (this.stationForm.invalid) {
      return;
    }
    if (!this.validateStationArrays()) {
      return;
    }
    this.station.crePermission = (data.crePermission ? data.crePermission : undefined);
    this.station.name = data.name;
    this.station.businessName = data.businessName;
    this.station.address = data.address;
    this.station.phoneNumber = data.phoneNumber;
    this.station.email = data.email;
    this.station.workers = data.workers;
    this.station.observationWells = data.observationWells;
    this.station.monitoringWells = data.monitoringWells;
    if (this._latLng) {
      this.station.location.latitude = (this._latLng.latitude ? this._latLng.latitude : 19.432675);
      this.station.location.longitude = (this._latLng.longitude ? this._latLng.longitude : -99.133461);
    }
    const workShifts = [];
    this.workShifts.forEach(value => {
      workShifts.push({
        start: UtilitiesService.removeFormatTime(value.start).toString(),
        end: UtilitiesService.removeFormatTime(value.end).toString()
      });
    });
    this.station.workShifts = workShifts.filter(function (item) {
      return item !== undefined;
    });
    this.station.fuelTanks = this.tanks.filter(function (item) {
      return item !== undefined;
    });
    this.station.dispensers = this.dispensers.filter(function (item) {
      return item !== undefined;
    });
    this.updateStation();
  }

  public addRemoveTurn(remove: boolean, type: number, index?: number): void {
    this._change = true;
    if (!remove) {
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
    } else {
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

  private validateStationArrays(): boolean {
    for (let i = 0; i < this.workShifts.length; i++) {
      if ((this.workShifts[i].start && !this.workShifts[i].end) || (!this.workShifts[i].start && this.workShifts[i].end)) {
        this._snackBarService.setMessage('Complete los campos para el turno ' + (i + 1), 'OK', 3000);
        return false;
      }
    }
    for (let j = 0; j < this.tanks.length; j++) {
      if ((!this.tanks[j].capacity && this.tanks[j].fuelType) || (this.tanks[j].capacity && !this.tanks[j].fuelType)) {
        this._snackBarService.setMessage('Complete los campos para el tanque ' + (j + 1), 'OK', 3000);
        return false;
      }
    }
    for (let k = 0; k < this.dispensers.length; k++) {
      if ((this.dispensers[k].hoses) && (this.dispensers[k].magna === false && this.dispensers[k].premium === false &&
        this.dispensers[k].diesel === false)) {
        this._snackBarService.setMessage('Complete los campos para el dispensario ' + (k + 1), 'OK', 3000);
        return false;
      } else if ((!this.dispensers[k].hoses) && (this.dispensers[k].magna === true || this.dispensers[k].premium === true ||
        this.dispensers[k].diesel === true)) {
        this._snackBarService.setMessage('Complete los campos para el dispensario ' + (k + 1), 'OK', 3000);
        return false;
      }
    }
    return true;
  }

  public onArrayChange(): void {
    this._change = true;
  }


  public changeDate(ev: any, index: number, isStart: boolean): void {

    if (isStart) {
      this.workShifts[index].start = ev;
    } else {
      this.workShifts[index].end = ev;
    }
    this._change = true;
  }

  private initYears(): void {
    const year = new Date();
    for (let x = 1969; x <= year.getFullYear(); x++) {
      this.yearSelector.push(x);
    }
  }

  public openCloseClock(ev: any, isOpen: boolean): void {
    this._close.nativeElement.style.zIndex = isOpen ? 0 : 5;
  }

  public goToDocumentation(): void {
    if (this.user.role !== 6) {
      this._router.navigate(['/home/documents', this.station.id]).then();
    } else {
      this._snackBarService.setMessage('Usted no tiene permiso para visualizar este módulo', 'OK', 3000);
    }
  }

  public updateStation(): void {
    this._api.updateStation(this.station).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._change = false;
        this._sharedService.setNotification({type: SharedTypeNotification.UpdateStation, value: null});
        this._snackBarService.setMessage('Información actualizada', 'OK', 3000);
      } else {
        this._dialogService.alertDialog('No se pudo acceder', 'Se produjo un error de comunicación con el servidor', 'ACEPTAR');
      }
    });
  }
}
