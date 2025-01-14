import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/Services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   loginForm!:FormGroup;


   constructor(private fb:FormBuilder,private authService:AuthService,private router:Router){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('',[Validators.required,Validators.email]),
      password:new FormControl('',Validators.required)
    })
  }

  Login(){

    if (this.loginForm.valid) {
      this.authService.Login(
      {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      }
      ).subscribe(
        {
          next:(res) => {
            console.log('Response:', res);
            if(res.isSuccessed && res.data && res.data.userData) {
              const userRole = res.data.userData.role;
              console.log('The role of the user is - ', userRole);
              this.authService.setUserRole(userRole);
              if(userRole == 'ADMIN')
              {

                this.router.navigateByUrl('auth/admin-page');
              }
            else
              {
                this.router.navigateByUrl("");
              }
            }
            else
            {
              alert(res.message);
            }
          }
        }
      )
    }
  }

  // Login(){
  //   debugger
  //   if(this.loginForm.valid){
  //      this.authService.Login({
  //       email:this.loginForm.get('email')?.value,
  //       password:this.loginForm.get('password')?.value
  //     })
  //     .subscribe(
  //       {
  //         next:(res)=>{
  //           if(res.isSuccessed==true) {
  //             this.router.navigateByUrl("");
  //           }
  //           else{
  //             alert(res.message)
  //           }
  //         }
  //       }
  //     )
  //   }
  // }



  // Login() {
  //   debugger;
  //   if (this.loginForm.valid) {
  //     const role = this.loginForm.get('Role')?.value;
  
  //     this.authService.Login({
  //       email: this.loginForm.get('email')?.value,
  //       password: this.loginForm.get('password')?.value
  //     })
  //     .subscribe({
  //       next: (res) => {
  //         if (res.isSuccessed == true) {
  //           if (role === 'ADMIN') {
  //             this.router.navigateByUrl('/admin');
  //           }
  //           else 
  //           {
  //             this.router.navigateByUrl("");
  //           }
  //         } else {
  //           alert(res.message);
  //         }
  //       }
  //     });
  //   }
  // }

}
