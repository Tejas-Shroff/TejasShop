import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddressDto } from '../Models/address';
import { ResponseDto } from '../Models/response';
import { map, Observable, tap } from 'rxjs';
import { NotificationService } from 'src/app/notification/notification.service';
import { WindowRefService } from './window-ref.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { general_u, orderDeatails_o } from 'src/app/constants/messages';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private http: HttpClient,
    private notification: NotificationService,
    private router: Router,
    private winRef: WindowRefService
  ) { }

  createOrder(cartId: number, shipToAddress: AddressDto, onRazorpayClose: () => void) {
    return this.http.post<ResponseDto<any>>('Order/CreateOrder', { cartId, shipToAddress }).pipe(
      tap(res => {
        if (res.isSuccessed) {
          const options: any = {
            key: environment.razorPayKey, // Key ID retriving from the environment.
            amount: res.data.amount * 100, // Amount in paise
            currency: general_u.INR_o,
            name: general_u.AmazonShop_o,//Your Company Name
            description: general_u.PurchaseDescription_o,
            order_id: res.data.razorPayOrderId,
            modal: {
              
              escape: false,  // this is for the payment form should not be cloased when esc is placed.
            },
            handler: (paymentRes: any) => {
              console.log(paymentRes);
              this.updatePayment(paymentRes.razorpay_order_id, paymentRes.razorpay_payment_id, paymentRes.razorpay_signature).subscribe(() => {
                this.router.navigateByUrl('/orders/detail/' + res.data.orderId)
              });
            },
            prefill: {   // this infromation is prefilled in payemnt form.
              name: shipToAddress.firstName + ' ' + shipToAddress.lastName,
              email: general_u.mail_o,
              contact: '',
            },
            theme: {
              color: general_u.color_code_o
            }
          };
          options.modal.ondismiss = (() => {
            this.notification.Error(orderDeatails_o.transactionFailedToastr_o)
            onRazorpayClose();
            setTimeout(() => {
              document.body.classList.add(general_u.blur_o);
              const loadingMessage = document.getElementById(general_u.loadinMessage_o);
              if (loadingMessage) {
                loadingMessage.style.display = general_u.block_o;
              }
          
              // Navigate to order details page after 3 seconds
              setTimeout(() => {
                this.router.navigateByUrl('/orders/detail/' + res.data.orderId);
                if (loadingMessage) {
                  loadingMessage.style.display = general_u.none_o;
                }
                document.body.classList.remove(general_u.blur_o);
              }, 3000);
            }, 500);
          });

          const r = new this.winRef.nativeWindow.Razorpay(options);   // referes to windows-ref services.
          r.open();   // opens the razorpay window.
        }
      })
    );
  }

  public updatePayment(orderId: string, paymentId: string, signature: string) {
    return this.http.post("Payment/update-payment", { orderId, paymentId, signature });
  }
  
  public updateRetrypaymentdetails(orderId: string, paymentId: string, signature: string, status: string, retryCount: number) {
    return this.http.post("Payment/update-Retry-payment-details", { orderId, paymentId, signature, status, retryCount });
  }

  public updatePaymentStatus(orderId: number, status: string): Observable<any> {
    const body = { orderId, status };
    return this.http.post(`Payment/update-payment-status`, body);
  }
}
