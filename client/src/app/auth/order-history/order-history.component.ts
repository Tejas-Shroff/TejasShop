import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/Services/auth.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit{
  // orderHistory: any[] = [];

  // constructor(private authsservice : AuthService){}

  // ngOnInit(): void {

  //   this.authsservice.getOrderHistory().subscribe(data => {
  //     this.orderHistory = data;
  //     // console.log('Fetched Order History:', this.orderHistory); // Log the fetched data
  //   });
  

  // }

 
  orderHistory: any[] = [];
  selectedMonths: number = 0; // by default it will show all orders,
  constructor(public authsservice: AuthService) {}
  ngOnInit(): void {

    this.fetchOrderHistory();

  }

  fetchOrderHistory(): void {
    this.authsservice.getOrderHistory(this.selectedMonths).subscribe(data => {
      this.orderHistory = data;
                                                          console.log('Fetched Order History:', this.orderHistory);
     });
  }
  // onFilterChange(months: number): void {
  //   this.selectedMonths = months;
  //     this.fetchOrderHistory();
  //   }

  onFilterChange(months: string): void {
    const monthValue = parseInt(months, 10);
    this.selectedMonths = monthValue;
    this.fetchOrderHistory();
  }

  logout(){
    this.authsservice.LogOutAdminSide().subscribe();
  }

}
