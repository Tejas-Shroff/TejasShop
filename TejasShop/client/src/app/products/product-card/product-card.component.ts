import { Component, Inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { product_c } from 'src/app/constants/messages';
import { ProductResDto } from 'src/app/core/Models/catalog';
import { BASE_API, BASE_IMAGE_API } from 'src/app/core/token/baseUrl.token';
import { NotificationService } from 'src/app/notification/notification.service';
import { AddToCart } from 'src/app/redux/cart/cart.action';
import { AppState } from 'src/app/redux/store';
import {
  AddToWishList,
  loadWishList,
  RemoveFromWishList,
} from 'src/app/redux/wishlist/wishlist.action';
import { selectWishlistItems } from 'src/app/redux/wishlist/wishlist.selector';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  wishlistItems: any[] = [];

  constructor(
    @Inject(BASE_IMAGE_API) public imageUrl: string,
    private store: Store<AppState>,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadWishList());
    this.store.select(selectWishlistItems).subscribe((res) => {
      this.wishlistItems = res || [];
    });
  }

  @Input() product!: ProductResDto;

  addToCart(productId: number) {
    this.store.dispatch(AddToCart({ productId, quantity: 1 }));
  }

  addToWishList(productId: number) {
    const isAlreadyInWishlist = this.wishlistItems.some(
      (item) => item.productId === productId
    );

    if (isAlreadyInWishlist) {
      this.removeItemFromWishlist(productId);
      this.notification.Warning(product_c.RemovedToWishList_u);
    } else {
      this.store.dispatch(AddToWishList({ productId }));
      this.notification.Success(product_c.AddedToWishList_u);
    }
  }
  removeItemFromWishlist(productId: number) {
    this.store.dispatch(RemoveFromWishList({ productId }));
  }
  isInWishlist(productId: number): boolean {
    return this.wishlistItems.some((item) => item.productId === productId);
  }
}
