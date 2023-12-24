import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface GameForm {
  readonly title: FormControl<string | null>;
  readonly platform: FormControl<string | null>;
  readonly genre: FormControl<string | null>;
  readonly developer: FormControl<string | null>;
  readonly price: FormControl<number | null>;
  readonly wishlistPriority: FormControl<number | null>;
  readonly releaseStatus: FormControl<boolean | null>;
  readonly releaseDate: FormControl<Date | null>;
  readonly selectedTags: FormControl<string[] | null>;
  readonly purchaseLinks: FormArray<FormGroup<PurchaseLinksForm>>;
  readonly personalNotes: FormControl<string | null>;
}

export interface PurchaseLinksForm {
  readonly purchaseLink: FormControl<string | null>;
}
