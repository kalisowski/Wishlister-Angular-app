import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AuthClientConfig } from '@auth0/auth0-angular';

new AuthClientConfig({
  domain: 'dev-71cjpqt0pxlw04sl.us.auth0.com',
  clientId: '6PwvJ0QOACVUe2aoJHfi2jS5DtNGZbb2',
});

bootstrapApplication(AppComponent, appConfig)
  // eslint-disable-next-line no-console
  .catch((err: Error) => console.error(err));
