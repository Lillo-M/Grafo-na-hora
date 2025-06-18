import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DisciplinaOrdenada {
  id: number;
  codigo: string;
  nome: string;
  periodo: number;
  comprimento_cadeia: number;
}

export interface OrdenacaoResponse {
  success: boolean;
  message: string;
  data: DisciplinaOrdenada[];
}

@Injectable({
  providedIn: 'root'
})
export class TopoService {
  private apiUrl = 'http://localhost:8000/ordenacao-topologica'; // ajuste conforme necessário

  constructor(private http: HttpClient) {}

  obterOrdenacaoTopologica(usuario: string, maxDisciplinas: number): Observable<OrdenacaoResponse> {
    const params = new HttpParams()
      .set('usuario', usuario)
      .set('max_disciplinas', maxDisciplinas.toString());

    return this.http.get<OrdenacaoResponse>(this.apiUrl, { params });
  }
}
