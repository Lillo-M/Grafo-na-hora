import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Discipline {
  id: string;
  nome: string;
  periodo: number;
  nome_optativa: string | null;
  carga_horaria: number;
  pre_requisitos: any[];
  concluida?: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Discipline[];
}

@Injectable({ providedIn: 'root' })
export class DisciplineService {
  private baseUrl = 'http://localhost:8000/cursos/1/disciplinas/';

  constructor(private http: HttpClient) {}

  getDisciplines(filters?: { optativa?: string; periodo?: string; usuario?: string }): Observable<ApiResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.optativa) {
        params = params.set('optativa', filters.optativa);
      }
      if (filters.periodo) {
        params = params.set('periodo', filters.periodo);
      }
      if (filters.usuario) {
        params = params.set('usuario', filters.usuario);
      }
    }

    return this.http.get<ApiResponse>(this.baseUrl, { params });
  }
  updateUserDisciplines(username: string, disciplinesIds: string[]): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `http://localhost:8000/usuarios/${username}/disciplinas_concluidas/`,
    { disciplinas: disciplinesIds }
  );
}
}
