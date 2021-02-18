import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems : CartItem [];

  totalPrice : Subject<number> = new Subject<number>();
  totalQuantity : Subject<number> = new Subject<number>();

  constructor() { 
    this.cartItems = [];
  }

  addToCart(cartItem : CartItem){

    let alreadyExistingInCart : boolean = false;
    let existingCartItem : CartItem;

    if(this.cartItems.length > 0){

      for(let tmpCartItem of this.cartItems){

        if(tmpCartItem == cartItem){

          alreadyExistingInCart = true;          
          break;

        }

      }      
      
    }

    if(alreadyExistingInCart){

      existingCartItem = cartItem;
      existingCartItem.quantity++;

    }
    else{
      
      this.cartItems.push(cartItem);
      
    }

    this.computeCartTotals();

  }

  computeCartTotals(){ 

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let tmpCartItem of this.cartItems){

      totalPriceValue += tmpCartItem.quantity * tmpCartItem.unitPrice;
      totalQuantityValue += tmpCartItem.quantity;

    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

  }

}
