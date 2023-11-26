import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/shared/model/product';
import { ProductService } from 'src/app/service/product.service';
import { CartService } from 'src/app/service/cart.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { sizeOptions } from 'src/app/shared/model/size';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnInit {
  product: any = {};
  imgList: any;
  demoProduct: any = {}
  sizeOption: any[] = Object.values(sizeOptions).filter(value => typeof value === 'number')
  selectedSize: number | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private authService: AuthService,

  ) {
    activatedRoute.params.subscribe((params) => {
      productService.getProduct(params['id']).subscribe((data) => {
        this.product = data.productData;
        this.demoProduct = data.productData;
        console.log(data.productData);

        this.imgList = data.productData.images;
        this.cdr.detectChanges(); // Thử loại bỏ NgZone
        this.getSizeOptions(this.demoProduct._id)
      });
    });
  }

  ngOnInit(): void {
    this.getRoute(this.activatedRoute.snapshot.params['id']);
  }

  currentIndex = 0;

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.imgList.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.imgList.length) % this.imgList.length;
  }

  // onSizeChange(event: any) {
  //   // event.preventDefault()
  //   // this.selectedSize = event.target.value;
  //   // console.log('Selected Size:', this.selectedSize);
  // }

  addToCart() {

    const local = localStorage.getItem("user");
    const user: any = local && JSON.parse(local);
    const selectedSize = (document.querySelector('#sizeSelect') as HTMLSelectElement).value;
    const productId = this.demoProduct._id;


    const size = Number(selectedSize)
    const quantity = 1;
    if (this.authService.checklogin()) {
      this.cartService.addToCart(productId, size, quantity, user?._id).subscribe(
        (response) => {
          console.log('Add to cart successful', response);

        },
        (error) => {
          console.error('Add to cart failed', error);

        }
      );
    } else {

      console.log('Vui lòng đăng nhập trước khi thêm giỏ hàng.');
    }
  }



  getRoute(id: any): void {
    this.productService.getProduct(id).subscribe((res: any) => {
      this.product = res.product;
    });
  }
  getSizeOptions(productId: string): void {
    this.productService.getSizeOptions(productId).subscribe(
      (response) => {
        this.sizeOption = Object.values(sizeOptions);
      },
      (error) => {
        console.error('Error getting size options', error);
      }
    );
  }
}
