import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../core/Services/orders.service';
import { GetUserOrdersDTO } from '../../core/Models/userOrder';
import { DatePipe } from '@angular/common';
import { userOrders_c } from 'src/app/constants/messages';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css'],
})
export class UserOrdersComponent implements OnInit {
  orders: GetUserOrdersDTO[] = [];
  filteredOrders: GetUserOrdersDTO[] = [];
  paginatedOrders: GetUserOrdersDTO[] = [];
  selectedFilter: string = '1month';

  constructor(public orderService: OrdersService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.orderService.getAllUserOrders().subscribe((o) => {
      this.orders = o;
      this.filterOrders();
    });
  }

  filterOrders() {
    const now = new Date();
    const dateFilters = {
      [userOrders_c.today_u]: (orderDate: Date) =>
        this.datePipe.transform(orderDate, userOrders_c.dateFomrat) ===
        this.datePipe.transform(now, userOrders_c.dateFomrat),
      [userOrders_c.oneMonth_u]: (orderDate: Date) =>
        orderDate >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
      [userOrders_c.twoMonth_u]: (orderDate: Date) =>
        orderDate >= new Date(now.getFullYear(), now.getMonth() - 2, now.getDate()),
      [userOrders_c.threeMonth_u]: (orderDate: Date) =>
        orderDate >= new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
      [userOrders_c.sixMonth_u]: (orderDate: Date) =>
        orderDate >= new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
    };
  
    this.filteredOrders = this.orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      const filterFunc = dateFilters[this.selectedFilter];
      return filterFunc ? filterFunc(orderDate) : true;
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
      order.selected = false;
    }
  }

  expandAll() {
    const expand = this.filteredOrders.some((order) => !order.expanded);
    this.filteredOrders.forEach((order) => (order.expanded = expand));
  }

  viewSelectedOrders() {
    this.filteredOrders.forEach((order) => {
      if (order.selected) {
        order.expanded = true;
      }
    });
  }
  onCheckboxChange(order: GetUserOrdersDTO) {
    if (!order.selected) {
      order.expanded = false;
    }
  }
}
