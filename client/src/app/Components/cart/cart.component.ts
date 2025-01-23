import { Component, Inject, OnInit } from '@angular/core';
import { BASE_IMAGE_API } from '../../core/token/baseUrl.token';
import { AppState } from '../../redux/store';
import { Store } from '@ngrx/store';
import { selectCartProperty } from '../../redux/cart/cart.selector';
import { Observable } from 'rxjs';
import { ShoppingCart } from '../../core/Models/Cart';
import { loadCart, RemoveCartItem, UpdateCartItem } from '../../redux/cart/cart.action';
import { SharedModule } from '../../shared/shared.module';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  standalone:true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports:[SharedModule]
})
export class CartComponent implements OnInit {
  cart$:Observable<ShoppingCart|null>;

  constructor(
    @Inject(BASE_IMAGE_API) public imageUrl: string,
    private store:Store<AppState>,
    private notification: NotificationService
  ){
    this.cart$=this.store.select(selectCartProperty);
    //this.loading$ = this.store.select(selectWishlistLoading);
  }
  ngOnInit(): void {
    this.store.dispatch(loadCart());
  }
  updateCartItem(cartItemId: number, quantity: number) {
    if (quantity > 3) {
      this.notification.Error('You can only add a maximum of 3 quantities per item.');
      return;
    }
    this.store.dispatch(UpdateCartItem({ cartItemId, quantity }));
  }

  removeCartItem(cartItemId:number){
    this.store.dispatch(RemoveCartItem({cartItemId}))
  }

}
