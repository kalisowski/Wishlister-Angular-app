import type { FormArray, FormControl, FormGroup } from '@angular/forms';
import type { TagItem } from './tags.model';

export interface GameForm {
  readonly title: FormControl<string | null>;
  readonly platform: FormControl<string | null>;
  readonly developer: FormControl<string | null>;
  readonly price: FormControl<number | null>;
  readonly wishlistPriority: FormControl<number | null>;
  readonly releaseStatus: FormControl<boolean | null>;
  readonly releaseDate: FormControl<Date | null>;
  readonly tags: FormControl<TagItem[] | null>;
  readonly purchaseLinks: FormArray<FormGroup<PurchaseLinksForm>>;
  readonly personalNotes: FormControl<string | null>;
}

export interface ParsedForm {
  readonly title: string | null;
  readonly platform: string | null;
  readonly developer: string | null;
  readonly price: number | null;
  readonly wishlistPriority: number | null;
  readonly releaseStatus: boolean | null;
  readonly releaseDate: Date | null;
  readonly tags: TagItem[] | null;
  readonly purchaseLinks: { readonly purchaseLink: string | null }[];
  readonly personalNotes: string | null;
}

export interface UpdatedForm {
  readonly title: string;
  readonly platform: string;
  readonly developer: string;
  readonly price: number;
  readonly wishlistPriority: number;
  readonly releaseStatus: boolean;
  readonly releaseDate: Date | null;
  readonly tags: string[];
  readonly purchaseLinks: string[];
  readonly personalNotes: string | null;
  readonly owner: string;
}

export type PurchaseLinksForm = Readonly<{
  purchaseLink: FormControl<string | null>;
}>;
