import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Dlc } from '../dto/dlc.model';
import { CreateDlc } from '../dto/create-dlc.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DlcApiService {
  public constructor(private httpClient: HttpClient) {}

  public getDlc(id: string): Observable<Dlc> {
    return this.httpClient.get<Dlc>(`${environment.API_URL}/dlcs/${id}`);
  }

  public updateDlc(id: string, dlc: CreateDlc): Observable<Dlc> {
    const headers: HttpHeaders = new HttpHeaders({ 'content-type': 'application/json' });

    return this.httpClient.put<Dlc>(`${environment.API_URL}/dlcs/${id}`, dlc, { headers: headers });
  }

  public addDlc(id: string, dlc: CreateDlc): Observable<Dlc> {
    const headers: HttpHeaders = new HttpHeaders({ 'content-type': 'application/json' });

    return this.httpClient.post<Dlc>(`${environment.API_URL}/games/${id}/dlcs`, dlc, { headers: headers });
  }

  public deleteDlc(id: string, dlcId: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.API_URL}/games/${id}/dlcs/${dlcId}`);
  }
}
