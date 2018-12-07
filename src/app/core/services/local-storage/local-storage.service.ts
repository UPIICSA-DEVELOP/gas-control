/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { Injectable } from '@angular/core';
import {UtilitiesService} from '@app/core/utilities/utilities.service';

declare var window: any;

@Injectable()
export class LocalStorageService {

  constructor() { }

  static setItem(key: string, value: any): void{
    if(LocalStorageService.validate()){
      if (typeof value === 'object') {
        window.localStorage.setItem(key, JSON.stringify(value));
      } else {
        window.localStorage.setItem(key, value);
      }
    }
  }

  static getItem(key: string): any{
    if(LocalStorageService.validate()){
      if (UtilitiesService.isValidJson(window.localStorage.getItem(key))) {
        return JSON.parse(window.localStorage.getItem(key));
      } else {
        return window.localStorage.getItem(key);
      }
    }
    return null;
  }

  static removeItem(key: string): any{
    if(LocalStorageService.validate()){
      window.localStorage.removeItem(key);
    }
  }

  private static validate(): boolean{
    return window.localStorage;
  }
}
