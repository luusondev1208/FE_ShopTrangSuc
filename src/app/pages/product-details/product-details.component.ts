import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/shared/model/product';
import { ProductService } from 'src/app/service/product.service';
import { CartService } from 'src/app/service/cart.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { sizeOptions } from 'src/app/shared/model/size';
import { AuthService } from 'src/app/service/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { CategoryService } from 'src/app/service/category.service';

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
  productsByCategory: any[] = []; // Thêm mảng để lưu trữ sản phẩm của category

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private authService: AuthService,
    private toast: NgToastService,
    private categoryService: CategoryService,
  ) {
    activatedRoute.params.subscribe((params) => {
      productService.getProduct(params['id']).subscribe((data) => {
        this.product = data.productData;
        this.demoProduct = data.productData;
        console.log(data.productData);

        this.imgList = data.productData.images;
        this.cdr.detectChanges(); // Thử loại bỏ NgZone
        this.getSizeOptions(this.demoProduct._id);
        this.getProductsByCategory(this.demoProduct.category); // Thêm dòng này để lấy sản phẩm của category
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
  // format giá tiền
  formatPrice(num: number | string) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }
  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.imgList.length) % this.imgList.length;
  }
  navigateToBookDetail(productId: string) {
    // Sử dụng router.navigate để điều hướng đến trang chi tiết sách với ID cụ thể
    this.router.navigate(['/product/', productId]);

    // Cuộc trượt lên trên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  addToCart() {
    const local = localStorage.getItem('user');
    const user: any = local && JSON.parse(local);
    const selectedSize = (document.querySelector('#sizeSelect') as HTMLSelectElement).value;
    const productId = this.demoProduct._id;
  
    const size = Number(selectedSize);
    const quantity = 1;
    if (this.authService.checklogin()) {
      this.cartService.addToCart(productId, size, quantity, user?._id).subscribe(
        (response) => {
          console.log('Add to cart successful', response);
          this.toast.success({
            detail: 'Sản phẩm đã được thêm vào giỏ hàng.',
            summary: 'Thành công',
            duration: 5000, // Display duration in milliseconds
            position: 'topRight',
          });
        },
        (error) => {
          console.error('Add to cart failed', error);
          this.toast.error({
            detail: 'Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại sau.',
            summary: 'Lỗi',
            duration: 5000, // Display duration in milliseconds
            position: 'topRight',
          });
        }
      );
    } else {
      this.router.navigate(['/login']);
      console.log('Vui lòng đăng nhập trước khi thêm giỏ hàng.');
      this.toast.info({
        detail: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.',
        summary: 'Thông báo',
        duration: 5000, // Display duration in milliseconds
        position: 'topRight',
      });
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
  getProductsByCategory(categoryId: string): void {
    this.categoryService.getProductsByCategoryId(categoryId).subscribe(
      (response) => {
        this.productsByCategory = response.products;
        console.log(this.productsByCategory);
      },
      (error) => {
        console.error('Error getting products by category', error);
      }
    );
  }
  
  CheckLogin(): boolean {
    if (this.authService.checklogin()) {
      this.router.navigate(['/cart']);
      return true;
    } else {
      this.toast.error({ detail: "Thông báo", summary: 'Vui lòng đăng nhập để tiếp tục!', duration: 5000, position: "topRight" });
      this.router.navigate(['/login']);
      return false;
    }
  }
}
