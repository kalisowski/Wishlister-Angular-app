import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import type { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import type { PurchaseLinksForm } from 'src/app/models/game-form/game-form.model';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { ValidationDisplayService } from 'src/app/services/validation-display.service';

@Component({
  selector: 'app-purchase-links-form',
  standalone: true,
  imports: [RippleModule, InputTextModule, InputGroupModule, InputGroupAddonModule, ReactiveFormsModule, ButtonModule, CommonModule],
  templateUrl: './purchase-links-form.component.html',
})
export class PurchaseLinksComponent {
  @Input() public purchaseLinksForm!: FormGroup<PurchaseLinksForm>;
  @Output() public remove: EventEmitter<number> = new EventEmitter<number>();

  public constructor(private validationDisplay: ValidationDisplayService) {}

  public getErrorMessage(controlName: string): string {
    return this.validationDisplay.getErrorMessage(controlName, this.purchaseLinksForm);
  }
}
