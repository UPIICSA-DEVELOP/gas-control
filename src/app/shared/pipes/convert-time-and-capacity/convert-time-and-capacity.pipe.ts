/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'convertTimeAndCapacity'
})
export class ConvertTimeAndCapacityPipe implements PipeTransform {

  transform(value: string): string {
    try {
      let hr = Number(value);
      if (hr >= 0 && hr < 1200) {
        value = [value.slice(0, 2), ':', value.slice(2)].join('');
        value += ' a.m.';
      } else {
        hr /= 2;
        value = (hr < 1000 ? '0' : '') + hr.toString();
        value = [value.slice(0, 2), ':', value.slice(2)].join('');
        value += ' p.m.';
      }
    } catch (e) {
      console.error(e);
      return null;
    }
    return value;
  }

}
