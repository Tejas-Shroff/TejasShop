import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDetailDTO } from 'src/app/core/Models/order';
import { OrdersService } from 'src/app/core/Services/orders.service';
import { PaymentService } from 'src/app/core/Services/payment.service';
import { WindowRefService } from 'src/app/core/Services/window-ref.service';
import { NotificationService } from 'src/app/notification/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  details!: OrderDetailDTO;
  @Input() orderId!: number;

  retryCount = 0;
  retryFailedTwice = false;

  constructor(
    private orderService: OrdersService,
    private routing: ActivatedRoute,
    private notification: NotificationService,
    public paymentService: PaymentService,
    private winRef: WindowRefService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.orderId) {
      this.fetchOrderDetails(this.orderId);
    } else {
      this.routing.paramMap.subscribe((params) => {
        const id = Number(params.get('orderId'));
        if (id) {
          this.fetchOrderDetails(id);
        }
      });
    }
  }

  fetchOrderDetails(orderId: number) {
    this.orderService.getOrderDetail(orderId).subscribe((d) => {
      this.details = d;
    });
  }

  cancelOrder(orderId: number) {
    this.orderService
      .updateCancelledOrderStatus(orderId, 'Cancelled')
      .subscribe({
        next: (response) => {
          if (response.isSuccessed) {
            this.notification.Success('Order cancelled successfully');
            this.details.order.status = 'Cancelled'; // Updating the order status
          } else {
            this.notification.Error('Failed to cancel the order');
          }
        },
        error: (error) => {
          this.notification.Error('There was an error!', error);
        },
      });
  }

  retryPayment(orderId: number) {
    if (this.retryCount >= 2) {
      this.retryFailedTwice = true;
      this.details.paymentDetails.status = 'Pending - Cash on Delivery';
      this.notification.Info(
        'Online payment failed twice, updated your payment status to Cash on Delivery.'
      );
      this.updatePaymentStatus(
        orderId.toString(),
        this.details.paymentDetails.status,
        this.retryCount
      );
      window.location.reload();
      return;
    }

    // Trigger payment if retry count is less than 2
    this.triggerPayment(
      this.details.paymentDetails.razorPayOrderId,
      this.details.paymentDetails.amount,
      this.details.shippingAddress
    );
  }

  triggerPayment(orderId: string, amount: number, shipToAddress: any) {
    const options: any = {
      key: environment.razorPayKey,
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'AmazonShop',
      description: 'Purchase Description',
      order_id: orderId,
      modal: {
        escape: false,
      },
      handler: (paymentRes: any) => {
        this.paymentService
          .updateRetrypaymentdetails(
            paymentRes.razorpay_order_id,
            paymentRes.razorpay_payment_id,
            paymentRes.razorpay_signature,
            'Completed',
            this.retryCount
          )
          .subscribe(() => {
            this.router.navigateByUrl(
              '/orders/detail/' + this.details.order.id
            );
          });
      },
      prefill: {
        name: shipToAddress.firstName + ' ' + shipToAddress.lastName,
        email: 'youremail@example.com',
        contact: '',
      },
      theme: {
        color: '#0c238a',
      },
    };

    options.modal.ondismiss = () => {
      this.retryCount++;
      if (this.retryCount >= 2) {
        this.retryFailedTwice = true;
        this.details.paymentDetails.status = 'Pending - Cash on Delivery';
        this.notification.Info(
          'Online payment failed twice, updated your payment status to Cash on Delivery.'
        );
      } else {
        this.notification.Error('Transaction cancelled.');
      }
      this.updatePaymentStatus(
        orderId,
        this.details.paymentDetails.status,
        this.retryCount
      );
    };

    const r = new this.winRef.nativeWindow.Razorpay(options);
    r.open();
  }

  updatePaymentStatus(orderId: string, status: string, retryCount: number) {
    this.paymentService
      .updateRetrypaymentdetails(orderId, '', '', status, retryCount)
      .subscribe({
        next: (response) => {
          console.log('Payment status updated successfully');
        },
        error: (error) => {
          console.error('Error updating payment status', error);
        },
      });
  }

  refreshIcon() {
    this.routing.paramMap.subscribe((params) => {
      const id = Number(params.get('orderId'));
      if (id) {
        this.fetchOrderDetails(id);
      }
    });
  }
}
