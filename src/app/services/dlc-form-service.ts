import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DlcForm } from '../models/dlc-form/dlc-form.model';
import { Dlc } from '../features/dto/dlc.model';

@Injectable({
  providedIn: 'root',
})
export class DlcFormService {
  public dlcForm: FormGroup<DlcForm> = new FormGroup<DlcForm>({
    title: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
  });

  public setInitialFormState(dlc: Dlc): void {
    this.dlcForm.setValue({
      title: dlc.title,
      price: dlc.price,
    });
  }
}
