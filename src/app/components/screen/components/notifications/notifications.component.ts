/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, PLATFORM_ID, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({right: '-100%'}),
        animate('.40s ease-out', style({right: '0'}))
      ]),
      transition(':leave', [
        style({right: '0'}),
        animate('.40s ease-in', style({right: '-100%'}))
      ])
    ])
  ],
  host: {'[@fadeInAnimation]': ''}
})
export class NotificationsComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    @Inject(PLATFORM_ID) private _platformId: string,
    @Inject(DOCUMENT) private _document: Document,
    private _route: Router
  ) {
  }

  ngOnInit() {
  }

  public onCloseNotifications(): void {
    this._route.navigate(['/home']);
  }

  ngAfterViewInit(): void {
    this.resizeElements(true);
  }

  ngOnDestroy(): void {
    this.resizeElements(false);
  }

  private resizeElements(open: boolean): void {
    if (isPlatformBrowser(this._platformId)) {
      let detail: HTMLElement = this._document.getElementById('detail');
      let timeOut: number = 0;
      if (!detail) {
        timeOut = 500;
      }
      setTimeout(() => {
        if (timeOut !== 0) {
          detail = this._document.getElementById('detail');
        }

      }, timeOut);
    }
  }
}
