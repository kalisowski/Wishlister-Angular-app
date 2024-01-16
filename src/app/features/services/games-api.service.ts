import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { type Observable } from 'rxjs';
import { type Game } from '../dto/game.model';
import { environment } from 'src/environments/environment';
import type { CreateGame } from '../dto/create-game.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GamesApiService {
  public constructor(private httpClient: HttpClient) {}

  public getGames(): Observable<Game[]> {
    return this.httpClient.get<Game[]>(environment.API_URL + '/games');
  }

  public getGamesOfUser(id: string): Observable<Game[]> {
    return this.httpClient.get<Game[]>(environment.API_URL + `/user/${id}/games`);
  }

  public createGame(game: CreateGame): Observable<Game> {
    const headers: HttpHeaders = new HttpHeaders({ 'content-type': 'application/json' });

    return this.httpClient.post<Game>(`${environment.API_URL}/games`, game, { headers: headers });
  }

  public getGame(id: string): Observable<Game> {
    return this.httpClient.get<Game>(`${environment.API_URL}/games/${id}`);
  }

  public updateGame(id: string, game: CreateGame): Observable<Game> {
    const headers: HttpHeaders = new HttpHeaders({ 'content-type': 'application/json' });

    return this.httpClient.put<Game>(`${environment.API_URL}/games/${id}`, game, { headers: headers });
  }

  public deleteGame(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.API_URL}/games/${id}`);
  }
}
