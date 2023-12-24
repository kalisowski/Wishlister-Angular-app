import { Component, OnInit } from '@angular/core';
import { type FormArray, type FormGroup, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { GameFormService } from 'src/app/services/game-form.service';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { type GameForm, type PurchaseLinksForm } from 'src/app/models/game-form/game-form.model';
import { PurchaseLinksComponent } from 'src/app/components/forms/purchase-links/purchase-links-form.component';
import { type TagItem } from 'src/app/models/game-form/tags.model';
import { DateRequiredDirective } from 'src/app/validators/date-required-if.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [
    RouterLink,
    MessagesModule,
    MessageModule,
    DateRequiredDirective,
    PurchaseLinksComponent,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputGroupModule,
    InputGroupAddonModule,
    MultiSelectModule,
    CheckboxModule,
    InputTextModule,
    CalendarModule,
    ToggleButtonModule,
  ],
  animations: [],
  templateUrl: './game-form.component.html',
})
export class GameFormComponent implements OnInit {
  protected gameForm: FormGroup<GameForm> = this.gameFormService.gameForm;
  protected tags: TagItem[] = this.gameFormService.tags;
  protected date: Date = new Date();
  protected tomorrow: string = '';

  public constructor(private gameFormService: GameFormService) {}

  public ngOnInit(): void {
    const date: Date = new Date();
    this.date.setDate(date.getDate() + 1);
  }

  public get purchaseLinks(): FormArray<FormGroup<PurchaseLinksForm>> {
    return this.gameForm.controls.purchaseLinks as FormArray<FormGroup<PurchaseLinksForm>>;
  }

  public addPurchaseLink(): void {
    this.gameFormService.addPurchaseLink();
  }

  public removePurchaseLink(index: number): void {
    this.gameFormService.removePurchaseLink(index);
  }

  public resetFormDynamicFields(): void {
    this.gameFormService.resetFormDynamicFields();
  }

  protected onSubmit(): void {
    if (this.gameForm.invalid) {
      this.gameForm.markAllAsTouched();
      console.log(this.gameForm.controls);

      return;
    }
    console.log(this.gameForm.value);
  }

  protected getErrorMessage(controlName: string): string {
    const control: AbstractControl | null = this.gameForm.get(controlName);

    if (control?.errors?.['required']) {
      return `${controlName} is required.`;
    }

    if (control?.errors?.['maxlength']) {
      return `${controlName} cannot be longer than ${control.errors['maxlength'].requiredLength} characters.`;
    }
    if (this.gameForm.errors?.['dateRequired']) {
      return 'Release date is required if out status set to true.';
    }
    if (this.gameForm.errors?.['pattern']) {
      return 'Purchase link must be a valid URL.';
    }

    return '';
  }
}
