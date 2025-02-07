import {
  ChangeDetectorRef,
  Component,
  Inject,
  TemplateRef,
} from '@angular/core';
import { ShoppingCart } from '../../core/Models/Cart';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { BASE_IMAGE_API } from '../../core/token/baseUrl.token';
import { AppState } from '../../redux/store';
import { Store } from '@ngrx/store';
import { selectCartProperty } from '../../redux/cart/cart.selector';
import { loadCart } from '../../redux/cart/cart.action';
import { SharedModule } from '../../shared/shared.module';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddressFormComponent } from '../address-form/address-form.component';
import { AuthService } from '../../core/Services/auth.service';
import { UserAddressService } from '../../core/Services/user-address.service';
import { NotificationService } from '../../notification/notification.service';
import { AddressDto } from '../../core/Models/address';
import { PaymentService } from '../../core/Services/payment.service';
import { cart_c, checkout_c } from 'src/app/constants/messages';

@Component({
  standalone: true,
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  imports: [SharedModule, ModalModule, AddressFormComponent],
  providers: [BsModalService],
})
export class CheckoutComponent {
  cart$: Observable<ShoppingCart | null>;
  userId!: number | undefined;
  shipToAddress!: AddressDto;
  isRazorpayOpen: boolean = false;

  constructor(
    @Inject(BASE_IMAGE_API) public imageUrl: string,
    private modalService: BsModalService,
    private store: Store<AppState>,
    private authService: AuthService,
    public addressService: UserAddressService,
    private notification: NotificationService,
    private paymentService: PaymentService
  ) {
    this.cart$ = this.store.select(selectCartProperty);
  }
  ngOnInit(): void {
    this.store.dispatch(loadCart());
    this.userId = this.authService.getLoggedInUserId();
    if (this.userId) {
      this.addressService.loadAddress(this.userId);
    }
  }

  removeAddress(addressId: number | null) {
    if (!addressId || !this.userId) return;
    this.addressService
      .DeleteAddress(addressId, this.userId)
      .subscribe((res) => {
        if (res.isSuccessed) {
          this.notification.Success(cart_c.AddresRemoved_c);
        } else {
          this.notification.Error(res.message);
        }
      });
  }

  modalRef?: BsModalRef;
  messages: string[] = [];

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, { class: checkout_c.modal_lg });
  }

  MakePayment(carId: number) {
    if (this.shipToAddress == undefined) {
      this.notification.Error(cart_c.ShippingAdressSelect_c);
      return;
    }
    this.paymentService
      .createOrder(carId, this.shipToAddress, this.onRazorpayClose.bind(this))
      .subscribe((res) => {
        if (res.isSuccessed) {
          this.isRazorpayOpen = true;
          this.store.dispatch(loadCart());
          this.notification.Success(cart_c.orderCreated_c);
        } else this.notification.Error(res.message);
      });
  }
  selectedAddress: any = null;

  toggleAddressSelection(address: any) {
    if (this.selectedAddress === address) {
      this.selectedAddress = null;
    } else {
      this.selectedAddress = address;
    }
    this.shipToAddress = this.selectedAddress;
  }

  isSelected(address: any): boolean {
    return this.selectedAddress === address;
  }

  onAddressAdded() {
    this.modalRef?.hide();
  }
  onRazorpayClose() {
    this.isRazorpayOpen = false;
  }
}
