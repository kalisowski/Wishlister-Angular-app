import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { AuthModule } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      AuthModule.forRoot({
        domain: 'dev-71cjpqt0pxlw04sl.us.auth0.com',
        clientId: '6PwvJ0QOACVUe2aoJHfi2jS5DtNGZbb2',
        authorizationParams: {
          redirect_uri: window.location.origin,
        },
      })
    ),
  ],
};
