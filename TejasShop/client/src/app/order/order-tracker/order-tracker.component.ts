import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { orderTracker_c } from 'src/app/constants/messages';
import { OrderDetailDTO } from 'src/app/core/Models/order';

@Component({
  selector: 'app-order-tracker',
  templateUrl: './order-tracker.component.html',
  styleUrls: ['./order-tracker.component.scss'],
})
export class OrderTrackerComponent implements OnInit, OnChanges {
  @Input() orderStatus!: string;
  @Input() paymentStatus!: string;
  @Input() orderDetail!: OrderDetailDTO;

  steps: string[] = [];

  ngOnInit(): void {
    this.updateOrderStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes[orderTracker_c.orderStatus_o] ||
      changes[orderTracker_c.paymentStatus_o]
    ) {
      this.updateOrderStatus();
    }
  }

  updateOrderStatus(): void {
    if (
      this.paymentStatus &&
      this.paymentStatus.toLowerCase() === orderTracker_c.Completed_o &&
      this.orderStatus &&
      this.orderStatus.toLowerCase() !== orderTracker_c.Cancelled_o
    ) {
      this.orderStatus = orderTracker_c.Confirmed_o;
      if (this.paymentStatus.toLowerCase() === orderTracker_c.Completed_o) {
        this.paymentStatus = orderTracker_c.paymentCompleted_o;
      }
    }

    this.steps = [
      orderTracker_c.placed_o,
      orderTracker_c.payments_o,
      this.orderStatus.toLowerCase() === orderTracker_c.Cancelled_o
        ? orderTracker_c.orderCancelled_o
        : orderTracker_c.orderConfirmed_o,
      orderTracker_c.shipped_o,
      orderTracker_c.ourForDelivery_o,
      orderTracker_c.delivered_o,
    ];
  }
}
