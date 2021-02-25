import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { CheckoutFormValidators } from 'src/app/validators/checkout-form-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup !: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];

  statesShipping: State[] = [];
  statesBilling: State[] = [];

  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService,
    private cartService: CartService, private checkoutService: CheckoutService, private router: Router) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({

      customer: this.formBuilder.group({

        firstName: new FormControl('', [Validators.required, Validators.minLength(2),
        CheckoutFormValidators.notOnlyWhitespace, CheckoutFormValidators.charAndWhitespace]),

        lastName: new FormControl('', [Validators.required, Validators.minLength(2),
        CheckoutFormValidators.notOnlyWhitespace, CheckoutFormValidators.charAndWhitespace]),

        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])

      }),

      shippingAddress: this.formBuilder.group({

        country: new FormControl('', [Validators.required]),

        street: new FormControl('', [Validators.required, Validators.minLength(2),
        CheckoutFormValidators.notOnlyWhitespace]),

        city: new FormControl('', [Validators.required, Validators.minLength(2),
        CheckoutFormValidators.notOnlyWhitespace, CheckoutFormValidators.charAndWhitespace]),

        state: new FormControl('', [Validators.required]),

        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
        CheckoutFormValidators.notOnlyWhitespace, CheckoutFormValidators.polishZipCode])

      }),

      billingAddress: this.formBuilder.group({

        country: new FormControl('', [Validators.required]),

        street: new FormControl('', [Validators.required, Validators.minLength(2),
        CheckoutFormValidators.notOnlyWhitespace]),

        city: new FormControl('', [Validators.required, Validators.minLength(2),
        CheckoutFormValidators.notOnlyWhitespace, CheckoutFormValidators.charAndWhitespace]),

        state: new FormControl('', [Validators.required]),

        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
        CheckoutFormValidators.notOnlyWhitespace, CheckoutFormValidators.polishZipCode])

      }),

      creditCard: this.formBuilder.group({

        cardType: new FormControl('', [Validators.required]),

        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2),
        CheckoutFormValidators.notOnlyWhitespace, CheckoutFormValidators.charAndWhitespace]),

        cardNumber: new FormControl('', [Validators.required, CheckoutFormValidators.cardNumberLength]),

        securityCode: new FormControl('', [Validators.required, CheckoutFormValidators.securityCodeLength]),

        expirationMonth: [''],

        expirationYear: ['']

      })

    });

    let currentMonth: number = new Date().getMonth() + 1;

    this.shopFormService.getCreditCardMonths(currentMonth).subscribe(

      data => {
        this.creditCardMonths = data;
      }

    );

    this.shopFormService.getCreditCardYears().subscribe(

      data => {
        this.creditCardYears = data;
      }

    );

    this.shopFormService.getCountries().subscribe(

      data => {
        this.countries = data;
      }

    )

    this.reviewCartDetails();

  }

  reviewCartDetails() {

    this.cartService.totalQuantity.subscribe(

      totalQuantity => this.totalQuantity = totalQuantity

    );

    this.cartService.totalPrice.subscribe(

      totalPrice => this.totalPrice = totalPrice

    );

  }

  get cardType() {

    return this.checkoutFormGroup.get('creditCard.cardType');

  }

  get nameOnCard() {

    return this.checkoutFormGroup.get('creditCard.nameOnCard');

  }

  get cardNumber() {

    return this.checkoutFormGroup.get('creditCard.cardNumber');

  }

  get securityCode() {

    return this.checkoutFormGroup.get('creditCard.securityCode');

  }

  get expirationMonth() {

    return this.checkoutFormGroup.get('creditCard.expirationMonth');

  }

  get expirationYear() {

    return this.checkoutFormGroup.get('creditCard.expirationYear');

  }

  get billingAddressCountry() {

    return this.checkoutFormGroup.get('billingAddress.country');

  }

  get billingAddressState() {

    return this.checkoutFormGroup.get('billingAddress.state');

  }

  get billingAddressCity() {

    return this.checkoutFormGroup.get('billingAddress.city');

  }

  get billingAddressStreet() {

    return this.checkoutFormGroup.get('billingAddress.street');

  }

  get billingAddressZipCode() {

    return this.checkoutFormGroup.get('billingAddress.zipCode')

  }

  get shippingAddressCountry() {

    return this.checkoutFormGroup.get('shippingAddress.country');

  }

  get shippingAddressState() {

    return this.checkoutFormGroup.get('shippingAddress.state');

  }

  get shippingAddressCity() {

    return this.checkoutFormGroup.get('shippingAddress.city');

  }

  get shippingAddressStreet() {

    return this.checkoutFormGroup.get('shippingAddress.street');

  }

  get shippingAddressZipCode() {

    return this.checkoutFormGroup.get('shippingAddress.zipCode');

  }

  get firstName() {

    return this.checkoutFormGroup.get('customer.firstName');

  }

  get lastName() {

    return this.checkoutFormGroup.get('customer.lastName');

  }

  get email() {

    return this.checkoutFormGroup.get('customer.email');

  }

  onSubmit() {

    if (this.checkoutFormGroup.invalid) {

      this.checkoutFormGroup.markAllAsTouched();
      return;

    }

    let purchase = new Purchase();

    this.completePurchase(purchase);

    this.checkoutService.placeOrder(purchase).subscribe(

      {

        next: response => {

          alert(`Your order has been received. \n Order tracking number: ${response.orderTrackingNumber}`);

          this.resetCart();

        },

        error: err => {

          alert(`There was an error: ${err.message}`);

        }

      }

    );

  }

  resetCart() {

    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.router.navigateByUrl("/products");

    this.checkoutFormGroup.reset();

  }

  completePurchase(purchase: Purchase) {

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(tmpCartItem => new OrderItem(tmpCartItem));

    purchase.order = order;

    purchase.orderItems = orderItems;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingState.name;

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

  }

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {

      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      this.statesBilling = this.statesShipping;

    }
    else {

      this.statesBilling = [];

      this.checkoutFormGroup.controls.billingAddress.reset();

    }

  }

  handleMonthsAndYears() {

    const creditCardFormInfo = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormInfo?.value.expirationYear);

    let startMonth: number;

    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(

      data => {
        this.creditCardMonths = data
      }

    );

  }

  getStatesForCountry(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;

    this.shopFormService.getStates(countryCode).subscribe(

      data => {

        if (formGroupName === 'shippingAddress') {

          this.statesShipping = data;

        }
        else {

          this.statesBilling = data;

        }

        formGroup?.get('state')?.setValue(data[0]);

      }

    )    

  }

}
