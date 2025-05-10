import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface Currency {
  code: string;
  symbol: string;
  conversionFactor: number;
}

@Pipe({
  name: 'currencyConverter'
})
export class CurrencyConverterPipe implements PipeTransform {
  private currencies$: Observable<Currency[]>;

  constructor(private http: HttpClient) {
    this.currencies$ = this.http.get<Currency[]>('https://digibank-json-server.onrender.com/currencies');
    // this.currencies$ = this.http.get<Currency[]>('http://localhost:3000/currencies');
  }

  transform(amount: number, currencyCode: string): Observable<string> {
    currencyCode='USD';
    return this.currencies$.pipe(map(currencies => {
      const currency = currencies.find(c => c.code === currencyCode);

      if (!currency) {
        console.error(`Currency with code ${currencyCode} not found.`);
        return '';
      }
      localStorage.setItem('currency',currencyCode);
      const convertedAmount = amount * currency.conversionFactor;
      return `${currency.symbol} ${convertedAmount.toFixed(2)}`;
    }));
  }
}

