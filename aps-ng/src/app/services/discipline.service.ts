import { HttpClient } from '@angular/common/http';
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

  getDisciplines(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl);
  }
}
