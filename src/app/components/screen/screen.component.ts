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

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss']
})
export class ScreenComponent implements OnInit, AfterViewInit, OnDestroy{

  public stationList: any[];
  public stationActive: any;
  public role: number;
  public menu: boolean;
  public utils: any;
  private _stationId: any;
  private _subscriptionShared: Subscription;
  constructor(
    private _api: ApiService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _addStationService: AddStationService,
    private _dialogService: DialogService,
    private _auth: AuthService,
    private _sharedService: SharedService,
    private _sasisopaService: SasisopaService,
    private _sgmService: SgmService,
    private _metaService: MetaService
  ) {
    this.menu = true;
    this.stationList = [];
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
       case SharedTypeNotification.CreationTask:
         if(response.value){
           this.createTasks(response.value.id);
         }
         break;
       case SharedTypeNotification.ChangeStation:
         this._stationId = response.value;
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
      this._dialogService.alertDialog(
        'Información',
        'Para continuar es necesario registrar su firma digital',
        'REGISTRAR').afterClosed().subscribe(response =>{
        LocalStorageService.setItem(Constants.NotSignature, true);
        switch (user.role) {
          case 1:
          case 2:
          case 3:
            this._router.navigate(['/home/profile/consultancy']).then();
            break;
          case 4:
          case 5:
          case 6:
            this._router.navigate(['/home/profile/user']).then();
            break;
        }
      })
    }else{
      this.getDashboardInformation(this._stationId);
    }
  }

  private getDashboardInformation(onlyOneStationId?: any): void{
    let refId = undefined;
    const userId = CookieService.getCookie(Constants.IdSession);
    const user = LocalStorageService.getItem(Constants.UserInSession);
    if(user && userId){
      if(user.role !== 7){
        refId = user.refId
      } else {
        const consultancy = LocalStorageService.getItem(Constants.ConsultancyInSession);
        refId = consultancy.id
      }
      this.role = user.role;
      this._api.getCompleteInfoDashboard(userId,refId,this.role,onlyOneStationId).subscribe(response=>{
        if (response){
          this.utils = response[1].item;
          switch (this.role){
            case 1:
            case 2:
            case 3:
            case 4:
            case 7:
              if(onlyOneStationId){
                switch(response[0].code){
                  case 200:
                    this.stationList = response[0].item;
                    this.stationActive = this.stationList;
                    LocalStorageService.setItem(Constants.StationInDashboard, {id: this.stationActive.id, name: this.stationActive.businessName});
                    if (this.stationActive){
                      if(!this.validateTaskCreated()){
                        this.openTaskCalendar();
                      }else{
                        this.createTasks();
                      }
                    }
                    break;
                  default:
                    this._router.navigate(['/home']).then();
                    this.getDashboardInformation(null);
                    break;
                }
              }else{
                if(response[0].item.stationLites){
                  this.stationList = response[0].item.stationLites;
                  this.stationActive = (Array.isArray(this.stationList)?this.stationList[0]:this.stationList);
                  LocalStorageService.setItem(Constants.StationInDashboard, {id: this.stationActive.id, name: this.stationActive.businessName});
                }else{
                  this.stationList = undefined;
                  this.stationActive = undefined;
                }
                LocalStorageService.setItem(Constants.ConsultancyInSession, {id:response[0].item.consultancy.id, name: response[0].item.consultancy.businessName});
                if (this.stationActive){
                  if(!this.validateTaskCreated()){
                    this.openTaskCalendar();
                  }else{
                    this.createTasks();
                  }
                }
              }
              break;
            case 5:
            case 6:
              if(onlyOneStationId){
                this.stationList = response[0].item;
                this.stationActive = this.stationList;
                LocalStorageService.setItem(Constants.StationInDashboard, {id: this.stationActive.id, name: this.stationActive.businessName});
                if(!this.validateTaskCreated()){
                  this.openTaskCalendar();
                }else{
                  this.createTasks();
                }
              }else{
                this.stationList = response[0].item.station;
                this.stationActive = this.stationList;
                LocalStorageService.setItem(Constants.StationInDashboard, {id: this.stationActive.id, name: this.stationActive.businessName});
                if(!this.validateTaskCreated()){
                  this.openTaskCalendar();
                }else{
                  this.createTasks();
                }
              }
              break;
          }
        }
        this.setStationMetas(this.stationActive);
      });
    }
  }


  public validateTaskCreated():boolean{
    return this.stationActive.stationTaskId;
  }

  public openTaskCalendar():void{
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
    }else{
      LocalStorageService.setItem(Constants.NotCalendarTask,true);
    }
  }

  private setStationMetas(station: any){
    this._metaService.setAllMetas({
      title: 'Dashboard | ' + this.utils.groupIcons[station.type-1].name + ' - ' + station.name,
      description: null,
      url: this._router.url
    })
  }

  private createTasks(id?: string):void{
    this._api.buildTaskByStation(id || this.stationActive.stationTaskId).subscribe(response=>{
      switch (response.code){
        case 200:
          if(response.item.status!==3){
            this._sharedService.setNotification({type: SharedTypeNotification.ListTask, value: true});
            this.createTasks(id);
          }
          break;
        case 400:
          this.stationActive.stationTaskId = id ? id : response.item.id;
          this._sharedService.setNotification({type: SharedTypeNotification.ListTask, value: false});
          break;
        default:
          break;
      }
    })
  }

  public addStation():void{
    this._addStationService.open();
  }

  public openOtherTasks():void{
    this._sharedService.setNotification({type: SharedTypeNotification.NotCalendarTask, value: true});
  }

  public openSasisopaModal():void{
    this._sasisopaService.open();
  }

  public openSGMModal():void{
    this._sgmService.open();
  }

  public openNotifications():void{
    if(this.role !== 7){
      this._router.navigate(['/home/notifications'], {queryParams:{id: this.stationActive.id}}).then();
    }else{
      this._router.navigate(['/home/notifications'], {queryParams:{id: this.stationActive.id, admin: this.stationActive.idLegalRepresentative}}).then();
    }
  }

}
