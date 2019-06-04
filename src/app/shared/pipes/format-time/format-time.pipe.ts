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

  transform(value: any): string {
    if(value === '' || value === undefined || value === null){
      return '';
    }
    if(typeof value !== 'string'){
      value = value.toString();
    }
    if(value.length < 4){
      switch (value.length){
        case 1:
          value = '000' + value;
          break;
        case 2:
          value = '00' + value;
          break;
        case 3:
          value = '0' + value;
          break;
      }
    }
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
      hr = hr.toString();
      if(hr === '00'){
        hr='12';
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
