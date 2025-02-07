import { Component, Inject, OnInit } from '@angular/core';
import { BASE_IMAGE_API } from '../../core/token/baseUrl.token';
import { AppState } from '../../redux/store';
import { Store } from '@ngrx/store';
import { selectCartProperty } from '../../redux/cart/cart.selector';
import { Observable } from 'rxjs';
import { ShoppingCart } from '../../core/Models/Cart';
import {
  loadCart,
  RemoveCartItem,
  UpdateCartItem,
} from '../../redux/cart/cart.action';
import { SharedModule } from '../../shared/shared.module';
import { NotificationService } from 'src/app/notification/notification.service';
import { cart_c, getMaxAllowedQuantity } from 'src/app/constants/messages';
import { selectWishlistLoading } from 'src/app/redux/wishlist/wishlist.selector';

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [SharedModule],
})
export class CartComponent implements OnInit {
  cart$: Observable<ShoppingCart | null>;
  // loading$: Observable<boolean>;

  constructor(
    @Inject(BASE_IMAGE_API) public imageUrl: string,
    private store: Store<AppState>,
    private notification: NotificationService
  ) {
    this.cart$ = this.store.select(selectCartProperty);
    // this.loading$ = this.store.select(selectWishlistLoading);
  }
  ngOnInit(): void {
    this.store.dispatch(loadCart());
  }
  updateCartItem(cartItemId: number, quantity: number, stockQuantity: number) {
    const maxAllowedQuantity = getMaxAllowedQuantity(stockQuantity);
    if (quantity > maxAllowedQuantity) {
      this.notification.Error(
        cart_c.MaxQtyValidaton_c.replace('{0}', maxAllowedQuantity.toString())
      );
      return;
    }
    if (quantity < 1) {
      this.removeCartItem(cartItemId);
      return;
    }
    this.store.dispatch(UpdateCartItem({ cartItemId, quantity }));
  }
 
  removeCartItem(cartItemId: number) {
    this.store.dispatch(RemoveCartItem({ cartItemId }));
  }
}
