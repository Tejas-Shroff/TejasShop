import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShoppingCart } from '../Models/Cart';
import { ResponseDto } from '../Models/response';
import { catchError, map, throwError } from 'rxjs';
import { NotificationService } from 'src/app/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient, private notification: NotificationService) { }

  getUserCart() {
    return this.http.get<ResponseDto<ShoppingCart>>('Cart')
  }


  // addProductToCart(productId: number, quantity: number) {
  //   return this.http.post<ResponseDto<null>>('Cart', {
  //     userId: 1,
  //     productId,
  //     quantity
  //   }
  // );
  // }
  addProductToCart(productId: number, quantity: number) {
    return this.http.post<ResponseDto<null>>('Cart', {
      userId: 1,
      productId,
      quantity
    }).pipe(
      map((res) => {
        if (res.isSuccessed) {
          return res;
        } else {
          throw new Error(res.message);
        }
      }),
      catchError((error) => {
        this.notification.Error(error.message || 'Failed to add product to cart.');
        return throwError(error);
      })
    );
  }

  updateCartItem(cartItemId: number, quantity: number) {
    return this.http.post<ResponseDto<null>>('CartItem', {
      userId: 1,
      cartItemId,
      quantity
    }
  )
  }
  removeCartItem(cartItemId: number,) {
    
    return this.http.delete<ResponseDto<null>>('CartItem/'+cartItemId)
  }
}
