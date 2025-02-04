import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProductResDto } from 'src/app/core/Models/catalog';
import { CatalogService } from 'src/app/core/Services/catalog.service';
import { AddToCart, loadCart } from 'src/app/redux/cart/cart.action';
import { AppState } from 'src/app/redux/store';
import {
  AddToWishList,
  loadWishList,
  RemoveFromWishList,
} from 'src/app/redux/wishlist/wishlist.action';
import { NotificationService } from 'src/app/notification/notification.service';
import { ShoppingCart } from 'src/app/core/Models/Cart';
import { selectCartProperty } from 'src/app/redux/cart/cart.selector';
import { selectWishlistItems } from 'src/app/redux/wishlist/wishlist.selector';
import { ProductDetails_M } from 'src/app/constants/messages';

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
  cartItems: any[] = [];

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
      this.cart = cart;
    });

  }

  updateQuantity(newQuantity: number) {
    const stockQuantity = this.product.stockQuantity;
    const maxAllowedQuantity = this.getMaxAllowedQuantity(stockQuantity);

    if (newQuantity < 1) {
      this.quantity = 1;
    } else if (newQuantity > maxAllowedQuantity) {
      this.quantity = maxAllowedQuantity;
      this.notification.Warning(
        ProductDetails_M.MaxQty.replace('{0}', maxAllowedQuantity.toString())
      );
    } else {
      this.quantity = newQuantity;
    }
  }

  loadWishlistData() {
    this.store.dispatch(loadWishList());
    this.store.select(selectWishlistItems).subscribe((res) => {
      this.wishlistItems = res || [];
    });
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
    const stockQuantity = this.product.stockQuantity;
    const maxAllowedQuantity = this.getMaxAllowedQuantity(stockQuantity);

    const cartItem = this.cartItems.find(
      (item) => item.productId === productId
    );
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    console.log(`Product ID: ${productId}`);
    console.log(`Stock Quantity: ${stockQuantity}`);
    console.log(`Max Allowed Quantity: ${maxAllowedQuantity}`);
    console.log(`Current Quantity in Cart: ${currentQuantity}`);
    console.log(`Requested Quantity to Add: ${this.quantity}`);

    if (currentQuantity >= maxAllowedQuantity) {
      this.notification.Error(
         ProductDetails_M.MaximumQtyForCart.replace('{0}', maxAllowedQuantity.toString())
      );
      return;
    }

    if (currentQuantity + this.quantity > maxAllowedQuantity) {
      this.notification.Info(
        ProductDetails_M.MaxQty.replace('{0}', maxAllowedQuantity.toString())
      );
      return;
    }

   
    this.store.dispatch(AddToCart({ productId, quantity: this.quantity }));
  }

  getMaxAllowedQuantity(stockQuantity: number): number {
    if (stockQuantity <= 10) return 1;
    else if (stockQuantity <= 20) return 2;
    else if (stockQuantity <= 50) return 3;
    else if (stockQuantity <= 500) return 4;
    else return 5;
  }

  addToWishList(productId: number) {
    this.loadWishlistData();
    const isAlreadyInWishlist = this.wishlistItems.some(
      (item) => item.productId === productId
    );

    if (isAlreadyInWishlist) {
      this.removeItemFromWishlist(productId);
      this.notification.Warning('Removed from wishlist');
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
  removeItemFromWishlist(productId: number) {
    this.store.dispatch(RemoveFromWishList({ productId }));
  }
}
