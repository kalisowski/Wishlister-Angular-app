import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import type { UpdatedForm, GameForm, ParsedForm, PurchaseLinksForm } from '../models/game-form/game-form.model';
import { type TagItem, groupedTags } from '../models/game-form/tags.model';
import { type Game } from '../features/dto/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameFormService {
  public tags: TagItem[] = groupedTags;
  public purchaseLinks: string[] = [];

  public gameForm: FormGroup<GameForm> = new FormGroup<GameForm>({
    title: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    platform: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    developer: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    wishlistPriority: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(5)]),
    releaseStatus: new FormControl<boolean | null>(false, []),
    releaseDate: new FormControl(null),
    tags: new FormControl<TagItem[]>([], [Validators.required]),
    purchaseLinks: new FormArray<FormGroup<PurchaseLinksForm>>([]),
    personalNotes: new FormControl(null, Validators.maxLength(255)),
  });

  public createUpdatedForm(parsedForm: ParsedForm, userId: string): UpdatedForm {
    return {
      ...parsedForm,
      purchaseLinks: parsedForm.purchaseLinks!.map((link: { purchaseLink: string | null }) => (link.purchaseLink ? link.purchaseLink : '')),
      tags: parsedForm.tags?.map((tag: TagItem) => tag.value) ?? [],
      owner: userId,
      title: parsedForm.title || '',
      platform: parsedForm.platform || '',
      developer: parsedForm.developer || '',
      price: parsedForm.price || 0,
      wishlistPriority: parsedForm.wishlistPriority || 0,
      releaseStatus: parsedForm.releaseStatus || false,
    };
  }

  public setFormValues(game: Game): void {
    const purchaseLinks: FormArray = this.gameForm.get('purchaseLinks') as FormArray;
    while (purchaseLinks.length !== 0) {
      purchaseLinks.removeAt(0);
    }

    game.purchaseLinks.forEach((purchaseLink: string) => {
      purchaseLinks.push(
        new FormGroup({
          purchaseLink: new FormControl(purchaseLink, [Validators.required]),
        })
      );
    });

    const formPartialValues: ParsedForm = {
      title: game.title,
      platform: game.platform,
      developer: game.developer,
      price: game.price,
      wishlistPriority: game.wishlistPriority,
      releaseStatus: game.releaseStatus,
      tags: game.tags.map((tag: string) => ({ label: tag, value: tag })),
      purchaseLinks: purchaseLinks.value,
      releaseDate: null,
      personalNotes: game.personalNotes,
    };

    let formValues: ParsedForm = { ...formPartialValues };

    if (game.releaseDate) {
      formValues = { ...formPartialValues, releaseDate: new Date(game.releaseDate) };
    }

    this.gameForm.setValue(formValues);
  }

  public addPurchaseLink(): void {
    const purchaseLinks: FormArray = this.gameForm.get('purchaseLinks') as FormArray;
    purchaseLinks.push(
      new FormGroup({
        purchaseLink: new FormControl(null, [
          Validators.required,
          Validators.pattern(`^(http://www.|https://www.|http://|https://)[a-zA-Z0-9]+([-.]{1}[a-zA-Z0-9]+)*.[a-zA-Z]{2,5}(:[0-9]{1,5})?(/.*)?$`),
        ]),
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
