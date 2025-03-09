import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'https://digibank-json-server.onrender.com';
  // private apiUrl = 'http://localhost:3000';
  private loginSuccessSubject = new BehaviorSubject<boolean>(false);
  private loggedInUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?username=${username}&password=${password}`);
  }

  setLoginSuccess(status: boolean) {
    this.loginSuccessSubject.next(status);
  }

  setLoggedInUser(user: any) {
    this.loggedInUserSubject.next(user);
  }

  getLoggedInUser(): Observable<any> {
    return this.loggedInUserSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return !!this.loggedInUserSubject.value;
  }

  logout(): void {
    this.loggedInUserSubject.next(null);
  }
}
