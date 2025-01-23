import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../core/Services/orders.service';
import { GetUserOrdersDTO } from '../../core/Models/userOrder';

import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {
  orders:GetUserOrdersDTO[] = [];

  //#region for pagination 
  displayedOrders!: GetUserOrdersDTO[];
  pageSize = 3;
  pageIndex = 0;
  //#end region 

  selectedOrders: GetUserOrdersDTO[] = []; // for mulitple selection

  //filterMonths = 1; // for filter dropdown , Default filter to 1 month

  filterDays = 1;

  constructor(
    public orderService: OrdersService,
    private router: Router
  ) { 

  }
  // ngOnInit(): void {
  //   this.orderService.getUserOrders().subscribe(o=>{
  //     this.orders=o
  //   })
  // }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - this.filterDays);

    this.orderService.getUserOrders(startDate.toISOString(), endDate.toISOString()).subscribe(o => {
      this.orders = o;
      this.updateDisplayedOrders();
    });
  }

  // onFilterChange(event: Event): void {
  //   const selectElement = event.target as HTMLSelectElement;
  //   this.filterMonths = +selectElement.value;
  //   this.updateDisplayedOrders();
  // }

  // filterOrdersByDate(orders: GetUserOrdersDTO[], months: number): GetUserOrdersDTO[] {
  //   const currentDate = new Date();
  //   return orders.filter(order => {
  //     const orderDate = new Date(order.orderDate);
  //     const diffMonths = (currentDate.getFullYear() - orderDate.getFullYear()) * 12 + (currentDate.getMonth() - orderDate.getMonth());
  //     return diffMonths < months;
  //   });
  // } // month wise

  onFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.filterDays = +selectElement.value;
    this.fetchOrders();
  }

  filterOrdersByDate(orders: GetUserOrdersDTO[], days: number): GetUserOrdersDTO[] {
    const currentDate = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      const diffTime = Math.abs(currentDate.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= days;
    });
  }

  
  updateDisplayedOrders(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // const filteredOrders = this.filterOrdersByDate(this.orders, this.filterDays);

    this.displayedOrders = this.orders.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedOrders();
  }

  toggleSelection(order: GetUserOrdersDTO): void {
    const index = this.selectedOrders.indexOf(order);
    if (index > -1) {
      this.selectedOrders.splice(index, 1);
    } else {
      this.selectedOrders.push(order);
    }
  }

  viewSelectedOrders(): void {
    const selectedOrderIds = this.selectedOrders.map(order => order.id);
    this.router.navigate(['/orders/detail/'+ selectedOrderIds ]);
  }

}
