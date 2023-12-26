import { Component, OnInit } from '@angular/core';
import { type FormArray, type FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { ParsedForm, type GameForm, type PurchaseLinksForm, UpdatedForm } from 'src/app/models/game-form/game-form.model';
import { PurchaseLinksComponent } from 'src/app/components/forms/purchase-links/purchase-links-form.component';
import { type TagItem } from 'src/app/models/game-form/tags.model';
import { DateRequiredDirective } from 'src/app/validators/date-required-if.directive';
import { RouterLink } from '@angular/router';
import { ValidationDisplayService } from 'src/app/services/validation-display.service';
import { GamesApiService } from 'src/app/features/services/games-api.service';
import { Game } from 'src/app/features/dto/game.model';
import { AuthUserService } from 'src/app/services/auth-user.service';

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

  public constructor(
    private gameFormService: GameFormService,
    private validationDisplay: ValidationDisplayService,
    private gamesApiService: GamesApiService,
    private authUser: AuthUserService
  ) {}

  public ngOnInit(): void {
    const date: Date = new Date();
    this.date.setDate(date.getDate() + 1);
  }

  public getErrorMessage(controlName: string): string {
    return this.validationDisplay.getErrorMessage(controlName, this.gameForm);
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

      return;
    }

    const parsedForm: ParsedForm = this.gameForm.getRawValue();

    // TODO: Ask the tutor about this because It's getting out of hand with the amount of data conversions I'm doing.
    // Because of the linter config I need explicit types for everything.
    // eslint-disable-next-line complexity
    // this.authUser.getUserId().subscribe((userId: string) => {
    //   const updatedForm: UpdatedForm = {
    //     ...parsedForm,
    //     purchaseLinks: parsedForm.purchaseLinks!.map((link: { purchaseLink: string | null }) => (link.purchaseLink ? link.purchaseLink : '')),
    //     tags: parsedForm.tags?.map((tag: TagItem) => tag.value) ?? [],
    //     owner: userId,
    //     title: parsedForm.title || '',
    //     platform: parsedForm.platform || '',
    //     genre: parsedForm.genre || '',
    //     developer: parsedForm.developer || '',
    //     price: parsedForm.price || 0,
    //     wishlistPriority: parsedForm.wishlistPriority || 0,
    //     releaseStatus: parsedForm.releaseStatus || false,
    //   };
    //   console.log(updatedForm);
    //   this.gamesApiService.createGame(updatedForm).subscribe((response: Game) => {
    //     console.log(response);
    //   });
    // });

    this.authUser.getUserId().subscribe((userId: string) => {
      const updatedForm: any = {
        ...parsedForm,
        purchaseLinks: parsedForm.purchaseLinks!.map((link: { purchaseLink: string | null }) => (link.purchaseLink ? link.purchaseLink : '')),
        tags: parsedForm.tags?.map((tag: TagItem) => tag.value) ?? [],
        owner: userId,
      };
      console.log(updatedForm);
      this.gamesApiService.createGame(updatedForm).subscribe((response: Game) => {
        console.log(response);
      });
    });
  }
}
