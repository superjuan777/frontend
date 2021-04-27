import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reserved'
})
export class ReservedPipe implements PipeTransform {

  public transform(value: any) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");;
  }

}
