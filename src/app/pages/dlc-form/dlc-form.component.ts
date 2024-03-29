import { Component, OnInit } from '@angular/core';
import { type FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationDisplayService } from 'src/app/services/validation-display.service';
import { GamesApiService } from 'src/app/features/services/games-api.service';
import type { HttpErrorResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { DlcFormService } from 'src/app/services/dlc-form-service';
import { DlcApiService } from 'src/app/features/services/dlc-api.service';
import { DlcForm } from 'src/app/models/dlc-form/dlc-form.model';
import { CreateDlc } from 'src/app/features/dto/create-dlc.model';
import { Dlc } from 'src/app/features/dto/dlc.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, ProgressSpinnerModule],
  templateUrl: './dlc-form.component.html',
})
export class DlcFormComponent implements OnInit {
  public editForm: boolean = false;
  private dlcId: string | null = null;
  protected dlcForm: FormGroup<DlcForm> = this.dlcFormService.dlcForm;
  protected gameId: string | null = this.route.snapshot.paramMap.has('id') ? this.route.snapshot.paramMap.get('id') : null;
  private initialFormState!: Dlc;
  public loading: boolean = true;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dlcFormService: DlcFormService,
    private validationDisplay: ValidationDisplayService,
    private dlcApiService: DlcApiService,
    private gamesApiService: GamesApiService,
    private location: Location,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  public ngOnInit(): void {
    this.dlcForm.reset();
    this.dlcId = this.route.snapshot.paramMap.get('dlcId');
    if (this.dlcId) {
      this.editForm = true;
      this.dlcApiService.getDlc(this.dlcId).subscribe((dlc: Dlc) => {
        this.initialFormState = dlc;
        this.dlcFormService.setInitialFormState(dlc);
        this.loading = false;
      });
    }
    if (this.gameId) {
      this.gamesApiService
        .getGame(this.gameId)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 404) {
              this.router.navigate(['/error']);
            }

            return of(null);
          })
        )
        .subscribe(() => {
          this.loading = false;
        });
    } else {
      this.router.navigate(['/error']);
    }
  }

  public goBack(): void {
    this.location.back();
  }

  public confirmFormSubmit(): void {
    this.confirmationService.confirm({
      header: 'You are about to submit the form',
      message: `This will ${this.editForm ? 'update' : 'add'} the dlc in the database!`,
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

  public getErrorMessage(controlName: string): string {
    return this.validationDisplay.getErrorMessage(controlName, this.dlcForm);
  }

  public resetForm(): void {
    this.dlcForm.reset();
    if (this.editForm) {
      this.dlcFormService.setInitialFormState(this.initialFormState);
    }
  }

  private sendForm(): void {
    if (this.gameId && !this.dlcId) {
      const dlcData: CreateDlc = this.dlcForm.value as CreateDlc;
      this.dlcApiService.addDlc(this.gameId, dlcData).subscribe(() => this.location.back());
    }
    if (this.dlcId) {
      const dlcData: CreateDlc = this.dlcForm.value as CreateDlc;
      this.dlcApiService.updateDlc(this.dlcId, dlcData).subscribe(() => this.location.back());
    }
  }

  protected onSubmit(): void {
    if (this.dlcForm.invalid) {
      this.dlcForm.markAllAsTouched();

      return;
    }
    this.confirmFormSubmit();
  }
}
