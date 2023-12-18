import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToolbarModule } from 'primeng/toolbar';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    ToolbarModule,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  public constructor(private router: Router) {}
  protected addNewGame(): void {
    this.router.navigate(['/game/new']);
  }
}
