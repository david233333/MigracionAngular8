import {Inject, Pipe, PipeTransform} from '@angular/core';
@Pipe({
  name: 'assetspipe'
})
export class AssetspipePipe implements PipeTransform {
  baseUrl: string;
  constructor(@Inject('APP_BASE_HREF') baseHref: string) {
    this.baseUrl = baseHref;
  }

  transform(value: string) {
    const newval = this.baseUrl + value;
    return newval;
  }

}
