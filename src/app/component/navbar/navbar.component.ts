import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { LoginService } from '../../pages/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  // @Output() toggleSidenav = new EventEmitter<void>();
  // @ViewChild(MatSidenav) sidenav!: MatSidenav;

  // constructor(private router: Router) {}

  // logout() {
  //   // Add any additional logout logic here
  //   // ...

  //   // Navigate to the login page
  //   this.router.navigate(['/login']);
  // }

  // isLoggedIn: boolean = false;

  // constructor(private router: Router, private loginService: LoginService) { }

  // ngOnInit() {
  //   this.router.events.subscribe(event => {
  //     if (event instanceof NavigationEnd) {
  //       // Check if the user is logged in
  //       this.loginService.getLoggedInUser().subscribe(user => {
  //         this.isLoggedIn = !!user;
  //       });
  //     }
  //   });
  // }

  // logout() {
  //   // Implement your logout logic here
  //   this.loginService.setLoginSuccess(false);
  //   this.loginService.setLoggedInUser(null);
  //   this.router.navigate(['/login']);
  // }

  constructor(private router: Router, private loginService: LoginService) {}

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  logout(): void {
    Swal.fire({
      title: 'Logout',
      text: 'Do you really want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        // If the user clicks 'Yes, logout!', perform the logout
        this.loginService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  closeMenu(): void {
    this.sidenav.close();
  }
}
