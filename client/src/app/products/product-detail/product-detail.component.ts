import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProductResDto } from 'src/app/core/Models/catalog';
import { CatalogService } from 'src/app/core/Services/catalog.service';
import { AddToCart } from 'src/app/redux/cart/cart.action';
import { AppState } from 'src/app/redux/store';
import {
  AddToWishList,
  loadWishList,
} from 'src/app/redux/wishlist/wishlist.action';
import { NotificationService } from 'src/app/notification/notification.service';
import { ShoppingCart } from 'src/app/core/Models/Cart';
import { selectCartProperty } from 'src/app/redux/cart/cart.selector';
import { selectWishlistItems } from 'src/app/redux/wishlist/wishlist.selector';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product!: ProductResDto;
  quantity: number = 1;
  cart!: ShoppingCart | null;
  wishlistItems: any[] = [];

  constructor(
    private _route: ActivatedRoute,
    private catalogService: CatalogService,
    private store: Store<AppState>,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id) {
        this.catalogService.getProductById(id).subscribe((res) => {
          // Fetch the product details
          if (res.data) this.product = res.data;
        });
      }
    });

    this.store.select(selectCartProperty).subscribe((cart) => {
      // Get the cart data
      this.cart = cart;
    });

    this.store.dispatch(loadWishList());
    this.store.select(selectWishlistItems).subscribe((res) => {
      this.wishlistItems = res || [];
    });
  }

  updateQuantity(newQuantity: number) {
    if (newQuantity < 1) {
      this.quantity = 1;
    } else if (newQuantity > 10) {
      this.quantity = 10;
    } else {
      this.quantity = newQuantity;
    }
  }
  addToCart(productId: number) {
    const cartItems = this.cart?.items || [];
    const cartItem = cartItems.find((item) => item.productId === productId);
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    if (currentQuantity + this.quantity > 3) {
      this.notification.Error(
        'You can only add a maximum of 3 quantities per item.'
      );
      return;
    }

    this.store.dispatch(AddToCart({ productId, quantity: this.quantity }));
  }

  addToWishList(productId: number) {
    const isAlreadyInWishlist = this.wishlistItems.some(
      (item) => item.productId === productId
    );

    if (isAlreadyInWishlist) {
      this.notification.Info('This item is already in your wishlist');
    } else {
      this.store.dispatch(AddToWishList({ productId }));
      this.notification.Success('Added to wishlist');
    }
  }
  NotifyUs() {
    this.notification.Info(
      'Will notify you once the product is in stock again! We appreciate your patience.'
    );
  }
}
