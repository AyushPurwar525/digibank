import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountSummaryService {
  private apiUrl = 'https://digibank-json-server.onrender.com/customers';
  // private apiUrl = 'http://localhost:3000/customers';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
