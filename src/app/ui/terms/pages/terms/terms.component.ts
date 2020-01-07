/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, HostBinding, OnInit} from '@angular/core';
import {ApiService} from 'app/core/services/api/api.service';
import {Constants} from 'app/utils/constants/constants.utils';
import {Router} from '@angular/router';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {ANIMATION} from '@app/ui/terms/pages/terms/animation';
import {EntityResponse} from '@app/utils/class/entity-response';
import {Station} from '@app/utils/interfaces/station';
import {Person} from '@app/utils/interfaces/person';
import {LocalStorageService} from '@maplander/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  animations: [ANIMATION]
})
export class TermsComponent implements OnInit {
  @HostBinding('@fadeInAnimation')

  public user: Person;
  public company: string;
  public address: string;
  public role: number;

  constructor(
    private _api: ApiService,
    private _router: Router
  ) {
    this.user = null;
    this.company = '';
    this.address = '';
  }

  ngOnInit() {
    this.getCompanyName();
  }

  public redirectTo(): void {
    const user = LocalStorageService.getItem<Person>(Constants.UserInSession);
    if (user) {
      switch (user.role) {
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
          break;
      }
    } else {
      this._router.navigate(['/login']).then();
    }
  }

  private getCompanyName(): void {
    this.role = LocalStorageService.getItem<Person>(Constants.UserInSession).role;
    switch (this.role) {
      case 1:
      case 2:
      case 3:
        this.company = LocalStorageService.getItem<{id: string, name: string}>(Constants.ConsultancyInSession).name;
        this.getCompanyAddress(false);
        break;
      case 4:
      case 5:
      case 6:
        this.company = LocalStorageService.getItem<{id: string, name: string}>(Constants.StationInDashboard).name;
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

  private getCompanyAddress(isStation: boolean): void {
    const stationId = LocalStorageService.getItem<{id: string, name: string}>(Constants.StationInDashboard).id || '';
    const consultancyId = LocalStorageService.getItem<{id: string, name: string}>(Constants.ConsultancyInSession).id || '';
    if (isStation) {
      this._api.getStation(stationId).subscribe((response: EntityResponse<Station>) => {
        if (response.code === HttpResponseCodes.OK) {
          this.address = response.item.address;
        } else {
          this.address = '';
        }
      });
    } else {
      this._api.getConsultancy(consultancyId).subscribe(response => {
        if (response.code === HttpResponseCodes.OK) {
          this.address = response.item.address;
        } else {
          this.address = '';
        }
      });
    }
  }
}
