import { Component, NgZone } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from '../login/login.service';
import { TransferService } from './transfer.service';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent {
  userDetails: any;
  accountNumbers: string[] = [];
  selectedAccountNumber: string = '';
  destinationAccountNumber: string = '';
  transferAmount: number | undefined;
  transferDate: String | undefined;
  currencyCode:string="USD";
  constructor(private transferService: TransferService, private loginService: LoginService,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private http: HttpClient,
    private route: ActivatedRoute) { }


    convertToUSD(n:number):number{
      if(this.currencyCode==="INR")
        return n/83;
      else
        return n;
    }

    ngOnInit(): void {
      this.currencyCode=localStorage.getItem('currency')??"USD";
      this.loginService.getLoggedInUser().subscribe((user: any) => {
        if (user) {
          console.log('Logged-in user:', user);
          this.transferService.getUserDetails(user.id).subscribe(
            (details: any) => {
              this.userDetails = details;
              this.route.params.subscribe((params) => {
                const selectedAccountNumber = params['accountNumber'];
                if (selectedAccountNumber) {
                  // Set the selected account number
                  this.selectedAccountNumber = selectedAccountNumber;
                }
              });
                this.onAccountChange();
              // }
              console.log('User details:', this.userDetails);
              this.transferDate = this.getCurrentDate();
              this.ngZone.run(() => {});
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

    getCurrentDate(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
  
      const formattedMonth = month < 10 ? `0${month}` : month;
      const formattedDay = day < 10 ? `0${day}` : day;
  
      return `${year}-${formattedMonth}-${formattedDay}`;
    }
  
    onAccountChange() {
      this.accountNumbers = this.userDetails.accounts
        .map((account: { accountNumber: any }) => account.accountNumber);
    }

    

  
  transferFunds() {
    if (!this.selectedAccountNumber || !this.destinationAccountNumber || !this.transferAmount || !this.transferDate) {
      console.error('Please fill in all fields.');
      return;
    }

  if (this.transferAmount < 1 || this.transferAmount > 1000000) {
    console.error('Transfer amount should be between 1 and 1000000.');
    Swal.fire({
      icon: 'error',
      title: 'Invalid Transfer Amount',
      text: 'Transfer amount should be between 1 and 1,000,000.',
      showConfirmButton: true,
    });
    return;
  }
  else if(this.selectedAccountNumber === this.destinationAccountNumber){
    console.error('Source account and destination account cannot be same.');
    Swal.fire({
      icon: 'error',
      text: 'Source account and destination account cannot be same.',
      showConfirmButton: true,
    });
    return;
  }

    const sourceAccount: any = this.userDetails.accounts.find((account: { accountNumber: string; }) => account.accountNumber === this.selectedAccountNumber);
    const destinationAccount: any = this.userDetails.accounts.find((account: { accountNumber: string; }) => account.accountNumber === this.destinationAccountNumber);

    if (!sourceAccount.transactionData) {
      sourceAccount.transactionData = [];
    }

    
    if(sourceAccount.balance<this.transferAmount){
      console.error('Source account and destination account cannot be same.');
      Swal.fire({
        icon: 'error',
        text: 'Insufficient balance',
        showConfirmButton: true,
      });
      return;
    }
  
    this.transferAmount=this.convertToUSD(this.transferAmount);
    const sourceTransaction = {
      transactionId: `TXN${Math.floor(Math.random() * 1000000) + 1}`,
      date: this.transferDate,
      description: 'Transfer',
      amount: -this.transferAmount,
    };
    sourceAccount.transactionData.push(sourceTransaction);

    

    if (destinationAccount) {
      if (!destinationAccount.transactionData) {
        destinationAccount.transactionData = [];
      }

      const destinationTransaction = {
        transactionId: `TXN${Math.floor(Math.random() * 1000000) + 1}`,
        date: this.transferDate,
        description: 'Deposit',
        amount: this.transferAmount,
      };
      destinationAccount.transactionData.push(destinationTransaction);

     
      sourceAccount.balance -= this.transferAmount;

      
      destinationAccount.balance += this.transferAmount;
    } else {
      sourceAccount.balance -= this.transferAmount;
    }

    
    this.http.put('https://digibank-json-server.onrender.com/customers/' + this.userDetails.id, this.userDetails)
    // this.http.put('http://localhost:3000/customers/' + this.userDetails.id, this.userDetails)
      .subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Transfer Successful!',
            text: `Amount is transferred successfully on ${this.transferDate}.`,
            showConfirmButton: true,
          });
        },
        (error: any) => {
          console.error('Error updating customer details:', error);
        }
      );
      this.destinationAccountNumber = '';
      this.transferAmount = undefined;
    }
}
