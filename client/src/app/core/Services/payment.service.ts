import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddressDto } from '../Models/address';
import { ResponseDto } from '../Models/response';
import { map, tap } from 'rxjs';
import { NotificationService } from 'src/app/notification/notification.service';
import { WindowRefService } from './window-ref.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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

  createOrder(cartId: number, shipToAddress: AddressDto) {
    return this.http.post<ResponseDto<any>>('Order/CreateOrder', { cartId, shipToAddress }).pipe(
      tap(res => {
        if (res.isSuccessed) {
          const options: any = {
            key: environment.razorPayKey, // Key ID retriving from the environment.
            amount: res.data.amount * 100, // Amount in paise
            currency: 'INR',
            name: 'AmazonShop',//Your Company Name
            description: 'Purchase Description',
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
              email: 'youremail@example.com',
              contact: '',
            },
            theme: {
              color: '#0c238a'
            }
          };
          options.modal.ondismiss = (() => {
            this.notification.Error('Transaction cancelled.'); // Show error toastr
          
            // Show loading message and blur effect after 2 seconds
            setTimeout(() => {
              document.body.classList.add('blur');
              const loadingMessage = document.getElementById('loading-message');
              if (loadingMessage) {
                loadingMessage.style.display = 'block';
              }
          
              // Navigate to order details page after 3 seconds
              setTimeout(() => {
                this.router.navigateByUrl('/orders/detail/' + res.data.orderId);
                if (loadingMessage) {
                  loadingMessage.style.display = 'none';
                }
                document.body.classList.remove('blur');
              }, 5000);
            }, 2000);
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
}
