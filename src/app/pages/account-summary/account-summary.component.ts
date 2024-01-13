import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountSummaryService } from './account-summary.service';
import { LoginService } from '../login/login.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';


@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrl: './account-summary.component.css',
})
export class AccountSummaryComponent implements OnInit{
  accounts: any[] = [];
  banks: any[] = [];
  // Define the displayed columns
  displayedColumns: string[] = ['sno',  'accountNumber', 'type', 'balance'];

  dataSource!: MatTableDataSource<any>;
  // Add ViewChild for MatPaginator and MatSort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private accountSummaryService: AccountSummaryService, private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.loginService.getLoggedInUser().subscribe((user: any) => {
      if (user) {
        console.log('Logged-in user:', user);
        this.accountSummaryService.getAccounts().subscribe((customers: any[]) => {
          const customer = customers.find((c: any) => c.id === user.id);
          this.accounts = customer ? customer.accounts : [];
          this.banks = this.accounts.map(account => account.bankName);
          console.log('Fetched accounts:', this.accounts);

          this.dataSource = new MatTableDataSource(this.accounts);
          // After fetching data, set up MatPaginator and MatSort
          this.setupTable();
        });
      } else {
        console.error('No logged-in user found');
      }
    });
  }

  private setupTable(): void {
    // Set up paginator and sort
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // Apply filter to datasource when the sort changes
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'sno': return this.accounts.indexOf(item) + 1;
        case 'balance': return item.balance;
        default: return item[property];
      }
    };

    // Add filter predicate
  this.dataSource.filterPredicate = (data, filter) => {
    const dataStr = Object.keys(data).reduce((currentTerm, key) => {
      return currentTerm + data[key] + ' ';
    }, '').toLowerCase();

    return dataStr.indexOf(filter) !== -1;
  };

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewTransactionDetails(account: any): void {
    this.router.navigate(['/account-details', account.accountNumber]);
  }

  openTransferPage(accountNumber: string): void {
    // Navigate to the transfer page with the selected account number
    this.router.navigate(['/transfer', accountNumber]);
  }
}
