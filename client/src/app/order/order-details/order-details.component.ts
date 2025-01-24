import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailDTO } from 'src/app/core/Models/order';
import { OrdersService } from 'src/app/core/Services/orders.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
// export class OrderDetailsComponent implements OnInit {
//   details!: OrderDetailDTO;
//   @Input() orderStatus!: string;
//   @Input() paymentStatus!: string;
//   //@Input() orderId!: string; // Add orderId as an input

//   @Input() orderId!: number;

//   constructor(
//     private orderService: OrdersService,
//     private routing: ActivatedRoute
//   ) { }

//   ngOnInit(): void {
//     this.routing.paramMap.subscribe((params) => {

//       this.orderService.getOrderDetail(Number(params.get('orderId'))).subscribe(d => {
//         this.details = d;
//       })
//     });

    
//   }

// }
export class OrderDetailsComponent implements OnInit {
  details!: OrderDetailDTO;
  @Input() orderId!: number; // Ensure this is a number

  constructor(
    private orderService: OrdersService,
    private routing: ActivatedRoute
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
}