import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailDTO } from 'src/app/core/Models/order';
import { OrdersService } from 'src/app/core/Services/orders.service';
import { PaymentService } from 'src/app/core/Services/payment.service';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})

export class OrderDetailsComponent implements OnInit {
  details!: OrderDetailDTO;
  @Input() orderId!: number; // Ensure this is a number

  constructor(
    private orderService: OrdersService,
    private routing: ActivatedRoute,
    private notification: NotificationService,
    private paymentService: PaymentService
  ) { }

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
    this.orderService.getOrderDetail(orderId).subscribe(d => {
      this.details = d;
    });
  }

  cancelOrder(orderId: number) {
    console.log(orderId)
    this.orderService.updateCancelledOrderStatus(orderId, 'Cancelled').subscribe({
        next: response => {
          console.log(response)
            if (response.isSuccessed) {
                this.notification.Success('Order cancelled successfully');
                this.details.order.status = 'Cancelled'; // Update the order status
            } else {
                this.notification.Error('Failed to cancel the order');
            }
        },
        error: error => {
            console.error('There was an error!', error);
        }
    });
  }

  // retryPayment(orderId: number) {
  //   this.paymentService.retryPayment(orderId).subscribe(res => {
  //     if (res.isSuccessed) {
  //       this.notification.Success('Payment Successful');
  //       this.details.order.status = 'Paid'; // Update the order status
  //     } else {
  //       this.notification.Error('Payment Failed');
  //       this.details.order.status = 'Cancelled'; // Update the order status
  //     }
  //   });
  // }
}