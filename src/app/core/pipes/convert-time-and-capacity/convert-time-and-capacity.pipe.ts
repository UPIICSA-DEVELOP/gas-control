/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertTimeAndCapacity'
})
export class ConvertTimeAndCapacityPipe implements PipeTransform {

  transform(value: string, time: boolean): string {
    try {
      if (time) {
        let hr = Number(value);
        value = [value.slice(0,2), ':', value.slice(2)].join('');
        value += (hr >= 0 && hr < 1200)? ' a.m.':' p.m.';
      }else{
        let capacity;
        capacity = Number(value);
        value = (capacity<1000)?capacity.toString() + ' (lts)':(capacity/1000).toString() + ' mil (lts)';
      }
    }catch (e) {
      console.error(e);
      return null;
    }
    return value;
  }

}