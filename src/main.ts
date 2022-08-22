import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

//enableProdMode();

/*if (environment.production) {
  enableProdMode();
}*/

// platformBrowserDynamic().bootstrapModule(AppModule, { preserveWhitespaces: false });

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
if (environment.production) {
  enableProdMode();
  if (window) {
    window.console.log = function () { };
  }
}