import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private apiUrl = 'https://digibank-json-server.onrender.com/customers';
  // private apiUrl = 'http://localhost:3000/customers';

  constructor(private http: HttpClient) { }

  getUserDetails(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }
}
