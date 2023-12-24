import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { GameForm, PurchaseLinksForm } from '../models/game-form/game-form.model';
import { TagItem, groupedTags } from '../models/game-form/tags.model';

@Injectable({
  providedIn: 'root',
})
export class GameFormService {
  public tags: TagItem[] = groupedTags;
  public purchaseLinks: string[] = [];

  public gameForm: FormGroup<GameForm> = new FormGroup<GameForm>({
    title: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    platform: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    genre: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    developer: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    wishlistPriority: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(5)]),
    releaseStatus: new FormControl<boolean>(false),
    releaseDate: new FormControl(null),
    selectedTags: new FormControl([]),
    purchaseLinks: new FormArray<FormGroup<PurchaseLinksForm>>([], [Validators.required, Validators.pattern('https?://.+')]),
    personalNotes: new FormControl(null, Validators.maxLength(255)),
  });

  public addPurchaseLink(): void {
    const purchaseLinks: FormArray = this.gameForm.get('purchaseLinks') as FormArray;
    purchaseLinks.push(
      new FormGroup({
        purchaseLink: new FormControl(null, Validators.required),
      })
    );
  }

  public removePurchaseLink(index: number): void {
    const purchaseLinks: FormArray = this.gameForm.get('purchaseLinks') as FormArray;
    purchaseLinks.removeAt(index);
  }

  public getPurchaseLinkControlNames(): string[] {
    const purchaseLinks: FormGroup = this.gameForm.get('purchaseLinks') as FormGroup;

    return Object.keys(purchaseLinks.controls);
  }

  public resetFormDynamicFields(): void {
    const purchaseLinks: FormArray = this.gameForm.get('purchaseLinks') as FormArray;
    purchaseLinks.clear();
    this.purchaseLinks = [];
  }
}
