import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { GamesApiService } from 'src/app/features/services/games-api.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { Game } from 'src/app/features/dto/game.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonModule, InputGroupModule, InputGroupAddonModule, ToolbarModule, InputTextModule, CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  protected games: Game[] = [];
  public constructor(private router: Router, private gamesApiService: GamesApiService, private authUser: AuthUserService) {}
  protected addNewGame(): void {
    this.router.navigate(['/game/new']);
  }

  public ngOnInit(): void {
    this.gamesApiService.getGames().subscribe((games: Game[]) => {
      this.games = games;
    });
  }
}
