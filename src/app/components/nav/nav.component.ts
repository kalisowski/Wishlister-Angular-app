import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AuthModule, AuthService } from '@auth0/auth0-angular';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    AuthModule,
    ProgressBarModule,
    ToastModule,
  ],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit, OnDestroy {
  protected loading: boolean = true;
  protected items: MenuItem[] = [];

  public constructor(
    protected auth: AuthService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

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
        command: () =>
          isAuthenticated ? this.logout() : this.loginWithRedirect(),
      });
      this.loading = false;
    });
  }

  public ngOnDestroy(): void {
    this.loading = true;
  }
}
