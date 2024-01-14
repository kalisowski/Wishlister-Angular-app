import { Component, OnInit } from '@angular/core';
import { type FormArray, type FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, Location } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { GameFormService } from 'src/app/services/game-form.service';
import { ParsedForm, type GameForm, type PurchaseLinksForm, UpdatedForm } from 'src/app/models/game-form/game-form.model';
import { PurchaseLinksComponent } from 'src/app/components/forms/purchase-links/purchase-links-form.component';
import { type TagItem } from 'src/app/models/game-form/tags.model';
import { DateRequiredDirective } from 'src/app/validators/date-required-if.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationDisplayService } from 'src/app/services/validation-display.service';
import { GamesApiService } from 'src/app/features/services/games-api.service';
import { type Game } from 'src/app/features/dto/game.model';
import { AuthUserService } from 'src/app/services/auth-user.service';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [
    DateRequiredDirective,
    PurchaseLinksComponent,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputGroupModule,
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
  public editForm: boolean = false;
  protected gameForm: FormGroup<GameForm> = this.gameFormService.gameForm;
  protected tags: TagItem[] = this.gameFormService.tags;
  protected date: Date = new Date();
  protected tomorrow: string = '';
  protected gameId: string | null = null;
  private initialFormState!: Game;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameFormService: GameFormService,
    private validationDisplay: ValidationDisplayService,
    private gamesApiService: GamesApiService,
    private authUser: AuthUserService,
    private location: Location
  ) {}

  public ngOnInit(): void {
    const date: Date = new Date();
    this.date.setDate(date.getDate() + 1);
    this.gameId = this.route.snapshot.paramMap.get('id');
    if (this.gameId) {
      this.editForm = true;
      this.gamesApiService.getGame(this.gameId).subscribe((game: Game) => {
        this.gameFormService.setFormValues(game);
        this.initialFormState = game;
      });
    }
  }

  public goBack(): void {
    this.location.back();
  }

  public getErrorMessage(controlName: string): string {
    return this.validationDisplay.getErrorMessage(controlName, this.gameForm);
  }

  public dateErrorStatus(): boolean {
    return this.gameForm.errors?.['dateRequired'] ?? false;
  }

  public resetDate(): void {
    this.gameForm.controls.releaseDate.setValue(null);
  }

  // Function necessary because calendar component doesn't work with ngStyle (UI library making stuff easier irony)
  public getStyleClass(): string {
    return this.dateErrorStatus() && (this.gameForm.controls.releaseDate.dirty || this.gameForm.controls.releaseDate.touched) ? 'ng-invalid ng-dirty' : '';
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

  public resetForm(): void {
    this.gameFormService.resetFormDynamicFields();

    if (this.editForm) {
      this.gameFormService.setFormValues(this.initialFormState);
    }
  }

  private createUpdatedForm(parsedForm: ParsedForm, userId: string): UpdatedForm {
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

  protected onSubmit(): void {
    if (this.gameForm.invalid) {
      this.gameForm.markAllAsTouched();

      return;
    }

    const parsedForm: ParsedForm = this.gameForm.getRawValue();
    this.authUser.getUserId().subscribe((userId: string) => {
      const updatedForm: UpdatedForm = this.createUpdatedForm(parsedForm, userId);

      if (this.gameId) {
        this.gamesApiService.updateGame(this.gameId, updatedForm).subscribe(() => {
          this.router.navigate(['/game', this.gameId]);
        });
      } else {
        this.gamesApiService.createGame(updatedForm).subscribe(() => {
          this.router.navigate(['/dashboard']);
        });
      }
    });
  }
}
