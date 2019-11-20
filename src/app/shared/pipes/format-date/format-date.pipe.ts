/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: Date, isDay: boolean): string {
    let date: string;
    try {
      if (!isDay) {
        const month = value.getMonth();
        switch (month) {
          case 0:
            date = 'Ene';
            break;
          case 1:
            date = 'Feb';
            break;
          case 2:
            date = 'Mar';
            break;
          case 3:
            date = 'Abr';
            break;
          case 4:
            date = 'May';
            break;
          case 5:
            date = 'Jun';
            break;
          case 6:
            date = 'Jul';
            break;
          case 7:
            date = 'Ago';
            break;
          case 8:
            date = 'Sep';
            break;
          case 9:
            date = 'Oct';
            break;
          case 10:
            date = 'Nov';
            break;
          case 11:
            date = 'Dic';
            break;
        }
      } else {
        date = value.getDate().toString();
      }
    } catch (e) {
      console.error(e);
      return null;
    }
    return date;
  }

}
