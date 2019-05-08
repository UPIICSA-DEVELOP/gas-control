/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {Constants} from '@app/core/constants.core';
import {ActivatedRoute, Router} from '@angular/router';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {AddStationService} from '@app/components/screen/components/add-gas-station/add-station.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {AuthService} from '@app/core/services/auth/auth.service';
import {environment} from '@env/environment';
import {Subscription} from 'rxjs';
import {SharedNotification, SharedService, SharedTypeNotification} from '@app/core/services/shared/shared.service';
import {SasisopaService} from '@app/components/screen/components/sasisopa/sasisopa.service';
import {MetaService} from '@app/core/services/meta/meta.service';
import {SgmService} from '@app/components/screen/components/sgm/sgm.service';
import {ApiLoaderService} from '@app/core/services/api/api-loader.service';
import {SignaturePadService} from '@app/core/components/signature-pad/signature-pad.service';
import {UploadFileService} from '@app/core/components/upload-file/upload-file.service';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss']
})
export class ScreenComponent implements OnInit, AfterViewInit, OnDestroy{

  public stationActive: any;
  public role: number;
  public menu: boolean;
  public utils: any;
  public load: boolean;
  public newNotification: boolean;
  private _stationId: any;
  private _subscriptionShared: Subscription;
  private _subscriptionLoader: Subscription;
  constructor(
    private _api: ApiService,
    private _apiLoader: ApiLoaderService,
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
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load=>{this.load = load});
    this.menu = true;
    this.newNotification = false;
  }

  ngOnInit() {
    if(this._activateRoute.snapshot.queryParams['station']){
      this._stationId = this._activateRoute.snapshot.queryParams['station'];
    }
  }

  ngAfterViewInit(): void{
    this.validateSignatureUser();
    this.initNotifications();
    this.checkChanges();
  }

  ngOnDestroy():void{
   //this._subscriptionShared.unsubscribe();
  }

 private checkChanges():void{
   this._subscriptionShared = this._sharedService.getNotifications().subscribe((response: SharedNotification)=>{
     switch (response.type){
       case SharedTypeNotification.ChangeStation:
         this._stationId = response.value.id;
         this.newNotification = response.value.newNotification;
         this.getDashboardInformation(this._stationId);
         break;
       case SharedTypeNotification.FinishEditTask:
         this.stationActive.doneTasks = response.value.doneTasks;
         this.stationActive.progress = response.value.progress;
         break;
     }
   });
 }

  public addCollaborator():void{
    this._router.navigate(['/home/add-collaborator'], {queryParams:{stationId: this.stationActive.id}}).then();
  }

  private initNotifications(): void{
    this._auth.onNotificationsReceived().subscribe(response=>{
      if(response.data['gcm.notification.stationId'] === this.stationActive.id){
        this.newNotification = true;
      }
      const notification = new Notification(response.notification.title, {
        icon: environment.url+'favicon.png',
        body: response.notification.body,
      });
      notification.onclick = function () {
        window.open(environment.url);
      };
    });
  }

  private validateSignatureUser(): void{
    if(LocalStorageService.getItem(Constants.NotSignature)){
      const user = LocalStorageService.getItem(Constants.UserInSession);
      this.role = user.role;
      this._dialogService.alertDialog(
        'Información',
        'Para continuar es necesario registrar su firma digital',
        'REGISTRAR').afterClosed().subscribe(() =>{
        LocalStorageService.setItem(Constants.NotSignature, true);
        this.drawSignature();
      });
    }else{
      this.getDashboardInformation(this._stationId);
    }
  }

  private getDashboardInformation(onlyOneStationId?: any): void{
    const userId = CookieService.getCookie(Constants.IdSession);
    const user = LocalStorageService.getItem(Constants.UserInSession);
    if(user && userId){
      this.role = user.role;
      this._api.getCompleteInfoDashboard(userId,user.refId,this.role,onlyOneStationId).subscribe(response=>{
        if (response){
          this.utils = response[1].item;
          switch (this.role){
            case 1:
            case 2:
            case 3:
            case 4:
              this.prepareDashboardToConsultancy(response[0], onlyOneStationId);
              break;
            case 5:
            case 6:
              this.prepareDashboardToStationWorkers(response[0], onlyOneStationId);
              break;
            case 7:
              this.stationActive = response[0].item;
              LocalStorageService.setItem(Constants.StationInDashboard, {id: this.stationActive.id, name: this.stationActive.businessName});
              if(!this.stationActive.stationTaskId){
                this.openTaskCalendar();
              }
              break;
          }
        }
        if(this.stationActive){
          this.setStationMetas(this.stationActive);
        }
      });
    }
  }

  private openTaskCalendar():void{
    if(this.role===6){
      this._dialogService.alertDialog(
        'Información',
        'No se han calendarizado las tareas de esta Estación. Por favor notifíquelo a su superior',
        'ACEPTAR'
      ).afterClosed().subscribe(response=>{
        switch (response.code){
          case 1:
            this._auth.logOut();
            break;
        }
      });
    }
  }

  private setStationMetas(station: any){
    this._metaService.setAllMetas({
      title: 'Dashboard | ' + this.utils.groupIcons[station.type-1].name + ' - ' + station.name,
      description: null,
      url: this._router.url
    })
  }

  public addStation():void{
    this._addStationService.open();
  }

  public openOtherTasks():void{
    this._sharedService.setNotification({type: SharedTypeNotification.NotCalendarTask, value: true});
  }

  public openSasisopaModal():void{
    if(this.role !== 6){
      this._sasisopaService.open({utils: this.utils, stationId: this.stationActive.id});
    }else{
      this._snackBarService.openSnackBar('Usted no tiene permiso para visualizar este módulo','OK',3000);
    }
  }

  public openSGMModal():void{
    if(this.role !== 6){
      this._sgmService.open({utils:this.utils, stationId: this.stationActive.id});
    }else{
      this._snackBarService.openSnackBar('Usted no tiene permiso para visualizar este módulo','OK',3000);
    }
  }

  public openNotifications():void{
    this.newNotification = false;
    if(this.role !== 7){
      this._router.navigate(['/home/notifications'], {queryParams:{id: this.stationActive.id}}).then();
    }else{
      this._router.navigate(['/home/notifications'], {queryParams:{id: this.stationActive.id, admin: this.stationActive.idLegalRepresentative}}).then();
    }
  }

  private prepareDashboardToConsultancy(response: any, onlyOneStation?: any):void{
    if(onlyOneStation){
      switch (response.code){
        case 200:
          this.stationActive = response.item;
          LocalStorageService.setItem(Constants.StationInDashboard, {id: this.stationActive.id, name: this.stationActive.businessName});
          if(!this.stationActive.stationTaskId){
            this.openTaskCalendar();
          }
          break;
        default:
          this.getDashboardInformation(null);
          break;
      }
    }else{
      switch (response.code){
        case 200:
          LocalStorageService.setItem(Constants.ConsultancyInSession, {id:response.item.consultancy.id, name: response.item.consultancy.businessName});
          if(response.item.stationLites){
            this.stationActive = response.item.stationLites[0];
            LocalStorageService.setItem(Constants.StationInDashboard, {id: this.stationActive.id, name: this.stationActive.businessName});
            if(this.stationActive.newNotification){
              this.newNotification = true;
            }
            if(!this.stationActive.stationTaskId){
              this.openTaskCalendar();
            }
          }else{
            this.stationActive = undefined
          }
          break;
        default:
          this.stationActive = undefined;
          break;
      }
    }
  }

  private prepareDashboardToStationWorkers(response: any, onlyOneStation?: any): void{
    if(onlyOneStation){
      switch (response.code){
        case 200:
          this.stationActive = response.item;
          LocalStorageService.setItem(Constants.StationInDashboard, {id: this.stationActive.id, name: this.stationActive.businessName});
          if(!this.stationActive.stationTaskId){
            this.openTaskCalendar();
          }
          break;
        default:
          this.getDashboardInformation(null);
          break;
      }
    }else{
      switch (response.code){
        case 200:
          if(response.item.station){
            this.stationActive = response.item.station;
            LocalStorageService.setItem(Constants.StationInDashboard, {id: this.stationActive.id, name: this.stationActive.businessName});
            if(response.item.newNotification){
              this.newNotification = true;
            }
            if(!this.stationActive.stationTaskId){
              this.openTaskCalendar();
            }
          }else{
            this.stationActive = undefined;
          }
          break;
        default:
          break;
      }
    }
  }

  private drawSignature():void{
    this._signatureService.open().afterClosed().subscribe(response=>{
      switch (response.code){
        case 1:
          let formSignature = new FormData();
          formSignature.append('path','');
          formSignature.append('fileName','signature-'+CookieService.getCookie(Constants.IdSession)+'-'+ new Date().getTime()+'.png');
          formSignature.append('isImage','true');
          formSignature.append('file',response.blob);
          this.loadSignature(formSignature);
          break;
      }
    });
  }

  private loadSignature(file: FormData): void{
    this._uploadFile.upload(file).subscribe(response=>{
      if(response){
        const signature = {
          blobName: response.item.blobName,
          thumbnail: response.item.thumbnail
        };
        this.getUser(signature);
      }else{
        this.onErrorOccur();
      }
    })
  }

  private getUser(newSignatureElement: any): void{
    this._api.getPerson(CookieService.getCookie(Constants.IdSession)).subscribe(response=>{
      switch (response.code){
        case 200:
          let person = response.item;
          person.signature = newSignatureElement;
          this.updatePerson(person);
          break;
        default:
          this.onErrorOccur();
          break;
      }
    });
  }

  private updatePerson(person: any): void{
    this._api.updatePerson(person).subscribe(response=>{
      switch (response.code){
        case 200:
          this._snackBarService.openSnackBar('Firma actualizada', 'OK', 3000);
          LocalStorageService.removeItem(Constants.NotSignature);
          this.getDashboardInformation(this._stationId);
          break;
        default:
          this.onErrorOccur();
          break;
      }
    })
  }

  private onErrorOccur():void{
    this._snackBarService.openSnackBar('Ha ocurrido un error, por favor intente después', 'OK', 3000);
  }
}
