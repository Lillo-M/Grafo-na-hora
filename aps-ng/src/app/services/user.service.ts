import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface UserPayload {
  nome: string;
  email: string;
  senha: string;
  curso: number;
  periodo: number;
}

interface LoginPayload {
  nome: string;
  senha: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:8000/usuarios';

  constructor(private http: HttpClient) {}

  cadastrarUsuario(payload: UserPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/cadastrar/`, payload);
  }

  logarUsuario(payload: LoginPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/login/`, payload);
  }
}
