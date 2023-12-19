import { Component } from '@angular/core';
import { CartService } from 'src/app/service/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/shared/model/product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiscountService } from 'src/app/service/discount.service';
import { OrderService } from 'src/app/service/order.service';
import { UserService } from 'src/app/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgToastService } from 'ng-angular-popup';
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
  userID: any;
  userList: any = {};
  validationMessages: { [key: string]: string } = {};

  validateInput(field: string, value: string): void {
    switch (field) {
      case 'name':
        this.validationMessages['name'] = !value  ? 'Vui lòng nhập tên.' : '';
        break;
      case 'address':
        this.validationMessages['address'] = !value ? 'Vui lòng nhập địa chỉ.' : '';
        break;
        case 'mobile':
          if (!value || !/^\d{10}$/.test(value)) {
            this.validationMessages['mobile'] = 'Vui lòng nhập số điện thoại .';
          } else {
            this.validationMessages['mobile'] = '';
          }
          break;
        
      case 'email':
        this.validationMessages['email'] = !value || !value.match(/^\S+@\S+\.\S+$/) ? 'Vui lòng nhập địa chỉ email hợp lệ.' : '';
        break;
      case 'note':
        this.validationMessages['note'] = !value ? 'Vui lòng nhập ghi chú.' : '';
        break;
      default:
        break;
    }
  }
  
  constructor(private cartService: CartService,
    private toast: NgToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private orderSevice: OrderService,
    private userService: UserService,
    private toastr: ToastrService,
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
    this.userLogin = this.orderData.email;
    this.userID = this.orderData.user;
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

  getPriceBySize(product:any,size:any){
    const pr = product.list_size.list_size.find((item:any)=>Number(item.name)===Number(size))
    return pr.price
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
      const pr = this.getPriceBySize(product?.product,product.size)
      const productTotal = pr * product.quantity;
      return total + productTotal;
    }, 0);
  }

  paymentOrder() {
    if (this.paymentMethodChecked === "") {
      console.log('Lỗi đặt hàng');
          this.toast.error({
            detail: 'Vui lòng chọn phương thức thanh toán',
            summary: 'Lỗi đặt hàng',
            duration: 5000,
            position: 'topRight',
          });
      return;
    }

    this.orderData.user = this.userLogin._id;
    // console.log(this.orderData.user);

    this.orderData.totalPrice = this.calculatePrice();
    this.orderData.paymentMethod = this.paymentMethodChecked;

    if (this.paymentMethodChecked === "Thanh toán khi nhận hàng" && this.checkedVoucher) {
      this.orderData.vouchers = [this.checkedVoucher._id];
    }

    if (this.paymentMethodChecked === "Thanh toán khi nhận hàng") {
      this.orderSevice.createOrder(this.orderData).subscribe((response) => {
        let userData = JSON.parse(localStorage.getItem("user") as string) || {};

    // Thêm dữ liệu đơn hàng mới vào mảng orders
    userData.orders = [...userData.orders, response.order];

    // Lưu dữ liệu đã cập nhật trở lại localStorage
    localStorage.setItem("user", JSON.stringify(userData));
        console.log('Đặt hàng thành công', response);
            this.toast.success({
              detail: 'Đặt hàng thành công',
              summary: 'Thành công',
              duration: 5000, // Display duration in milliseconds
              position: 'topRight',
            });
            this.router.navigate(['/']);
      }, (error) => {
        console.log('Lỗi đặt hàng', error);
        this.toast.error({
          detail: 'Vui lòng xem lại thông tin đơn hàng',
          summary: 'Lỗi đặt hàng',
          duration: 5000,
          position: 'topRight',
        });
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
          console.log(error);

        })
    }
  }

  calculatePrice(): number {
    if (this.checkedVoucher) {
      const total = this.cartItems.products.reduce((total: any, product: any) => {
        const pr = this.getPriceBySize(product?.product,product.size)
        const productTotal = pr * product.quantity;
        return total + productTotal;
      }, 0);

      const totalIsVoucher = Number(total) - this.checkedVoucher.discountPrice
      return totalIsVoucher
    }
    else {
      return this.getTotalPrice()
    }

  }

 // Trong component
 loadCartItems(): void {
  const local = localStorage.getItem("user");
  const user: any = local && JSON.parse(local);
  this.userLogin = user;

  this.userService.getUser(user._id).subscribe((res: any) => {
    this.userList = res.use;
    console.log(this.userList);

    this.orderData.name = this.userList.firstname + ' ' + this.userList.lastname;
    this.orderData.address = this.userList.address;
    this.orderData.mobile = this.userList.mobile;
    this.orderData.email = this.userList.email;
    this.orderData.note = '';
    // console.log('Name:', this.orderData.name);
    // console.log('Address:', this.orderData.address);

// console.log('Address:', this.orderData.address);
      this.cartService.getCart(res.use.cart).subscribe((items: any) => {
        this.cartItems = items?.cart;
        this.onSubmit();
      });
    })
  };
}
