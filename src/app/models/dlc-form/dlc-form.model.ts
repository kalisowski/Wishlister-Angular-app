import type { FormControl } from '@angular/forms';

export interface DlcForm {
  readonly title: FormControl<string | null>;
  readonly price: FormControl<number | null>;
}
