import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'title'
})
export class TitlePipe implements PipeTransform {

  transform(value: string): unknown {
    if (value.length > 0) {
      const letters = value.split('');
      letters[0] = letters[0].toLocaleUpperCase();
      value = letters.join('');
    }
    return value;
  }

}
