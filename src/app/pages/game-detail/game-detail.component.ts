import { CommonModule } from '@angular/common';
import { type HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { type Game } from 'src/app/features/dto/game.model';
import { GamesApiService } from 'src/app/features/services/games-api.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import { NotFoundComponent } from '../not-found/not-found.component';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { RippleModule } from 'primeng/ripple';
import { DlcApiService } from 'src/app/features/services/dlc-api.service';
import { Dlc } from 'src/app/features/dto/dlc.model';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [
    RippleModule,
    InputGroupModule,
    InputGroupAddonModule,
    CommonModule,
    CardModule,
    ButtonModule,
    RouterLink,
    ProgressSpinnerModule,
    BadgeModule,
    TooltipModule,
    ChipModule,
    NotFoundComponent,
  ],
  templateUrl: './game-detail.component.html',
})
export class GameDetailComponent implements OnInit {
  public loading: boolean = true;
  public game: Game | null = null;
  public error: HttpErrorResponse | null = null;
  public constructor(
    private route: ActivatedRoute,
    private gamesApiService: GamesApiService,
    private dlcApiService: DlcApiService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  public ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.gamesApiService.getGame(id).subscribe({
        next: (game: Game) => {
          this.game = game;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.error = error;
          if (this.error.status === 404) {
            this.router.navigate(['/error']);
          }
          this.loading = false;
        },
      });
    }
  }

  public confirmGameDeletion(): void {
    this.confirmationService.confirm({
      header: 'You are about to delete a game',
      message: `This will also delete all DLCs associated with this game!`,
      accept: () => {
        this.deleteGame();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Canceled', detail: 'You have canceled the game deletion' });
      },
    });
  }

  public confirmDlcDeletion(dlcId: string): void {
    this.confirmationService.confirm({
      header: 'You are about to delete a DLC',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.deleteDlc(dlcId);
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Canceled', detail: 'You have canceled the dlc deletion' });
      },
    });
  }

  public deleteGame(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.gamesApiService.deleteGame(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully removed game' });
          this.game = null;
          this.router.navigate(['/dashboard']);
        },
        error: (error: HttpErrorResponse) => {
          this.error = error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed deleting element - ${this.error.status}` });
        },
      });
    }
  }

  public deleteDlc(dlcId: string): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.dlcApiService.deleteDlc(id, dlcId).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully removed dlc' });
          if (this.game) {
            this.game = {
              ...this.game,
              dlcs: this.game.dlcs.filter((dlc: Dlc) => dlc.dlcId !== dlcId),
            };
          }
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed deleting element - ${error.status}` });
        },
      });
    }
  }
}
