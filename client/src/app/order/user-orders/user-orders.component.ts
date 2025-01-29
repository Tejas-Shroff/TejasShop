
import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../core/Services/orders.service';
import { GetUserOrdersDTO } from '../../core/Models/userOrder';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {
  orders: GetUserOrdersDTO[] = [];
  filteredOrders: GetUserOrdersDTO[] = [];
  paginatedOrders: GetUserOrdersDTO[] = [];
  selectedFilter: string = 'all';

  constructor(public orderService: OrdersService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.orderService.getAllUserOrders().subscribe(o => {
      this.orders = o;
      this.filterOrders();
    });
  }

  filterOrders() {
    const now = new Date();
    this.filteredOrders = this.orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      switch (this.selectedFilter) {
        case 'today':
          return this.datePipe.transform(orderDate, 'yyyy-MM-dd') === this.datePipe.transform(now, 'yyyy-MM-dd');
        case '1month':
          return orderDate >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        case '2months':
          return orderDate >= new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
        case '3months':
          return orderDate >= new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        case '6months':
          return orderDate >= new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        default:
          return true;
      }
    });
    this.paginate({ pageIndex: 0, pageSize: 10 });
  }

  paginate(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  toggleRow(order: GetUserOrdersDTO) {
    order.expanded = !order.expanded;
    if (!order.expanded) {
      order.selected = false; // Deselect the row if it is being unexpanded
    }
  }

  expandAll() {
    const expand = this.filteredOrders.some(order => !order.expanded);
    this.filteredOrders.forEach(order => order.expanded = expand);
  }

  viewSelectedOrders() {
    this.filteredOrders.forEach(order => {
      if (order.selected) {
        order.expanded = true;
      }
    });
  }
  onCheckboxChange(order: GetUserOrdersDTO) {
    if (!order.selected) {
      order.expanded = false; // Unexpand the row if it is deselected
    }
  }

  
  


  
}
