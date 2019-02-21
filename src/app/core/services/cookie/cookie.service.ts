/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Injectable, PLATFORM_ID} from '@angular/core';
import {InjectorInstance} from '@app/core/services/services.module';
import {isPlatformBrowser} from '@angular/common';

export enum MaxAge {
  DAY,
  WEEK,
  MONTH,
  OTHER
}

export interface CookieOptions {
  name: string;
  value: any;
  maxAge: MaxAge;
  days?: number;
}

@Injectable()
export class CookieService {

  constructor(
  ) { }

  public static setCookie(options: CookieOptions): void  {
    if (CookieService.validate()) {
      document.cookie = options.name + "=" + encodeURIComponent( options.value ) +
        "; max-age=" + CookieService.calculateAge(options.maxAge) +
        "; path=/";
    }
  }

  public static getCookie(name: string): any {
    if (CookieService.validate()) {
      let cookie_string = document.cookie ;
      if (cookie_string.length != 0) {
        let cookie_array = cookie_string.split( '; ' );
        for (let i = 0 ; i < cookie_array.length ; i++) {
          let cookie_value = cookie_array[i].match ( name + '=(.*)' );
          if (cookie_value != null) {
            return decodeURIComponent ( cookie_value[1] ) ;
          }
        }
      }
      return null;
    }else{
      return null;
    }
  }

  public static deleteCookie(name: string): void {
    if (CookieService.validate()) {
      document.cookie = name + "=; max-age=0; path=/" ;
    }
  }

  private static calculateAge(maxAge: MaxAge, days?: number): number {
    switch (maxAge) {
      case MaxAge.DAY:
        return  60 * 60 * 24;
      case MaxAge.WEEK:
        return  60 * 60 * 24 * 7;
      case MaxAge.MONTH:
        return  60 * 60 * 24 * 30;
      case MaxAge.OTHER:
        return  60 * 60 * 24 * days;

    }
  }

  private static validate(): boolean {
    const platformId = InjectorInstance.get<any>(PLATFORM_ID);
    return isPlatformBrowser(platformId);
  }
}
