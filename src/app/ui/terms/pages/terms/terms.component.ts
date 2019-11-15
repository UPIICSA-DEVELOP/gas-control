/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';
import {ApiService} from 'app/core/services/api/api.service';
import {LocalStorageService} from 'app/core/services/local-storage/local-storage.service';
import {Constants} from 'app/utils/constants/constants.utils';
import {Router} from '@angular/router';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        query('#terms', style({ opacity: 0, background: 'transparent' }), {optional: true}),
        query('#terms', stagger('10ms', [
          animate('.2s ease-out', keyframes([
            style({opacity: 0, background: 'transparent', offset: 0}),
            style({opacity: .5, background: 'rgba(255, 255, 255, .5)', offset: 0.5}),
            style({opacity: 1, background: 'rgba(255, 255, 255, 1)',  offset: 1.0}),
          ]))]), {optional: true})
      ]),
      transition(':leave', [
        query('#terms', style({ opacity: 1, background: 'rgba(255, 255, 255, 1)' }), {optional: true}),
        query('#terms', stagger('10ms', [
          animate('.2s ease-in', keyframes([
            style({opacity: 1, background: 'rgba(255, 255, 255, 1)', offset: 0}),
            style({opacity: .5, background: 'rgba(255, 255, 255, .5)',  offset: 0.5}),
            style({opacity: 0, background: 'transparent',     offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])
  ],
  host: {'[@fadeInAnimation]': ''},
  encapsulation: ViewEncapsulation.None
})
export class TermsComponent implements OnInit {
  public user: string;
  public company: string;
  public address: string;
  public role: number;
  constructor(
    private _api: ApiService,
    private _router: Router
  ) {
    this.user = '';
    this.company = '';
    this.address = '';
  }

  ngOnInit() {
    this.getCompanyName();
  }

  public redirectTo():void{
    const user = LocalStorageService.getItem(Constants.UserInSession);
    if(user){
      switch(user.role){
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          this._router.navigate(['/home']).then();
          break;
        case 7:
          this._router.navigate(['/admin']).then();
          break;
        default:
          this._router.navigate(['/login']).then();
          break
      }
    }else{
      this._router.navigate(['/login']).then();
    }
  }

  private getCompanyName():void{
    this.user = LocalStorageService.getItem(Constants.UserInSession).completeName;
    this.role = LocalStorageService.getItem(Constants.UserInSession).role;
    switch (this.role){
      case 1:
      case 2:
      case 3:
        this.company = LocalStorageService.getItem(Constants.ConsultancyInSession).name;
        this.getCompanyAddress(false);
        break;
      case 4:
      case 5:
      case 6:
        this.company = LocalStorageService.getItem(Constants.StationInDashboard).name;
        this.getCompanyAddress(true);
        break;
      case 7:
        this.company = '';
        this.address = '';
        break;
      default:
        break;
    }
  }

  private getCompanyAddress(isStation: boolean):void{
    const stationId = LocalStorageService.getItem(Constants.StationInDashboard).id || '';
    const consultancyId = LocalStorageService.getItem(Constants.ConsultancyInSession).id || '';
    if(isStation){
      this._api.getStation(stationId).subscribe(response=>{
        switch (response.code){
          case 200:
            this.address = response.item.address;
            break;
          default:
            this.address = '';
            break;
        }
      });
    }else{
      this._api.getConsultancy(consultancyId).subscribe(response=>{
        if (response.code === HttpResponseCodes.OK) {
          this.address = response.item.address;
        } else {
          this.address = '';
        }
      });
    }
  }
}
