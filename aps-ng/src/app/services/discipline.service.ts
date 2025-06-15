import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Discipline } from '../interfaces/discipline';


export interface ApiResponse {
  success: boolean;
  message: string;
  data: Discipline[];
}

@Injectable({ providedIn: 'root' })
export class DisciplineService {
  private baseUrl = 'http://localhost:8000/cursos/1/disciplinas/';

  constructor(private http: HttpClient) {}

  getDisciplines(filters?: { optativa?: string; periodo?: string; usuario?: string, concluidas?: string; }): Observable<ApiResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.optativa) {
        params = params.set('optativas', filters.optativa);
      }
      if (filters.periodo) {
        params = params.set('periodo', filters.periodo);
      }
      if (filters.usuario) {
        params = params.set('usuario', filters.usuario);
      }
      if (filters.concluidas) {
        params = params.set('concluidas', filters.concluidas);
      }
    }

    return this.http.get<ApiResponse>(this.baseUrl, { params });
  }
  updateUserDisciplines(username: string, disciplinesIds: string[]): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `http://localhost:8000/usuarios/${username}/disciplinas_concluidas/`,
    { 'disciplinas_concluidas':disciplinesIds }
  );
}
}
