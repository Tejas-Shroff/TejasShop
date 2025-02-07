import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/Services/auth.service';
import { UserAddressService } from '../../core/Services/user-address.service';
import { NotificationService } from '../../notification/notification.service';
import { address_form_c } from 'src/app/constants/messages';

@Component({
  standalone: true,
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css'],
  imports: [
    //BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AddressFormComponent implements OnInit {
  addressForm!: FormGroup;
  states = address_form_c.states;
  @Output() addressAdded = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private addressService: UserAddressService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      userId: this.authService.getLoggedInUserId(),
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      address: [null, Validators.required],
      address2: null,
      city: [null, Validators.required],
      state: [null, Validators.required],
      postalCode: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(6),
        ]),
      ],
      shipping: [address_form_c.Free, Validators.required],
    });
  }

  onSubmit() {
    console.log(this.addressForm.value);
    if (this.addressForm.valid) {
      this.addressService
        .addAddress({
          userId: this.addressForm.get('userId')?.value,
          firstName: this.addressForm.get('firstName')?.value,
          lastName: this.addressForm.get('lastName')?.value,
          addressLine1: this.addressForm.get('address')?.value,
          addressLine2: this.addressForm.get('address2')?.value,
          city: this.addressForm.get('city')?.value,
          state: this.addressForm.get('state')?.value,
          country: 'INDIA',
          postalCode: this.addressForm.get('postalCode')?.value,
        })
        .subscribe((res) => {
          if (res.isSuccessed) {
            console.log('reposne', res);
            this.notification.Success(address_form_c.AddressAddedSuccess);
            this.addressForm.reset()
            this.addressAdded.emit()

          } else {
            this.notification.Error(res.message);
          }
        });
    }
  }
}
