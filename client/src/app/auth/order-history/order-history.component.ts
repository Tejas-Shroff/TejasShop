import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'src/app/core/Services/admin.service';
import { AuthService } from 'src/app/core/Services/auth.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit{

  orderHistory: any[] = [];
  dataSource = new MatTableDataSource<any>(this.orderHistory);
  displayedColumns: string[] = ['id', 'userId', 'orderDate', 'totalPriceAfterDiscount', 'status'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedMonths: number = 0; // by default it will show all orders,

  constructor(public authService: AuthService, public adminService: AdminService) {}

  ngOnInit(): void {

   this.fetchOrderHistory();

  }

  fetchOrderHistory(): void {
    this.adminService.getOrderHistory(this.selectedMonths).subscribe(data => {
      this.orderHistory = data;
      this.dataSource.data = this.orderHistory.slice(0,10); // I have set this to 10 records for initial loading.
      this.dataSource.paginator = this.paginator;
    });
  }

  onFilterChange(months: string): void {
    const monthValue = parseInt(months, 10);
    this.selectedMonths = monthValue;
    this.fetchOrderHistory();
  }

  onPageChange(event: any): void {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    this.dataSource.data = this.orderHistory.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }

  logout(){
    this.authService.LogOutAdminSide().subscribe();
  }

}
