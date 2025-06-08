import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Feedback {
  texto: string;
  usuario: string;
}

export interface FeedbackResponse {
  success: boolean;
  message?: string;
  data?: any;
  errors?: any;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private baseUrl = 'http://localhost:8000/api/feedback/';

  constructor(private http: HttpClient) {}

  sendFeedback(feedback: Feedback): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(this.baseUrl, feedback);
  }
}
