/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, HostBinding, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Constants} from 'app/utils/constants/constants.utils';
import {ANIMATION} from '@app/ui/privacy/pages/privacy/animation';
import {LocalStorageService} from '@maplander/core';
import {Person} from '@app/utils/interfaces/person';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
  animations: [ANIMATION]
})
export class PrivacyComponent implements OnInit {

  constructor(
    private _router: Router) {
  }

  @HostBinding('@fadeInAnimation')

  ngOnInit() {
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
}
