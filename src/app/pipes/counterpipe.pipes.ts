import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "counterpipe" })
export class CounterPipe implements PipeTransform {
  transform(value: string): number {
    if(value){
      let count: number = 0;
      
      count = value.length;

      return count;
    
  }
  return -1;
}
}
