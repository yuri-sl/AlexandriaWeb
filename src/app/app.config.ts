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

/** Mediterranean primary palette, using the installed PrimeUIX Aura token API. */
const AlexandriaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#edf7f7',
      100: '#d1e9ea',
      200: '#a4d3d7',
      300: '#73b6bf',
      400: '#3e929e',
      500: '#116b78',
      600: '#0e5c69',
      700: '#0b505b',
      800: '#0b3c47',
      900: '#0b2430',
      950: '#081c25',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
        highlight: {
          background: '#edf7f7',
          focusBackground: '#d1e9ea',
          color: '#0b505b',
          focusColor: '#0b2430',
        },
        formField: {
          background: '#fffdf8',
          borderColor: '#b8bcb8',
          color: '#202a2e',
          placeholderColor: '#586367',
        },
        content: { background: '#fffdf8', borderColor: '#d8d4ca', color: '#202a2e' },
      },
    },
  },
});
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
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
