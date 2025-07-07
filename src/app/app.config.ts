import {
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import {
  provideIcons,
  provideNgIconLoader,
  provideNgIconsConfig,
  withCaching,
} from '@ng-icons/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  heroSquares2x2,
  heroCog6Tooth,
  heroHome,
  heroUser,
  heroArrowRightOnRectangle,
  heroSun,
  heroMoon,
} from '@ng-icons/heroicons/outline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideNgIconsConfig({
      size: '1.5em',
    }),
    provideIcons({
      heroSquares2x2,
      heroCog6Tooth,
      heroUser,
      heroArrowRightOnRectangle,
      heroHome,
      heroSun,
      heroMoon,
    }),
    provideNgIconLoader(ngIconLoader, withCaching()),
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
  ],
};

function ngIconLoader(name: string) {
  const http = inject(HttpClient);
  return http.get(`/assets/icons/${name}.svg`, { responseType: 'text' });
}
