import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/Services/auth.service';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordError : boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      role: ['', Validators.required],
      password: new FormControl('', Validators.required),
    });
  }
  
  Login() {
    if (this.loginForm.valid) {
      this.authService
        .Login({
          email: this.loginForm.get('email')?.value,
          role: this.loginForm.get('role')?.value,
          password: this.loginForm.get('password')?.value,
        })
        .subscribe({
          next: (res) => {
            console.log('Login response:', res);
            if (res.isSuccessed && res.data && res.data.userData) {
              const userRole = res.data.userData.role;
              const selectedRole = this.loginForm.get('role')?.value;

              if (userRole === 'ADMIN' && selectedRole === 'ADMIN') 
              {
                this.router.navigateByUrl('auth/admin-page');
              } 
              else if (selectedRole === 'USER')
              {
                this.router.navigateByUrl('');
              } 
              else {
                this.notification.Error('Invalid role selection');
              }
            } else {
              alert(res.message);
            }
          },
          error: (error) => {
            this.passwordError = true;
            const messageMatch = error.match(/Message: (.*)/);
            const errorCodeMatch = error.match(/Error Code: (\d+)/);
          
            if (messageMatch && errorCodeMatch && errorCodeMatch[1] == 400 && messageMatch[1] === 'Invalid Password!') {
              this.notification.Error('Invalid password!');
            }
          }
        });
    }
  }
  
}
