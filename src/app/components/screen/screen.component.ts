/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {Constants} from '@app/core/constants.core';
import {ActivatedRoute, Router} from '@angular/router';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {AddStationService} from '@app/components/screen/components/add-gas-station/add-station.service';
import {DialogService} from '@app/core/components/dialog/dialog.service';
import {AuthService} from '@app/core/services/auth/auth.service';
import {response} from 'express';
import {environment} from '@env/environment';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss']
})
export class ScreenComponent implements OnInit{

  public stationList: any[];
  public stationActive: any;
  public role: number;
  public menu: boolean;
  public utils: any;
  constructor(
    private _api: ApiService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _addStationService: AddStationService,
    private _dialogService: DialogService,
    private _auth: AuthService
  ) {
    this.menu = true;
    this.stationList = [];
  }

  ngOnInit() {
    this._auth.onNotificationsRecived().subscribe(response=>{
      const notification = new Notification(response.notification.title, {
        icon: environment.url+'favicon.png',
        body: response.notification.body,
      });
      notification.onclick = function () {
        window.open("http://stackoverflow.com/a/13328397/1269037");
      };
    });
    this._activateRoute.url.subscribe(() => {
     if(this._router.url.includes('/home?station')){
       this.initView(this._activateRoute.snapshot.queryParams.station);
     }else{
       if(!this._router.url.includes('/home/documents') || !this._router.url.includes('/home/profile/gas-station')){
         if(!this.stationActive){
           this.initView();
         }
       }
     }
    });
  }

  public initView(id?: string): void{
    if (id) {
      this.getDashboardInformation(id);
    } else {
      this.getDashboardInformation();
    }
  }

  public addCollaborator():void{
    this._router.navigate(['/home/add-collaborator'], {queryParams:{stationId: this.stationActive.id}}).then();
  }

  private getDashboardInformation(onlyOneStationId?: any): void{
    const userId = CookieService.getCookie(Constants.IdSession);
    const user = LocalStorageService.getItem(Constants.UserInSession);
    this.role = user.role;
    this._api.getCompleteInfoDashboard(userId,user.refId,this.role,onlyOneStationId).subscribe(response=>{
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
                  LocalStorageService.setItem(Constants.StationInDashboard, this.stationActive.businessName);
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
              this.stationList = response[0].item.stationLites;
              this.stationActive = (Array.isArray(this.stationList)?this.stationList[0]:this.stationList);
              LocalStorageService.setItem(Constants.ConsultancyInSession, response[0].item.consultancy.businessName);
              LocalStorageService.setItem(Constants.StationInDashboard, this.stationActive.businessName);
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
              LocalStorageService.setItem(Constants.StationInDashboard, this.stationActive.businessName);
              if(!this.validateTaskCreated()){
                this.openTaskCalendar();
              }else{
                this.createTasks();
              }
            }else{
              this.stationList = response[0].item.station;
              this.stationActive = this.stationList;
              LocalStorageService.setItem(Constants.StationInDashboard, this.stationActive.businessName);
              if(!this.validateTaskCreated()){
                this.openTaskCalendar();
              }else{
                this.createTasks();
              }
            }
            break;
        }
      }
    });
  }

  public validateTaskCreated():boolean{
    return this.stationActive.stationTaskId;
  }

  public openTaskCalendar():void{
    const user = LocalStorageService.getItem(Constants.UserInSession);
    if(user.role===6){
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

  private createTasks():void{
    this._api.buildTaskByStation(this.stationActive.stationTaskId).subscribe(response=>{
      switch (response.code){
        case 200:
          if(response.item.status!==3){
            this.createTasks();
          }
          break;
      }
    })
  }

  public addStation():void{
    this._addStationService.open();
  }
}
