import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [DividerModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {}
