import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {

  }

  addToCart(cartItem: CartItem) {

    let alreadyExistingInCart: boolean = false;

    if (this.cartItems.length > 0) {

      for (let tmpCartItem of this.cartItems) {

        if (tmpCartItem.id === cartItem.id) {

          tmpCartItem.quantity++;
          alreadyExistingInCart = true;
          break;

        }

      }

    }

    if (!alreadyExistingInCart) {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();

  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let tmpCartItem of this.cartItems) {

      totalPriceValue += tmpCartItem.quantity * tmpCartItem.unitPrice;
      totalQuantityValue += tmpCartItem.quantity;

    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

  }

  decrementQuantity(cartItem: CartItem) {

    if (this.cartItems.length > 0) {

      for (let tmpCartItem of this.cartItems) {

        if (tmpCartItem.id === cartItem.id) {

          tmpCartItem.quantity--;

          if(tmpCartItem.quantity === 0){

            this.removeItemFromCart(tmpCartItem);

          }
          else{

            this.computeCartTotals();

          }

          break;

        }

      }

    }

  }

  removeItemFromCart(cartItem: CartItem) {

    if (this.cartItems.length > 0) {

      let itemIndex: number = 0;

      for (let tmpCartItem of this.cartItems) {

        if (tmpCartItem.id == cartItem.id) {

          this.cartItems.splice(itemIndex, 1);
          break;

        }

        itemIndex++;

      }

      this.computeCartTotals();

    }

  }

  clearShoppingCart(){

    this.cartItems.splice(0, this.cartItems.length);

    this.computeCartTotals();

  }

}
