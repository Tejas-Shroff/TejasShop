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
  updateCartItem(cartItemId: number, quantity: number, stockQuantity: number) {
    console.log(`Updating cart item: ${cartItemId}, Quantity: ${quantity}, Stock Quantity: ${stockQuantity}`);
    const maxAllowedQuantity = this.getMaxAllowedQuantity(stockQuantity);
    if (quantity > maxAllowedQuantity) {
        this.notification.Error(`You can only add a maximum of ${maxAllowedQuantity} quantities per item.`);
        return;
    }
    if (quantity < 1) {
        console.log(`Removing cart item: ${cartItemId}`);
        this.removeCartItem(cartItemId);
        return;
    }
    console.log(`Dispatching update for cart item: ${cartItemId} with quantity: ${quantity}`);
    this.store.dispatch(UpdateCartItem({ cartItemId, quantity }));
}
  getMaxAllowedQuantity(stockQuantity: number): number {
    if (stockQuantity <= 10) return 1;
    else if (stockQuantity <= 20) return 2;
    else if (stockQuantity <= 50) return 3;
    else if (stockQuantity <= 500) return 4;
    else return 5;
  }

  removeCartItem(cartItemId:number){
    this.store.dispatch(RemoveCartItem({cartItemId}))
  }

}
  