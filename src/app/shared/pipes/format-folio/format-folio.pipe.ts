import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatFolio'
})
export class FormatFolioPipe implements PipeTransform {

  transform(value: string): string {
    try {
      value = value.toString();
      switch (value.length){
        case 1:
          value = '00000'+value;
          break;
        case 2:
          value = '0000'+value;
          break;
        case 3:
          value = '000'+value;
          break;
        case 4:
          value = '00'+value;
          break;
        case 5:
          value = '0'+value;
          break;
      }
      return value;
    }catch (e){
      console.error(e);
      return null;
    }
  }

}
