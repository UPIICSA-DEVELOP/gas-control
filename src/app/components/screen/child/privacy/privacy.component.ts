/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {Constants} from '@app/core/constants.core';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        query('#privacy', style({ opacity: 0, background: 'transparent' }), {optional: true}),
        query('#privacy', stagger('10ms', [
          animate('.2s ease-out', keyframes([
            style({opacity: 0, background: 'transparent', offset: 0}),
            style({opacity: .5, background: 'rgba(255, 255, 255, .5)', offset: 0.5}),
            style({opacity: 1, background: 'rgba(255, 255, 255, 1)',  offset: 1.0}),
          ]))]), {optional: true})
      ]),
      transition(':leave', [
        query('#privacy', style({ opacity: 1, background: 'rgba(255, 255, 255, 1)' }), {optional: true}),
        query('#privacy', stagger('10ms', [
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
export class PrivacyComponent implements OnInit {

  constructor(
    private _router: Router) { }

  ngOnInit() {
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
}
