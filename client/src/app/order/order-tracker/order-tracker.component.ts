import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-order-tracker',
  templateUrl: './order-tracker.component.html',
  styleUrls: ['./order-tracker.component.scss']
})
export class OrderTrackerComponent implements OnInit, OnChanges {
  @Input() orderStatus!: string;
  @Input() paymentStatus!: string;

  steps: string[] = [];

  ngOnInit(): void {
    this.updateOrderStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderStatus'] || changes['paymentStatus']) {
      this.updateOrderStatus();
    }
  }

  updateOrderStatus(): void {
    console.log('orderStatus:', this.orderStatus);
    console.log('paymentStatus:', this.paymentStatus);

    if (this.paymentStatus && this.paymentStatus.toLowerCase() === 'completed' && this.orderStatus && this.orderStatus.toLowerCase() !== 'cancelled') {
      
      this.orderStatus = 'confirmed';
      setTimeout(() => {
      }, 10000); // 10 seconds after "Confirmed"
    }

    this.steps = [
      "Placed",
      'Payments',
      this.orderStatus.toLowerCase() === 'cancelled' ? 'Order Cancelled' : 'Order Confirmed',
      'Shipped',
      'Out For Delivery',
      'Delivered'
    ];

    console.log('Updated steps:', this.steps);
  }
}