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
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {AddStationService} from '@app/components/screen/components/add-gas-station/add-station.service';

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
     private _addStationService: AddStationService
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
            if(onlyOneStationId){
              this.stationList = response[0].item;
              this.stationActive = this.stationList;
            }else{
              this.stationList = response[0].item.stationLites;
              this.stationActive = this.stationList[0];
            }
            break;
          case 5:
          case 6:
            this.stationList = response[0].item.station;
            this.stationActive = this.stationList;
            break;
        }
      }
    });
  }

  public addStation():void{
    this._addStationService.open();
  }
}
