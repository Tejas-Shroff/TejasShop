import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { login_c } from 'src/app/constants/messages';
import { AuthService } from 'src/app/core/Services/auth.service';
import { CacheService } from 'src/app/core/Services/cache.service';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordError : boolean = false;
  rememberMe: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService,
    private cache : CacheService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      role: ['', Validators.required],
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(false),
    });
    this.loadRememberedData();
  }
  loadRememberedData() {
    const rememberedData = this.cache.getItem(login_c.rememberMe_l);
    if (rememberedData) {
      const { email, role, password } = rememberedData;
      this.loginForm.setValue({ email, role, password, rememberMe: true });
    
    }
  }

  saveRememberedData() {
    if (this.loginForm.get(login_c.rememberMe_l)?.value) {
      const { email, role, password } = this.loginForm.value;
      this.cache.setItem(login_c.rememberMe_l, { email, role, password });

    } else {
      this.cache.removeItem(login_c.rememberMe_l);

    }
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

            if (res.isSuccessed && res.data && res.data.userData) {
              const userRole = res.data.userData.role;
              const selectedRole = this.loginForm.get('role')?.value;

              if (userRole === 'ADMIN' && selectedRole === 'ADMIN') 
              {
                this.router.navigateByUrl('admin/admin-page');
              } 
              else if (selectedRole === 'USER')
              {
                this.router.navigateByUrl('');
              } 
              else {
                this.notification.Error(login_c.InvalidRoleSelection_l);
              }
              this.saveRememberedData();
            } else {
              alert(res.message);
            }
          },
          error: (error) => {
            this.passwordError = true;
            const messageMatch = error.match(/Message: (.*)/);
            const errorCodeMatch = error.match(/Error Code: (\d+)/);
          
            if (messageMatch && errorCodeMatch && errorCodeMatch[1] == 400 && messageMatch[1] === login_c.InvalidPassword_l) {
              this.notification.Error(login_c.InvalidPassword_l);
            }
          }
        });
    }
  }
  
}
