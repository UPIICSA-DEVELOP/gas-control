import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatFolio'
})
export class FormatFolioPipe implements PipeTransform {

  transform(value: number): string {
    let result = '';
    try {
      switch (value.toString().length) {
        case 1:
          result = `00000${value}`;
          break;
        case 2:
          result = `0000${value}`;
          break;
        case 3:
          result = `000${value}`;
          break;
        case 4:
          result = `00${value}`;
          break;
        case 5:
          result = `0${value}`;
          break;
        default:
          result = value.toString();
          break;
      }
      return result;
    } catch (e) {
      return result;
    }
  }

}
