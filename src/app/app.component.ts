import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavComponent,
    FooterComponent,
    DividerModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public title: string = 'Wishlister';

  public constructor(private primengConfig: PrimeNGConfig) {}

  public ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
}
