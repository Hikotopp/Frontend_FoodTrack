import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { PEDIDO_REPOSITORY } from './domain/ports/out/pedido.repository.token';
import { PedidoHttpAdapter } from './infrastructure/http/pedido-http.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(FormsModule),
    { provide: PEDIDO_REPOSITORY, useClass: PedidoHttpAdapter }
  ]
};