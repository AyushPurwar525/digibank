import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      this.loginService.login(username, password).subscribe(
        (users: any[]) => {
          if (users.length > 0) {
            console.log('Login successful');
            Swal.fire({
              icon: 'success',
              title: 'Login Successful',
              showConfirmButton: false,
              timer: 1500, 
              didClose: () => {
                this.loginService.setLoginSuccess(true);
                this.loginService.setLoggedInUser(users[0]);
                this.router.navigate(['/profile']);
              },
            });
          } else {
            console.log('Login failed');
            Swal.fire({
              icon: 'error',
              title: 'Login failed',
              showConfirmButton: true});
          }
        },
        (error) => {
          console.error('Login error:', error);
        }
      );
    }
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }
}
