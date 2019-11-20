/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Injectable} from '@angular/core';
import {UtilitiesService} from 'app/utils/utilities/utilities';

@Injectable()
export class SessionStorageService {

  constructor() {
  }

  static setItem(key: string, value: any): void {
    if (SessionStorageService.validate()) {
      if (typeof value === 'object') {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      } else {
        window.sessionStorage.setItem(key, value);
      }
    }
  }

  static getItem(key: string): any {
    if (SessionStorageService.validate()) {
      if (UtilitiesService.isValidJson(window.sessionStorage.getItem(key))) {
        return JSON.parse(window.sessionStorage.getItem(key));
      } else {
        return window.sessionStorage.getItem(key);
      }
    }
    return null;
  }

  static removeItem(key: string): any {
    if (SessionStorageService.validate()) {
      window.sessionStorage.removeItem(key);
    }
  }

  private static validate(): boolean {
    return window.sessionStorage !== null;
  }
}
