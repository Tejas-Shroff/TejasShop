import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { general_u, orderDeatails_o } from 'src/app/constants/messages';
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
      .updateCancelledOrderStatus(orderId, orderDeatails_o.statusCancelled_o)
      .subscribe({
        next: (response) => {
          if (response.isSuccessed) {
            this.notification.Success(orderDeatails_o.orderCancelledSuccess_o);
            this.details.order.status = orderDeatails_o.statusCancelled_o;

            const paymentStatus =
              this.details.paymentDetails.status.toLowerCase();
            switch (paymentStatus) {
              case orderDeatails_o.paymentStatusPending_o:
                this.details.paymentDetails.status =
                  orderDeatails_o.statusRefundNotApplicable_o;
                break;
              case orderDeatails_o.paymentStatusCompleted_o:
                this.details.paymentDetails.status =
                  orderDeatails_o.statusRefundInitiated_o;
                break;
              case orderDeatails_o.paymentStatusPendingCOD_o:
                this.details.paymentDetails.status =
                  orderDeatails_o.statusRefundNotApplicable_o;
                break;
              default:
                break;
            }

            this.updatePaymentStatusForCancelOrder(
              this.details.order.id,
              this.details.paymentDetails.status
            );
          } else {
            this.notification.Error(orderDeatails_o.orderCancelledError_o);
          }
        },
        error: () => {
          this.notification.Error(orderDeatails_o.generalError_o);
        },
      });
  }

  updatePaymentStatusForCancelOrder(
    orderId: number,
    paymentStatus: string
  ): void {
    this.paymentService.updatePaymentStatus(orderId, paymentStatus).subscribe();
  }

  isOrderOlderThan30Days(orderDate: string): boolean {
    const currentDate = new Date();
    const orderDateObj = new Date(orderDate);
    const differenceInDays =
      (currentDate.getTime() - orderDateObj.getTime()) / (1000 * 3600 * 24);
    return differenceInDays > 30;
  }

  retryPayment(orderId: number) {
    if (this.retryCount >= 2) {
      this.retryFailedTwice = true;
      this.details.paymentDetails.status = orderDeatails_o.pending_COD;
      // this.notification.Info(orderDeatails_o.RetryPaymentfailedToastr_o);
      this.updatePaymentStatus(
        orderId.toString(),
        this.details.paymentDetails.status,
        this.retryCount
      );
      window.location.reload();
      this.notification.Info(orderDeatails_o.RetryPaymentfailedToastr_o);
      return;
    }
    // window.location.reload();

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
      amount: amount * 100,
      currency: general_u.INR_o,
      name: general_u.AmazonShop_o,
      description: general_u.PurchaseDescription_o,
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
            general_u.Completed_o,
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
        email: general_u.mail_o,
        contact: '',
      },
      theme: {
        color: general_u.color_code_o,
      },
    };

    options.modal.ondismiss = () => {
      this.retryCount++;
      if (this.retryCount >= 2) {
        this.retryFailedTwice = true;
        this.details.paymentDetails.status = orderDeatails_o.pending_COD;
        this.notification.Info(orderDeatails_o.RetryPaymentfailedToastr_o);
      }else{
        this.notification.Error(orderDeatails_o.transactionFailedToastr_o);
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
      .subscribe();
  }
}
