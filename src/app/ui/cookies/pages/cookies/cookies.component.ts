/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from 'app/core/services/local-storage/local-storage.service';
import {Router} from '@angular/router';
import {Constants} from 'app/utils/constants/constants.utils';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent implements OnInit {

  constructor(
    private _router: Router
  ) {
  }

  ngOnInit() {
  }

  public redirectTo(): void {
    const user = LocalStorageService.getItem(Constants.UserInSession);
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
