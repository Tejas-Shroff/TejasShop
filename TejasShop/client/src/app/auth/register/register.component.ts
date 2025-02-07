import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Register_c } from 'src/app/constants/messages';
import { ResponseDto } from 'src/app/core/Models/response';
import { AuthService } from 'src/app/core/Services/auth.service';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  RegistrationForm!:FormGroup;


  constructor(private fb:FormBuilder,private authService:AuthService,private router:Router, private notification: NotificationService){}

  ngOnInit(): void {
    this.RegistrationForm = this.fb.group({
      userName: ['',Validators.required],
      email: ['',[Validators.required,Validators.email]],
      password: ['',Validators.required],
      confirmPassword:['',Validators.required],
      address: [''],
      role:['']
    },{validators:this.validatePwAndConfirmPw()})
  }
  
  Register(): void {
    if (this.RegistrationForm.valid) {
      this.authService.RegisterUser({
        userName: this.RegistrationForm.get('userName')?.value,
        email: this.RegistrationForm.get('email')?.value,
        password: this.RegistrationForm.get('password')?.value,
        address: '',
        role: this.RegistrationForm.get('role')?.value
      }).subscribe({
        next: (res: ResponseDto<null>) => {
          if (res.isSuccessed) {
            this.router.navigateByUrl('/auth/login');
            this.notification.Success(Register_c.Registered_r);
          } else {
            this.notification.Error(res.message);
          }
        },
        error: (err) => {
          const ErrorMesage_E = err.split("Message: ")[1].split("Error Code: 400")[0];
          this.notification.Error(ErrorMesage_E) 
        }
      });
    }
  }

  private validatePwAndConfirmPw():ValidatorFn{
     return (formGroup:AbstractControl):ValidationErrors|null =>{
          var pw = formGroup.get('password')?.value;
          var confirmPw=formGroup.get('confirmPassword')?.value;
          if(pw!==confirmPw){
            formGroup.get('confirmPassword')?.setErrors({passWordMismatch:true})
            return {passWordMismatch:true};
          }
          else{
            formGroup.get('confirmPassword')?.setErrors(null)
            return null;
          }
     }
  }

}
