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
  }

  ngOnInit() {
    this.menu = true;
    this.stationList = [];
    if (this._activateRoute.snapshot.queryParams.station) {
      this.getDashboardInformation(this._activateRoute.snapshot.queryParams.station);
    } else {
      this.getDashboardInformation();
    }
  }

  public addCollaborator():void{
    this._router.navigate(['/home/add-collaborator'], {queryParams:{stationId: this.stationActive.id}});
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
                  if(!this.validateTaskCreated()){
                    this.openTaskCalendar();
                  }else{
                    this.createTasks();
                  }
                  break;
                default:
                  this._router.navigate(['/home']);
                  this.getDashboardInformation(null);
                  break;
              }
            }else{
              this.stationList = response[0].item.stationLites;
              this.stationActive = this.stationList[0];
              if(!this.validateTaskCreated()){
                this.openTaskCalendar();
              }else{
                this.createTasks();
              }
            }
            break;
          case 5:
          case 6:
            this.stationList = response[0].item.station;
            this.stationActive = this.stationList;
            if(!this.validateTaskCreated()){
              this.openTaskCalendar();
            }else{
              this.createTasks();
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
    if(user.role!==6){
      this._dialogService.confirmDialog(
        'Información',
        'Aún no se ha calendarizado las tareas de la Estación. ¿Desea hacerlo ahora?',
        'SI',
        'MÁS TARDE'
      ).afterClosed().subscribe(response=>{
        switch (response.code){
          case 1:
            this._addStationService.open({disableClose: true, stationId: this.stationActive.id, stepActive: 3});
            break;
          case -1:
            LocalStorageService.setItem('notCalendar', true);
            break;
        }
      });
    }else{
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

  private createTasks():void{
    this._api.buildTaskByStation(this.stationActive.stationTaskId).subscribe(response=>{
      switch (response.code){
        case 200:
          if(!response.item.complete){
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
