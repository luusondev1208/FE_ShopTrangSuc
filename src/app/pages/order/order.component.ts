import { Component } from '@angular/core';
import { CartService } from 'src/app/service/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/shared/model/product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiscountService } from 'src/app/service/discount.service';
import { OrderService } from 'src/app/service/order.service';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  cartItems: any;
  imgList: any;
  discountForm: FormGroup;
  discountList: any = [];
  checkedVoucher: any;
  userLogin: any
  paymentMethodChecked: string = ""
  urlPayment: any = ""
  orderData: any = {
    name: '',
    mobile: '',
    address: '',
    user: '',
    note: '',
    email: '',
  };


  constructor(private cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private orderSevice: OrderService,
    private userService: UserService,
    private discountService: DiscountService) {
    activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        cartService.getCartItemById(params['id']).subscribe(data => {
          this.cartItems = data;
          this.imgList = Product.images;

        });
      }
    });

    this.discountForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  formatPrice(price: number): string {
    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    return formattedPrice;
  }

  paymentMethod(event: any) {
    const selectedpaymentMethod = event.target.value;
    this.paymentMethodChecked = selectedpaymentMethod
    console.log(this.paymentMethodChecked);

  }

  onSubmit() {
    this.discountService.getCouponByDiscount().subscribe((response) => {
      this.discountList = response.data
      console.log(this.discountList);
    })

  }

  isOptionDisabled(fromPrice: any): boolean {
    return Number(this.getTotalPrice()) < Number(fromPrice);
  }

  onVoucherChange(event: any) {
    const selectedItemId = event.target.value;
    this.checkedVoucher = this.discountList && this.discountList.find((item: any) => item._id === selectedItemId);
  }

  ngOnInit(): void {
    this.loadCartItems();
  }

  getTotalPrice(): number {
    return this.cartItems.products.reduce((total: any, product: any) => {
      const productTotal = product?.product.price * product.quantity;
      return total + productTotal;
    }, 0);
  }

  paymentOrder() {
    if (this.paymentMethodChecked === "") {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    this.orderData.user = this.userLogin._id;
    this.orderData.totalPrice = this.calculatePrice();
    this.orderData.paymentMethod = this.paymentMethodChecked;

    if (this.paymentMethodChecked === "Thanh toán khi nhận hàng" && this.checkedVoucher) {
      this.orderData.vouchers = [this.checkedVoucher._id];
    }

    if (this.paymentMethodChecked === "Thanh toán khi nhận hàng") {
      this.orderSevice.createOrder(this.orderData).subscribe((response) => {
        alert(response.message);
      }, (error) => {
        alert(error.error.message)
      })

    } else {
      this.orderSevice.createOrder(this.orderData).subscribe((response) => {
        const paymentData = {
          amount: this.calculatePrice(),
          language: "vn"
        }


        localStorage.setItem("idOrder", response.order._id)

        this.orderSevice.createPaymentUrl(paymentData).subscribe((res) => {

          window.location.href = res.url

        }, (err) => {
          console.log(err);
        })

      }, (error) => {
        alert(error.error.message)
      })
    }
  }

  calculatePrice(): number {
    if (this.checkedVoucher) {
      const total = this.cartItems.products.reduce((total: any, product: any) => {
        const productTotal = product?.product.price * product.quantity;
        return total + productTotal;
      }, 0);

      const totalIsVoucher = Number(total) - this.checkedVoucher.discountPrice
      return totalIsVoucher
    }
    else {
      return this.getTotalPrice()
    }

  }

  loadCartItems(): void {
    const local = localStorage.getItem("user");
    const user: any = local && JSON.parse(local);
    this.userLogin = user;
    this.userService.getUser(user._id).subscribe((res) => {
      this.cartService.getCart(res.use.cart).subscribe((items: any) => {
        this.cartItems = items?.cart;
        this.onSubmit()
      });
    })


  }


}
