import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Observable } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule, ProgressSpinnerModule],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  protected isAuthenticated$: Observable<boolean> = this.auth.isAuthenticated$;
  protected isLoading$: Observable<boolean> = this.auth.isLoading$;
  public constructor(private auth: AuthService, private router: Router) {}

  protected login(): void {
    this.auth.loginWithRedirect();
  }

  protected redirectToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
