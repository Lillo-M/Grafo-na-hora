import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeleteUserResponse } from '../interfaces/deleteUserResponse';

interface UserPayload {
  nome: string;
  email: string;
  senha: string;
  curso: number;
  periodo: number;
}
interface UserUpdatePayload {
  email?: string;
  senha?: string;
  curso?: number;
  periodo?: number;
}

interface LoginPayload {
  nome: string;
  senha: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
  admin?: boolean; // Apenas para o usuário -> bem feio eu sei
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

  deleteUser(username: string): Observable<DeleteUserResponse> {
    return this.http.delete<DeleteUserResponse>(`${this.baseUrl}/${username}/delete/`);
  }

  updateUser(username: string, payload: UserUpdatePayload): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/${username}/update/`, payload);
  }
}
