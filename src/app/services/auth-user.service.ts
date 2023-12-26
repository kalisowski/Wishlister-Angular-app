import { Injectable } from '@angular/core';
import { AuthService as Auth0Service, type User } from '@auth0/auth0-angular';
import { type Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  public constructor(private auth0: Auth0Service) {}

  public getUserId(): Observable<string> {
    return this.auth0.user$.pipe(map((user: User | null | undefined) => user?.sub?.replace(/\D/g, '') ?? ''));
  }
}
