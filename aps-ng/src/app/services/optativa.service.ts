import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Optativa {
  id: number;
  nome: string;
}

export interface OptativaResponse {
  success: boolean;
  message: string;
  data: Optativa[];
}

@Injectable({
  providedIn: 'root'
})
export class OptativaService {

  private baseUrl = 'http://localhost:8000/optativas/';

  constructor(private http: HttpClient) {}

  listarOptativas(): Observable<OptativaResponse> {
    return this.http.get<OptativaResponse>(this.baseUrl);
  }
}
