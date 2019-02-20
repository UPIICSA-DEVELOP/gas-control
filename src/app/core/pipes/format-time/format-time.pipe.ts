/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: string): string {
    let time;
    let hr;
    let min;
    try{
      time = Number(value);
      hr = value.slice(0,2);
      min = value.slice(2);
      if(hr>12){
        hr = hr-12
      }
      hr = hr.length===2?hr:'0'+hr;
      value = hr + ':' + min;
      value += (time >= 0 && time < 1200)? ' a.m.':' p.m.';
    }catch (e){
      console.error(e);
      return null;
    }
    return value;
  }

}
