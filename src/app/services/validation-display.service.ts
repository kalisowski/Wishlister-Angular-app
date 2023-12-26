import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationDisplayService {
  public getErrorMessage(controlName: string, form: FormGroup): string {
    const control: AbstractControl | null = form.get(controlName);
    const controlParsed: string = controlName
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .replace(/^./, (str: string) => {
        return str.toUpperCase();
      });

    if (control?.errors?.['required']) {
      return `${controlParsed} is required.`;
    }

    if (control?.errors?.['maxlength']) {
      return `${controlParsed} cannot be longer than ${control.errors['maxlength'].requiredLength} characters.`;
    }
    if (control?.errors?.['dateRequired']) {
      return `${controlParsed} is required if out status set to true.`;
    }
    if (control?.errors?.['pattern']) {
      return `${controlParsed} link must be a valid URL.`;
    }

    return '';
  }
}
