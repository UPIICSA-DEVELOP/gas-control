/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from 'app/core/services/api/api.service';
import {Constants} from 'app/utils/constants/constants.utils';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogService} from 'app/shared/components/dialog/dialog.service';
import {AuthService} from 'app/core/services/auth/auth.service';
import {environment} from 'environments/environment';
import {Subscription} from 'rxjs';
import {SharedNotification, SharedService, SharedTypeNotification} from 'app/core/services/shared/shared.service';
import {SignaturePadService} from 'app/shared/components/signature-pad/signature-pad.service';
import {UploadFileService} from 'app/shared/components/upload-file/upload-file.service';
import {SnackBarService} from 'app/core/services/snackbar/snackbar.service';
import {UtilitiesService} from 'app/utils/utilities/utilities';
import {DOCUMENT} from '@angular/common';
import {AddStationService} from '@app/shared/components/add-gas-station/add-station.service';
import {SasisopaService} from '@app/ui/dashboard/components/sasisopa/sasisopa.service';
import {SgmService} from '@app/ui/dashboard/components/sgm/sgm.service';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {Person} from '@app/utils/interfaces/person';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {AppUtil} from '@app/utils/interfaces/app-util';
import {Station} from '@app/utils/interfaces/station';
import {EntityResponse} from '@app/utils/class/entity-response';
import {StationBasicData} from '@app/utils/interfaces/station-basic-data';
import {CookieService, LocalStorageService, MetaService} from 'ng-maplander';

@Component({
  selector: 'app-screen',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  public stationActive: Station;
  public role: number;
  public opened: boolean;
  public disabledClose: boolean;
  public mode: string;
  public utils: AppUtil;
  public load: boolean;
  public newNotification: boolean;
  private _stationId: any;
  private _subscriptionShared: Subscription;
  private _subscriptionLoader: Subscription;
  @ViewChild('drawer', {static: true}) private _drawer: any;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _api: ApiService,
    private _apiLoader: LoaderService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _addStationService: AddStationService,
    private _dialogService: DialogService,
    private _auth: AuthService,
    private _sharedService: SharedService,
    private _sasisopaService: SasisopaService,
    private _sgmService: SgmService,
    private _metaService: MetaService,
    private _signatureService: SignaturePadService,
    private _uploadFile: UploadFileService,
    private _snackBarService: SnackBarService
  ) {
    this.mode = 'side';
    this.opened = true;
    this.disabledClose = true;
    this.newNotification = false;
  }

  ngOnInit() {
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {
      this.load = load;
    });
    if (this._activateRoute.snapshot.queryParams['station']) {
      this._stationId = this._activateRoute.snapshot.queryParams['station'];
    }
  }

  ngAfterViewInit(): void {
    if (this._document.body.clientWidth <= 1024) {
      this.opened = false;
      this.disabledClose = false;
      this.mode = 'over';
    }
    this.validateSignatureUser();
    this.initNotifications();
    this.checkChanges();
  }

  ngOnDestroy(): void {
    // this._subscriptionShared.unsubscribe();
  }

  private checkChanges(): void {
    this._subscriptionShared = this._sharedService.getNotifications().subscribe((response: SharedNotification) => {
      switch (response.type) {
        case SharedTypeNotification.ChangeStation:
          this._stationId = response.value.id;
          this.newNotification = response.value.newNotification;
          this.getDashboardInformation(this._stationId);
          break;
        case SharedTypeNotification.FinishEditTask:
          this.stationActive.doneTasks = response.value.doneTasks;
          this.stationActive.progress = response.value.progress;
          break;
        case SharedTypeNotification.OpenCloseMenu:
          this._drawer.toggle();
          break;
      }
    });
  }

  public addCollaborator(): void {
    if (this.mode === 'over') {
      this._drawer.toggle();
    }
    this._router.navigate(['/home/add-collaborator'], {queryParams: {stationId: this.stationActive.id}}).then();
  }

  private initNotifications(): void {
    this._auth.onNotificationsReceived().subscribe(response => {
      if (response.data['gcm.notification.stationId'] === this.stationActive.id) {
        this.newNotification = true;
      }
      const notification = new Notification(response.notification.title, {
        icon: environment.url + 'favicon.png',
        body: response.notification.body,
      });
      notification.onclick = function () {
        window.open(environment.url);
      };
    });
  }

  private validateSignatureUser(): void {
    if (LocalStorageService.getItem(Constants.NotSignature)) {
      const user = LocalStorageService.getItem(Constants.UserInSession);
      this.role = user.role;
      this._dialogService.alertDialog(
        'Información',
        'Para continuar es necesario registrar su firma digital',
        'REGISTRAR').afterClosed().subscribe(() => {
        LocalStorageService.setItem(Constants.NotSignature, true);
        this.drawSignature();
      });
    } else {
      this.getDashboardInformation(this._stationId);
    }
  }

  private getDashboardInformation(onlyOneStationId?: any): void {
    const userId = CookieService.getCookie(Constants.IdSession);
    const user = LocalStorageService.getItem(Constants.UserInSession);
    if (user && userId) {
      this.role = user.role;
      this._api.getCompleteInfoDashboard(userId, user.refId, this.role, onlyOneStationId).subscribe(response => {
        if (response) {
          this.utils = response.utils.item;
          switch (this.role) {
            case 1:
            case 2:
            case 3:
            case 4:
              this.prepareDashboardToConsultancy(response.station, onlyOneStationId);
              break;
            case 5:
            case 6:
              this.prepareDashboardToStationWorkers(response.station, onlyOneStationId);
              break;
            case 7:
              this.stationActive = response.station.item;
              LocalStorageService.setItem(Constants.StationInDashboard, {id: this.stationActive.id, name: this.stationActive.businessName});
              if (!this.stationActive.stationTaskId) {
                this.openTaskCalendar();
              }
              break;
          }
        }
        if (this.stationActive) {
          this.setStationMetas(this.stationActive);
        }
      });
    }
  }

  public closeToggle(): void {
    if (this.mode === 'over') {
      this._drawer.toggle();
    }
  }

  private openTaskCalendar(): void {
    if (this.role === 6) {
      this._dialogService.alertDialog(
        'Información',
        'No se han calendarizado las tareas de esta Estación. Por favor notifíquelo a su superior',
        'ACEPTAR'
      ).afterClosed().subscribe(response => {
        if (response.code === 1) {
          this._auth.logOut();
        }
      });
    }
  }

  private setStationMetas(station: any) {
    this._metaService.setAllMetas({
      title: 'Dashboard | ' + this.utils.groupIcons[station.type - 1].name + ' - ' + station.name,
      description: null,
      url: this._router.url
    });
  }

  public addStation(): void {
    this._addStationService.open();
  }

  public openOtherTasks(): void {
    if (this.mode === 'over') {
      this._drawer.toggle();
    }
    this._sharedService.setNotification({type: SharedTypeNotification.NotCalendarTask, value: true});
  }

  public openSasisopaModal(): void {
    if (this.role !== 6) {
      this._sasisopaService.open({utils: this.utils, stationId: this.stationActive.id});
      if (this.mode === 'over') {
        this._drawer.toggle();
      }
    } else {
      this._snackBarService.openSnackBar('Usted no tiene permiso para visualizar este módulo', 'OK', 3000);
    }
  }

  public openSGMModal(): void {
    if (this.role !== 6) {
      this._sgmService.open({utils: this.utils, stationId: this.stationActive.id});
      if (this.mode === 'over') {
        this._drawer.toggle();
      }
    } else {
      this._snackBarService.openSnackBar('Usted no tiene permiso para visualizar este módulo', 'OK', 3000);
    }
  }

  public openNotifications(): void {
    this.newNotification = false;
    if (this.role !== 7) {
      this._router.navigate(['/home/notifications'], {queryParams: {id: this.stationActive.id}}).then();
    } else {
      this._router.navigate(['/home/notifications'], {
        queryParams: {
          id: this.stationActive.id,
          admin: this.stationActive.idLegalRepresentative
        }
      }).then();
    }
    if (this.mode === 'over') {
      this._drawer.toggle();
    }
  }

  private prepareDashboardToConsultancy(response: any, onlyOneStation?: any): void {
    if (onlyOneStation) {
      if (response.code === HttpResponseCodes.OK) {
        this.stationActive = response.item.station;
        LocalStorageService.setItem(Constants.StationInDashboard, {id: this.stationActive.id, name: this.stationActive.businessName});
        if (this.stationActive.paymentStatus !== 1 && this.role === 4) {
          this.stationBlock();
        }
        if (!this.stationActive.stationTaskId) {
          this.openTaskCalendar();
        }
      } else {
        this.getDashboardInformation(null);
      }
    } else {
      if (response.code === HttpResponseCodes.OK) {
        LocalStorageService.setItem(Constants.ConsultancyInSession, {
          id: response.item.consultancy.id,
          name: response.item.consultancy.businessName
        });
        if (response.item.stationLites) {
          const list = UtilitiesService.sortJSON(response.item.stationLites, 'enabled', 'desc');
          this.stationActive = list[0];
          LocalStorageService.setItem(Constants.StationInDashboard, {id: this.stationActive.id, name: this.stationActive.businessName});
          if (this.role === 4 && !response.item.stationLites.enabled) {
            this.stationBlock();
          }
          if (response.item.stationLites.newNotification) {
            this.newNotification = true;
          }
          if (!this.stationActive.stationTaskId) {
            this.openTaskCalendar();
          }
        } else {
          this.stationActive = null;
        }
      } else {
        this.stationActive = null;
      }
    }
  }

  private prepareDashboardToStationWorkers(response: EntityResponse<StationBasicData>, onlyOneStation?: any): void {
    if (onlyOneStation) {
      if (response.code === HttpResponseCodes.OK) {
        this.stationActive = response.item.station;
        LocalStorageService.setItem(Constants.StationInDashboard, {id: this.stationActive.id, name: this.stationActive.businessName});
        if (!this.stationActive.stationTaskId) {
          this.openTaskCalendar();
        }
      } else {
        this.getDashboardInformation(null);
      }
    } else {
      if (response.code === HttpResponseCodes.OK) {
        if (response.item.station) {
          this.stationActive = response.item.station;
          LocalStorageService.setItem(Constants.StationInDashboard, {id: this.stationActive.id, name: this.stationActive.businessName});
          if (response.item.newNotification) {
            this.newNotification = true;
          }
          if (!this.stationActive.stationTaskId) {
            this.openTaskCalendar();
          }
        } else {
          this.stationActive = undefined;
        }
      } else {
      }
    }
    if (this.stationActive.paymentStatus !== 1) {
      this.stationBlock();
    }
  }

  private stationBlock(): void {
    this._dialogService.alertDialog(
      'Verificar Estado de suscripción',
      'Esta estación se encuentra suspendida por un problema con el último pago',
      'CERRAR SESIÓN'
    ).afterClosed().subscribe(() => {
      this._auth.logOut();
    });
  }

  private drawSignature(): void {
    this._signatureService.open().afterClosed().subscribe(response => {
      if (response.code === 1) {
        const formSignature = new FormData();
        formSignature.append('path', '');
        formSignature.append('fileName', 'signature-' + CookieService.getCookie(Constants.IdSession) + '-' + new Date().getTime() + '.png');
        formSignature.append('isImage', 'true');
        formSignature.append('file', response.blob);
        this.loadSignature(formSignature);
      }
    });
  }

  private loadSignature(file: FormData): void {
    this._uploadFile.upload(file).subscribe(response => {
      if (response) {
        const signature = {
          blobName: response.item.blobName,
          thumbnail: response.item.thumbnail
        };
        this.getUser(signature);
      } else {
        this.onErrorOccur();
      }
    });
  }

  private getUser(newSignatureElement: any): void {
    this._api.getPerson(CookieService.getCookie(Constants.IdSession)).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        const person = response.item;
        person.signature = newSignatureElement;
        this.updatePerson(person);
      } else {
        this.onErrorOccur();
      }
    });
  }

  private updatePerson(person: Person): void {
    this._api.updatePerson(person).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._snackBarService.openSnackBar('Firma actualizada', 'OK', 3000);
        LocalStorageService.removeItem(Constants.NotSignature);
        this.getDashboardInformation(this._stationId);
      } else {
        this.onErrorOccur();
      }
    });
  }

  private onErrorOccur(): void {
    this._snackBarService.openSnackBar('Ha ocurrido un error, por favor intente después', 'OK', 3000);
  }
}
