import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { WishlistService } from '../../core/Services/wishlist.service';
import { WishlistItem } from '../../core/Models/wishlist';
import { BASE_IMAGE_API } from '../../core/token/baseUrl.token';
import { Store } from '@ngrx/store';
import { AppState } from '../../redux/store';
import { AddToWishList, loadWishList, RemoveFromWishList } from '../../redux/wishlist/wishlist.action';
import { Observable } from 'rxjs';
import { selectWishlistItems, selectWishlistLoading } from '../../redux/wishlist/wishlist.selector';
import { AddToCart, loadCart } from '../../redux/cart/cart.action';
import { NotificationService } from 'src/app/notification/notification.service';
import { selectCartProperty } from 'src/app/redux/cart/cart.selector';
import { ShoppingCart } from 'src/app/core/Models/Cart';

@Component({
  standalone:true,
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  imports:[SharedModule]
})
export class WishlistComponent implements OnInit {
  wishlistItems!: WishlistItem[]|null;
  wishlistItems$:Observable<WishlistItem[]|null>;
  loading$: Observable<boolean>;
  cart!: ShoppingCart | null;
  cartItems: any[] =[];

  constructor(
    private service:WishlistService,
    @Inject(BASE_IMAGE_API) public imageUrl: string,
    private store:Store<AppState>,
    private notification: NotificationService
  )
  {
    this.wishlistItems$=this.store.select(selectWishlistItems);
    this.loading$ = this.store.select(selectWishlistLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(loadWishList());
    this.store.select(selectWishlistItems).subscribe(res=>{
      this.wishlistItems=res;
    })
  }
   loadCartData() {
      this.store.dispatch(loadCart());
      this.store.select(selectCartProperty).subscribe((cart) => {
        // Get the cart data
        this.cart = cart;
        this.cartItems = cart?.shoppingCartItems || [];
      });
    }

  addToCart(productId: number) {
    this.loadCartData();
    const cartItem = this.cartItems.find((item) => item.productId === productId);
    if (cartItem) {
      this.notification.Error('This item is already in your cart.');
      return;
    }

    this.store.dispatch(AddToCart({ productId, quantity: 1 }));
    this.store.dispatch(RemoveFromWishList({ productId }));
  }

  NotifyUs(item: WishlistItem) {
    this.notification.Info('Will notify you once the product is in stock again! We appreciate your patience.');
  }

  removeItem(productId: number) {
    this.store.dispatch(RemoveFromWishList({ productId }));
  }
}
