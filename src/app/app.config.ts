import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './presentation/interceptors/auth.interceptor';
import { routes } from './app.routes';
import { TABLE_PORT } from './domain/ports/table-port.token';
import { TableHttpAdapter } from './infrastructure/adapters/http/table-http.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'es-CO' },
    { provide: TABLE_PORT, useExisting: TableHttpAdapter }
  ]
};
