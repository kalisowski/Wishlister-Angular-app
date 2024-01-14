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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterLink, ProgressSpinnerModule, ConfirmDialogModule, BadgeModule],
  templateUrl: './game-detail.component.html',
})
export class GameDetailComponent implements OnInit {
  public loading: boolean = true;
  public game: Game | null = null;
  public error: HttpErrorResponse | null = null;
  public constructor(
    private route: ActivatedRoute,
    private gamesApiService: GamesApiService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  public confirm(): void {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.deleteGame();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Canceled', detail: 'You have canceled the deletion' });
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
          console.error(error);
        },
      });
    }
  }

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
          this.loading = false;
          console.error(error);
        },
      });
    }
  }
}
