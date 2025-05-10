import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, of } from 'rxjs';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AccountDetailsService {

  private apiUrl = 'https://digibank-json-server.onrender.com/customers';
  // private apiUrl = 'http://localhost:3000/customers';

  constructor(private http: HttpClient) { }

  getUserDetails(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  // getAccountTransactions(accountNumber: string): Observable<any[]> {
  //   // Assuming your API endpoint for account transactions is implemented
  //   return this.http.get<any[]>(`${this.apiUrl}/transactions?accountNumber=${accountNumber}`);
  // }

  getAccountTransactions(accountNumber: string): Observable<any[]> {
    // Assuming your API endpoint for account transactions is implemented
    return this.http.get<any[]>(`${this.apiUrl}`)
      .pipe(
        map((customers) => {
          // Find the customer with the selected accountNumber
          const customer = customers.find((cust) => cust.accounts.some((acc: { accountNumber: string; }) => acc.accountNumber === accountNumber));

          // Return an empty array if the customer or accounts are not found
          if (!customer || !customer.accounts) {
            return [];
          }

          // Find the account with the selected account number
          const selectedAccount = customer.accounts.find((acc: { accountNumber: string; }) => acc.accountNumber === accountNumber);

          // Return transactionData if available, otherwise return an empty array
          return selectedAccount?.transactionData || [];
        }),
        catchError((error) => {
          console.error('Error fetching account transactions:', error);
          return of([]);
        })
      );
  }
}
