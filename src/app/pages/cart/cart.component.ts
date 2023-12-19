import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/service/cart.service';
import { CartItem } from 'src/app/shared/model/cart';
import { Product } from 'src/app/shared/model/product';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any;
  cart: any;
  imgList: any;
  demoQuantity:any=0

  constructor(private cartService: CartService, private toast: NgToastService, private activatedRoute: ActivatedRoute, private router: Router, private userService: UserService) {
    activatedRoute.params.subscribe((params) => {

      if (params['id']) {
        cartService.getCartItemById(params['id']).subscribe(data => {
          this.cartItems = data;
          this.imgList = Product.images;
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
  }

  showImg() {
    // console.log(this.imgList);

  }

  loadCartItems(): void {
    const local = localStorage.getItem("user");
    const user: any = local && JSON.parse(local);

    this.userService.getUser(user._id).subscribe((res) => { // đây
      this.cartService.getCart(res.use.cart).subscribe((items: any) => {
        this.cartItems = items?.cart;
        // this.demoQuantity=
      });
    })
  }

  getQuantityBySize(product:any,size:any){
    const qty = product.list_size.list_size.find((item:any)=>Number(item.name)===Number(size))
    return qty.quantity

  }
  getPriceBySize(product:any,size:any){
    const pr = product.list_size.list_size.find((item:any)=>Number(item.name)===Number(size))
    return pr.price
  }

  removeFromCart(cartItem: CartItem): void {
    const local = localStorage.getItem("user");
    const user = local && JSON.parse(local);

    this.userService.getUser(user._id).subscribe((res) => {
      this.cartService.removeCartItem(cartItem.product._id, res.use.cart).subscribe(() => {
        this.loadCartItems();


        this.toast.success({
          detail: 'Sản phẩm đã được xóa khỏi giỏ hàng.',
          summary: 'Thành công',
          duration: 5000,
          position: 'topRight',
        });
      });
    });
  }

  // getTotalItemsCount(): number {
  //   return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  // }

  getTotalPrice(): number {
    // console.log(this.cartItems);

    return this.cartItems.products.reduce((total: any, product: any) => {
    const pr = this.getPriceBySize(product?.product,product.size)
      const productTotal = pr *  product.quantity;
      return total + productTotal;
    }, 0);
  }
  // getTotal(): number {\ so luong nhan gia tien

  // }
  updateCartItem(cartItem: CartItem, quantity: any): void {
    const local = localStorage.getItem("user");
    const user = local && JSON.parse(local);

    const data: any = {
      productId: cartItem.product._id,
      size: cartItem.size,
      quantity: quantity,
      userId: user?._id
    }

    this.cartService.updateCartItem(data).subscribe(() => {
      this.loadCartItems();
    });
  }

  proceedOrder(): void {
    this.router.navigateByUrl('/order');
  }
  decreaseQuantity(cartItem: CartItem, quantity: any): void {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
      this.updateCartItem(cartItem, quantity);
    }

  }

  increaseQuantity(cartItem: CartItem, quantity: any): void {
    const qty = this.getQuantityBySize(cartItem.product,cartItem.size)

    if (quantity <= qty) {
      cartItem.quantity++;
      this.updateCartItem(cartItem, quantity);
    } else {
      this.toast.warning({
        detail: 'Số lượng vượt quá số lượng còn lại trong kho.',
        summary: 'Cảnh báo',
        duration: 5000,
        position: 'topRight',
      });
    }
  }
}
