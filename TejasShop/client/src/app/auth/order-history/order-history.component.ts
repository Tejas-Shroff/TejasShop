import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/Services/auth.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit{
  orderHistory: any[] = [];

  constructor(private authsservice : AuthService){}

  ngOnInit(): void {

    this.authsservice.getOrderHistory().subscribe(data => {
      this.orderHistory = data;
      // console.log('Fetched Order History:', this.orderHistory); // Log the fetched data
    });
  

  }
  logout(){
    this.authsservice.LogOutAdminSide().subscribe();
  }


}
