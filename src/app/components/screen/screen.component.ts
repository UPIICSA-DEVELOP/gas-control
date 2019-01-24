/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {Component, DoCheck, OnInit} from '@angular/core';
import {ApiService} from '@app/core/services/api/api.service';
import {CookieService} from '@app/core/services/cookie/cookie.service';
import {Constants} from '@app/core/constants.core';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionStorageService} from '@app/core/services/session-storage/session-storage.service';
import {DatepickerService} from '@app/core/components/datepicker/datepicker.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss']
})
export class ScreenComponent implements OnInit, DoCheck {

  public stationList: any[];
  public stationActive: any;
  public role: number;
  public menu: boolean;
  public utils: any;
  private _stationId;
  constructor(
    private _api: ApiService,
    private _router: Router,
    private _activateRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.getUtilities();
    this.menu = true;
    this.stationList = [];
  }
  ngDoCheck():void{
    if (this._activateRoute.snapshot.queryParams.station) {
      this._stationId = this._activateRoute.snapshot.queryParams.station;
      this.getStation();
    } else {
      this.getStationList();
    }
  }

  private getStationList(): void {
    const userId = CookieService.getCookie(Constants.IdSession);
    const user = SessionStorageService.getItem(Constants.UserInSession);
    this.role = user.role;
    switch (user.role) {
      case 1:
      case 2:
      case 3:
        this._api.getConsultancyBasicData(userId, user.refId).subscribe(response => {
          switch (response.code) {
            case 200:
              this.stationList = response.item.stationLites;
              if (!this.stationActive) {
                this.stationActive = this.stationList[0];
              }
              break;
            default:
              break;
          }
        });
        break;
      case 4:
        this._api.getLegalRepresentativeBasicData(user.refId, userId).subscribe(response=>{
          switch (response.code) {
            case 200:
              this.stationList = response.item.stationLites;
              if (!this.stationActive) {
                this.stationActive = this.stationList[0];
              }
              break;
            default:
              break;
          }
        });
        break;
      case 5:
      case 6:
      case 7:
        this._api.getStationBasicData(userId).subscribe(response=>{
          switch (response.code) {
            case 200:
              this.stationList = response.item.station;
              this.stationActive = this.stationList;
              break;
            default:
              break;
          }
        });
        break;
    }
  }

  public getStation(): void {
    this._api.getStation(this._stationId).subscribe(response => {
      switch (response.code) {
        case 200:
          this.stationActive = response.item;
          this.getStationList();
          break;
        default:
          break;
      }
    });
  }

  private getUtilities(): void{
    this._api.getUtils().subscribe(response=>{
      switch (response.code) {
        case 200:
          this.utils = response.item;
          break;
        default:
          break;
      }
    })
  }

  public addCollaborator():void{
    SessionStorageService.setItem('refId', this.stationActive.id);
    this._router.navigate(['/home/add-collaborator'])
  }
}
