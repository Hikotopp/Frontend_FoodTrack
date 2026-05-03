import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminReportResponse {
  success: boolean;
  message: string;
  reportService?: {
    success?: boolean;
    emailSent?: boolean;
    sentTo?: string[];
    sentCount?: number;
    emailError?: string | null;
  };
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminReportService {
  private readonly apiUrl = `${environment.apiUrl}/admin/reports`;

  constructor(private readonly http: HttpClient) {}

  generateNow(): Observable<AdminReportResponse> {
    return this.http.post<AdminReportResponse>(`${this.apiUrl}/generate-now`, {});
  }
}
