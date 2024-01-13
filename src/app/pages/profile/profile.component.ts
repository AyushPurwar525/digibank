import { Component } from '@angular/core';
import { LoginService } from '../login/login.service';
import { AccountDetailsService } from '../account-details/account-details.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userDetails: any;

  constructor(
    private accountDetailsService: AccountDetailsService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loginService.getLoggedInUser().subscribe((user: any) => {
      if (user) {
        console.log('Logged-in user:', user);
        this.accountDetailsService.getUserDetails(user.id).subscribe(
          (details: any) => {
            this.userDetails = details;
            console.log('User details:', this.userDetails);
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
}
