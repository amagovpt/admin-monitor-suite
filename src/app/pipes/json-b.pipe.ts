import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonB'
})
export class JsonBPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(value){
      return JSON.stringify(value,null, 2);
    }
    return '';
  }

}
