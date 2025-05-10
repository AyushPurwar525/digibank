import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { AccountDetailsService } from './account-details.service';
import { LoginService } from '../login/login.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.css',
})
export class AccountDetailsComponent implements OnInit {
  userDetails: any;
  accountNumbers: string[] = [];
  selectedAccountNumber: string = '';
  transactions: any[] = [];
  displayedColumns: string[] = ['sno', 'transactionId', 'date', 'description', 'amount'];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private accountDetailsService: AccountDetailsService,
    private loginService: LoginService,
    private fb: FormBuilder, private ngZone: NgZone,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.loginService.getLoggedInUser().subscribe((user: any) => {
      if (user) {
        console.log('Logged-in user:', user);
        this.accountDetailsService.getUserDetails(user.id).subscribe(
          (details: any) => {
            this.userDetails = details;
            this.route.params.subscribe((params) => {
              const selectedAccountNumber = params['accountNumber'];
              this.selectedAccountNumber = selectedAccountNumber;
              this.onAccountSelection();
              this.showTransactions();
            });
            console.log('User details:', this.userDetails);
            this.ngZone.run(() => { });
          },
          (error: any) => {
            console.error('Error fetching user details:', error);
          }
        );
      } else {
        console.error('No logged-in user found');
      }
    });
  }

  onAccountSelection() {
    this.transactions = [];
    this.accountNumbers = this.userDetails.accounts
      .map((account: { accountNumber: any; }) => account.accountNumber);
    
  }

  onAccountNumberChange() {
    console.log('Selected Account Number:', this.selectedAccountNumber);
    this.transactions = [];

    if (this.selectedAccountNumber) {
      this.accountDetailsService.getAccountTransactions(this.selectedAccountNumber).subscribe(
        transactions => {
          this.transactions = transactions || [];
          console.log('Transaction details:', this.transactions);
          this.dataSource = new MatTableDataSource(this.transactions);
          this.setupTable();
          this.ngZone.run(() => { }); 
        },
        error => {
          console.error('Error fetching transactions:', error);
        }
      );
    }
  }


  showTransactions() {
    this.onAccountNumberChange();
    
  }

  private setupTable(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.active = 'date';
    this.sort.direction = 'desc';
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'sno': return this.transactions.indexOf(item) + 1;
        default: return item[property];
      }
    };

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

}
