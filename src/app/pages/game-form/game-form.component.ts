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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ThisReceiver } from '@angular/compiler';
import { EMPTY, catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

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
    ProgressSpinnerModule,
  ],
  templateUrl: './game-form.component.html',
})
export class GameFormComponent implements OnInit {
  public editForm: boolean = false;
  public gameForm: FormGroup<GameForm> = this.gameFormService.gameForm;
  public tags: TagItem[] = this.gameFormService.tags;
  public date: Date = new Date();
  public tomorrow: string = '';
  public gameId: string | null = null;
  private initialFormState!: Game;
  public loading: boolean = false;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameFormService: GameFormService,
    private validationDisplay: ValidationDisplayService,
    private gamesApiService: GamesApiService,
    private authUser: AuthUserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private location: Location
  ) {}

  public ngOnInit(): void {
    this.resetForm();
    const date: Date = new Date();
    this.date.setDate(date.getDate() + 1);
    this.gameId = this.route.snapshot.paramMap.get('id');
    if (this.gameId) {
      this.loading = true;
      this.editForm = true;
      this.gamesApiService.getGame(this.gameId).subscribe((game: Game) => {
        this.gameFormService.setFormValues(game);
        this.initialFormState = game;
        this.loading = false;
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
    this.gameForm.reset();
    this.gameFormService.resetFormDynamicFields();

    if (this.editForm) {
      this.gameFormService.setFormValues(this.initialFormState);
    }
  }

  public confirmFormSubmit(): void {
    this.confirmationService.confirm({
      header: 'You are about to submit the form',
      message: `This add or update the game in the database!`,
      accept: () => {
        this.sendForm();
      },
    });
  }

  public confirmFormReset(): void {
    this.confirmationService.confirm({
      header: 'You are about to reset the form',
      message: `This will revert the form to its initial state!`,
      accept: () => {
        this.resetForm();
        this.messageService.add({ severity: 'info', summary: 'Reset', detail: 'Form has been reset' });
      },
    });
  }

  public confirmFormCancel(): void {
    this.confirmationService.confirm({
      header: 'You are about to leave the form',
      message: `This will discard all changes!`,
      accept: () => {
        this.goBack();
        this.messageService.add({ severity: 'info', summary: 'Canceled', detail: 'Form has been discarded' });
      },
    });
  }

  protected onSubmit(): void {
    if (this.gameForm.invalid) {
      this.gameForm.markAllAsTouched();
      console.log(this.gameForm);

      return;
    }
    this.confirmFormSubmit();
  }

  private sendForm(): void {
    const parsedForm: ParsedForm = this.gameForm.getRawValue();

    this.authUser.getUserId().subscribe((userId: string) => {
      const updatedForm: UpdatedForm = this.gameFormService.createUpdatedForm(parsedForm, userId);

      if (this.gameId) {
        this.gamesApiService
          .updateGame(this.gameId, updatedForm)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              console.log(error);
              this.messageService.add({ severity: 'error', summary: `Error ${error.status}`, detail: `Failed to update the game: ${error.statusText}` });

              return EMPTY;
            })
          )
          .subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Game has been updated' });
            this.router.navigate(['/game', this.gameId]);
          });
      } else {
        this.gamesApiService
          .createGame(updatedForm)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              console.log(error);
              this.messageService.add({ severity: 'error', summary: `Error ${error.status}`, detail: `Failed to create the game: ${error.statusText}` });

              return EMPTY;
            })
          )
          .subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Game has been added' });
            this.router.navigate(['/dashboard']);
          });
      }
    });
  }
}
