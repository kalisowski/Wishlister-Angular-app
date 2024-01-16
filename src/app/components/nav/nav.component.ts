import { CommonModule, DOCUMENT } from '@angular/common';
import type { OnDestroy, OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AuthModule } from '@auth0/auth0-angular';
import type { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, MenubarModule, AuthModule, ProgressBarModule],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit, OnDestroy {
  protected loading: boolean = true;
  protected items: MenuItem[] = [];

  public constructor(protected auth: AuthService, @Inject(DOCUMENT) private doc: Document) {}

  public loginWithRedirect(): void {
    this.auth.loginWithRedirect();
  }

  protected logout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: this.doc.location.origin,
      },
    });
  }

  public ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      this.items = [
        {
          label: 'Home',
          icon: 'pi pi-home',
          routerLink: '/home',
        },
      ];

      if (isAuthenticated) {
        this.items.push({
          label: 'Dashboard',
          icon: 'pi pi-chart-bar',
          routerLink: '/dashboard',
        });
      }

      this.items.push({
        label: isAuthenticated ? 'Logout' : 'Login',
        icon: 'pi pi-user',
        command: () => (isAuthenticated ? this.logout() : this.loginWithRedirect()),
      });
      this.loading = false;
    });
  }

  public ngOnDestroy(): void {
    this.loading = true;
  }
}
