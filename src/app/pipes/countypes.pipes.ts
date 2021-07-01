import {Pipe, PipeTransform} from '@angular/core'

@Pipe({name: 'countypes'})
export class CountTypesPipe implements PipeTransform {
  transform(value: string): number {
        let countTypes:number = 0;
        let auxstring: string = "";
        let split1: string[] = [];;
        let numberarray: number[] = []; 
    
        auxstring = value.slice(1,-1)
        
        split1 = auxstring.split(",");
    
       
        
        countTypes = split1.length;
    


    return countTypes;
  }
}
