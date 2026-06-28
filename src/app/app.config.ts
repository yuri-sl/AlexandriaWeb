import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { providePrimeNG } from 'primeng/config';

registerLocaleData(localePt);
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { authInterceptor } from './services/authInterceptor';

/**
 * Alexandria — a gilded preset. The primary ramp is leaf-gold, the colour of
 * Egyptian gilding, so PrimeNG controls sit naturally inside the papyrus theme.
 */
const AlexandriaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fbf7e8',
      100: '#f5ecc5',
      200: '#ecdb96',
      300: '#e1c75f',
      400: '#d8b550',
      500: '#c9a227',
      600: '#a8841d',
      700: '#836619',
      800: '#5f4a14',
      900: '#3d300d',
      950: '#211a06',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    providePrimeNG({
      theme: {
        preset: AlexandriaPreset,
        options: {
          darkModeSelector: false,
        },
      },
    }),
  ],
};
