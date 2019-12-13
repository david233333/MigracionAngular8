import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment.prod';
import {enableProdMode} from '@angular/core';

/*
if (environment.production) {
  enableProdMode();
  if (window) {
    window.console.log = function () {
    };
  }
}
*/

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
