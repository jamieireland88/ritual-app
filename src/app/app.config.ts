import 'hammerjs';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HammerModule } from '@angular/platform-browser';

export function httpTranslateLoader(): unknown {
  return new TranslateHttpLoader();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor])
    ),
    importProvidersFrom(
      HammerModule,
      TranslateModule.forRoot({
        loader: provideTranslateHttpLoader({prefix:"./assets/i18n/", suffix:".json"}),
      })
    )
  ]
};
