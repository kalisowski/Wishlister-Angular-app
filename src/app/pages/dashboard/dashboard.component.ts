import type { OnDestroy, OnInit } from '@angular/core';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { GamesApiService } from 'src/app/features/services/games-api.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { type Game } from 'src/app/features/dto/game.model';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { type Observable, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { type HttpErrorResponse } from '@angular/common/http';
import type { PaginatorState } from 'primeng/paginator';
import { PaginatorModule } from 'primeng/paginator';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ToggleButtonModule,
    ProgressSpinnerModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    ToolbarModule,
    InputTextModule,
    CommonModule,
    MessagesModule,
    MessageModule,
    TriStateCheckboxModule,
    PaginatorModule,
    BadgeModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  public activeSortButton: string = 'title';
  public activeSearchButton: string = 'title';
  public buttonSortStates: { [key: string]: { state: boolean; class: string } } = {
    title: { state: false, class: 'sm:col-2' },
    platform: { state: false, class: 'sm:col-2' },
    tags: { state: false, class: 'sm:col-2' },
    developer: { state: false, class: 'sm:col-2' },
    releaseDate: { state: false, class: 'sm:col-2' },
    wishlistPriority: { state: false, class: 'sm:col-1' },
    price: { state: false, class: 'sm:col-1' },
  };
  public buttonSearchStates: { [key: string]: boolean } = {
    title: true,
    platform: false,
    tags: false,
    developer: false,
    price: false,
    wishlistPriority: false,
    releaseDate: false,
  };
  public dateState: boolean | null = null;
  public displayMobile: boolean = false;
  public games: Game[] = [];
  public processedGames: Game[] = [];
  public error: HttpErrorResponse | null = null;
  public isAuthenticated$: Observable<boolean> = this.auth.isAuthenticated$;
  public isLoading$: Observable<boolean> = this.auth.isLoading$;
  public gamesLoading: boolean = true;
  public searchInput: string = '';
  public searchInputUpdate: Subject<string> = new Subject<string>();
  public firstPagi: number = 0;
  public rowsPagi: number = 10;
  public recordsPagi: number = 0;

  public constructor(private router: Router, private gamesApiService: GamesApiService, private authUser: AuthUserService, private auth: AuthService) {}

  @HostListener('window:resize', ['$event'])
  public onResize(): void {
    if (window.matchMedia('(max-width: 575px)').matches) {
      this.displayMobile = true;
    } else {
      this.displayMobile = false;
    }
  }

  public ngOnInit(): void {
    if (window.matchMedia('(max-width: 575px)').matches) {
      this.displayMobile = true;
    }
    this.authUser.getUserId().subscribe((userId: string) => {
      this.gamesApiService.getGamesOfUser(userId).subscribe({
        next: (games: Game[]) => {
          this.games = games;
          this.recordsPagi = games.length;
          this.processedGames = games;
          this.processGamesData();
          this.gamesLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.error = error;
          this.gamesLoading = false;
        },
      });
    });

    this.searchInputUpdate.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.processGamesData();
    });
  }

  public ngOnDestroy(): void {
    this.searchInputUpdate.unsubscribe();
  }

  public processGamesData(): void {
    this.processedGames = this.games;
    if (this.displayMobile) {
      this.processedGames = this.processedGames.filter((game: Game) => {
        return Object.values(game).some((value: Game[keyof Game]) => value !== null && value.toString().toLowerCase().includes(this.searchInput.toLowerCase()));
      });
    } else {
      this.filterGames();
      this.sortGamesByButton();
    }
    this.recordsPagi = this.processedGames.length;
    const startIndex: number = this.firstPagi;
    const endIndex: number = this.firstPagi + this.rowsPagi;
    this.processedGames = this.processedGames.slice(startIndex, endIndex);
  }

  public onPageChange(event: PaginatorState): void {
    this.firstPagi = event.first ?? 0;
    this.rowsPagi = event.rows ?? 0;
    this.processGamesData();
  }

  public addNewGame(): void {
    this.router.navigate(['/game/new']);
  }

  public objectKeys(obj: object): string[] {
    return Object.keys(obj);
  }

  private filterGames(): void {
    if (this.dateState === false) {
      this.processedGames = this.processedGames.filter((game: Game) => game.releaseDate !== 'null');
    } else if (this.dateState) {
      this.processedGames = this.processedGames.filter((game: Game) => game.releaseDate === 'null');
    }
    if (this.activeSearchButton === 'tags') {
      this.processedGames = this.processedGames.filter((game: Game) => {
        const tags: string[] = game.tags as string[];

        return tags.some((tag: string) => tag.toLowerCase().includes(this.searchInput.toLowerCase()));
      });
    } else if (this.activeSearchButton !== '') {
      this.processedGames = this.processedGames.filter((game: Game) => {
        const value: Game[keyof Game] = game[this.activeSearchButton];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(this.searchInput.toLowerCase());
        } else if (typeof value === 'number') {
          return value.toString().includes(this.searchInput);
        }

        return false;
      });
    }
  }

  public sortGamesByButton(): void {
    this.processedGames.sort((a: Game, b: Game) => {
      const key: string = this.activeSortButton;
      const order: 1 | -1 = this.buttonSortStates[key].state ? 1 : -1;
      if (a[key]! < b[key]!) {
        return -1 * order;
      }
      if (a[key]! > b[key]!) {
        return 1 * order;
      }

      return 0;
    });
  }

  public toggleSortButton(button: string): void {
    this.activeSortButton = button;
    for (const key in this.buttonSortStates) {
      if (key !== button) {
        this.buttonSortStates[key].state = false;
      }
    }

    this.processGamesData();
  }

  public toggleSearchButton(button: string): void {
    this.activeSearchButton = button;
    for (const key in this.buttonSearchStates) {
      if (key !== button) {
        this.buttonSearchStates[key] = false;
      }
    }
    this.processGamesData();
  }
}
