/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/internal/operators';

@Injectable()
export class RouterStateService {

  private _history = [];

  constructor(
    private router: Router
  ) {
  }

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this._history = [...this._history, urlAfterRedirects];
      });
  }

  public getHistory(): string[] {
    return this._history;
  }

  public getPreviousUrl(): string {
    return this._history[this._history.length - 2] || '/';
  }
}
