import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-tracker',
  templateUrl: './order-tracker.component.html',
  styleUrls: ['./order-tracker.component.scss']
})
export class OrderTrackerComponent implements OnInit {
  ngOnInit(): void {
    if (this.paymentStatus.toLowerCase() === 'completed') {
      this.orderStatus = 'confirmed';
      setTimeout(() => {
      }, 10000); // 10 seconds after "Confirmed"
    }
  }
  steps:string[] = [
    "Placed",
    'Order Confirmed',
    'Shipped',
    'Out For Delivery',
    'Delivered'
  ];

  @Input() orderStatus!:string;
  @Input() paymentStatus!:string;
  
}
