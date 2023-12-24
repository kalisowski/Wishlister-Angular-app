import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
  selector: '[appDateRequired]',
  standalone: true,
  providers: [
    { provide: NG_VALIDATORS, useExisting: DateRequiredDirective, multi: true },
  ],
})
export class DateRequiredDirective implements Validator {
  public validate(control: AbstractControl): ValidationErrors | null {
    const releaseStatus: boolean = (control as FormGroup).controls[
      'releaseStatus'
    ].value;

    const releaseDate: boolean = (control as FormGroup).controls['releaseDate']
      .value;

    if (releaseStatus && !releaseDate) {
      return { dateRequired: true };
    }

    return null;
  }
}
