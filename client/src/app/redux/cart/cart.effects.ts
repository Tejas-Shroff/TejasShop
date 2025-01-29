import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartService } from 'src/app/core/Services/cart.service';
import { AddToCart, loadCart, loadCartFailure, loadCartSuccess, RemoveCartItem, UpdateCartItem } from './cart.action';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { NotificationService } from 'src/app/notification/notification.service';

@Injectable()
export class CartEffect {
    constructor(
        private actions$: Actions,
        private cartService: CartService,
        private notificationService:NotificationService
    ) { }


    loadCart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadCart),
            mergeMap(() =>
                this.cartService.getUserCart().pipe(
                    map((res) => {
                        return res.isSuccessed ? loadCartSuccess({ cart: res.data }) : loadCartFailure({ error: res.message })
                    }),
                    catchError((error) => of(loadCartFailure({ error })))
                )
            )
        )
    );

    // addToCart$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(AddToCart),
    //         mergeMap(({ productId, quantity }) =>
    //             this.cartService.addProductToCart(productId, quantity).pipe(
    //                 switchMap((res) => {
    //                     if (res.isSuccessed) {
    //                         console.log('backend response', res)
    //                         this.notificationService.Success();
    //                         return of(loadCart());
    //                     }
    //                     else {
    //                         this.notificationService.Error(res.message);
    //                         return of(loadCartFailure({ error: res.message }))
    //                     }
    //                 }),
    //                 catchError((error) =>{
    //                     this.notificationService.Error(error);
    //                     return of(loadCartFailure({ error }));
    //                 })
    //             )
    //         )
    //     )
    // );

   addToCart$ = createEffect(() =>
    this.actions$.pipe(
        ofType(AddToCart),
        mergeMap(({ productId, quantity }) =>
            this.cartService.addProductToCart(productId, quantity).pipe(
                switchMap((res) => {
                    if (res.isSuccessed) {
                        console.log('backend response', res);
                        // Fetch the cart item for the product
                        return this.cartService.getUserCart().pipe(
                            map((cartRes) => {
                                console.log('cart response', cartRes); // Log the cart response
                                const cartItems = cartRes?.data?.shoppingCartItems || [];
                                console.log('cart items', cartItems); // Log the cart items
                                const cartItem = cartItems.find(item => item.productId === productId);
                                console.log('cart item', cartItem); // Log the specific cart item
                                if (cartItem && cartItem.quantity < 3) {
                                    //this.notificationService.Success(`Successfully added ${cartItem.quantity} of ${cartItem.product.name} to the cart.`);
                                } else if (cartItem && cartItem.quantity >= 3) {
                                    this.notificationService.Info('You can only add a maximum of 3 quantities per item.');
                                } else {
                                    this.notificationService.Success('Successfully added to cart.');
                                }
                                return loadCart();
                            }),
                            catchError((error) => {
                                this.notificationService.Error(error);
                                return of(loadCartFailure({ error }));
                            })
                        );
                    } else {
                        this.notificationService.Error(res.message);
                        return of(loadCartFailure({ error: res.message }));
                    }
                }),
                catchError((error) => {
                    this.notificationService.Error(error);
                    return of(loadCartFailure({ error }));
                })
            )
        )
    )
);
    updateCartItem$=createEffect(() =>
        this.actions$.pipe(
            ofType(UpdateCartItem),
            mergeMap(({cartItemId,quantity}) =>
                this.cartService.updateCartItem(cartItemId,quantity).pipe(
                    switchMap((res) => {
                        return of(res.isSuccessed ? loadCart() : loadCartFailure({ error: res.message }))
                    }),
                    catchError((error) => of(loadCartFailure({ error })))
                )
            )
        )
    );

    removeCartItem$=createEffect(() =>
        this.actions$.pipe(
            ofType(RemoveCartItem),
            mergeMap(({cartItemId}) =>
                this.cartService.removeCartItem(cartItemId).pipe(
                    switchMap((res) => {
                        return of(res.isSuccessed ? loadCart() : loadCartFailure({ error: res.message }))
                    }),
                    catchError((error) => of(loadCartFailure({ error })))
                )
            )
        )
    );
}