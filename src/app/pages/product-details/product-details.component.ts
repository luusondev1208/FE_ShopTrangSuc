import { BrandService } from 'src/app/service/brand.service';
import { UserService } from 'src/app/service/user.service';
  import { FeedbackService } from './../../service/feedback.service';
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
  import { FormBuilder } from '@angular/forms';
  import { ToastrService } from 'ngx-toastr';

  @Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class ProductDetailsComponent implements OnInit {
  
    product: any = {};
    imgList: any;
    user: any = null
    feedbackId: any;
    feedback: any ={};
    feedbackList: any[] = []; 
    demoProduct: any = {}
    brandId: any
    brand: any = {};
    sizeOption: any[] = Object.values(sizeOptions).filter(value => typeof value === 'number')
    selectedSize: number | null = null;
    productsByCategory: any[] = []; // Thêm mảng để lưu trữ sản phẩm của category

    constructor(
      private activatedRoute: ActivatedRoute,
      private productService: ProductService,
      private brandService: BrandService,
      private router: Router,
      private cartService: CartService,
      private cdr: ChangeDetectorRef,
      private zone: NgZone,
      private authService: AuthService,
      private toast: NgToastService,
      private categoryService: CategoryService,
      private formBuilder: FormBuilder,
      private toastr: ToastrService,
      private feedbackService: FeedbackService,
      private userService: UserService
    ) {
      activatedRoute.params.subscribe((params) => {
        this.loadProductData(params['id']);
        this.getRoute(params['id'])
        productService.getProduct(params['id']).subscribe((data) => {
          this.imgList = data.productData.images;
          this.getFeedbackDetails(data.productData.feedbacks)
          this.getBrandDetails(data.productData.brand)
console.log(data.productData.brand);

          this.cdr.detectChanges(); // Thử loại bỏ NgZone
          this.getSizeOptions(this.demoProduct._id);
          this.getProductsByCategory(this.demoProduct.category); // Thêm dòng này để lấy sản phẩm của category
        });
      });
    }
    loadProductData(productId: string): void {
      this.productService.getProduct(productId).subscribe((data) => {
        this.product = data.productData;
        // console.log(this.product);
        
        this.demoProduct = data.productData;
        this.imgList = data.productData.images;
        this.getProductsByCategory(this.demoProduct.category);
      });
    }
    ngOnInit(): void {
      this.user = JSON.parse(localStorage.getItem("user") as string)
      this.activatedRoute.params.subscribe((params) => {
        this.loadProductData(params['id']);
        this.getRoute(params['id']);
        this.productService.getProduct(params['id']).subscribe((data) => {
          this.imgList = data.productData.images;
  
          // Fetch feedback details immediately
          this.getFeedbackDetails(data.productData.feedbacks);
  
          this.cdr.detectChanges();
          this.getSizeOptions(this.demoProduct._id);
          this.getProductsByCategory(this.demoProduct.category);
        });
      });
    }
    formValueFeedback = this.formBuilder.group({
      content: [""],
    })

    
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
    navigateToProductDetail(productId: string) {
      // Navigate to the product details page with the specified product ID
      this.router.navigate(['/product/', productId]);
      // Scroll to the top of the page
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
        this.product = res.productData;
        console.log(this.product);  
        
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
          // Manually trigger change detection as the data has been updated
          this.cdr.detectChanges();
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
    handleSearch() {
      this.user = JSON.parse(localStorage.getItem("user") as string);
      if (!this.user) {
        this.toastr.info("Bạn cần đăng nhập để thực hiện hàng động này", "Nhắc nhở");
        return;
      }
      if (this.formValueFeedback.value.content == "") {
        this.toastr.info("Bạn cần nhập nội dung phản hồi", "Cảnh báo");
        return;
      }
    
      const newValue = {
        content: this.formValueFeedback.value.content,
        productId: this.product._id,
        userId: this.user._id
      };
    
      this.feedbackService.create(newValue).subscribe(
        (resp) => {
          // Cập nhật form và hiển thị thông báo khi phản hồi đã được xử lý thành công
          this.formValueFeedback.reset();
          this.toastr.success(resp.message, "Chúc mừng");
    
          // Sau khi tạo phản hồi, cập nhật lại chi tiết phản hồi
          this.getFeedbackDetails([...this.feedbackId, resp.feedback._id]);
    
          // Kích hoạt change detection
          this.cdr.detectChanges();
          
        },
        (error) => {
          // Xử lý lỗi nếu cần
          console.error('Error creating feedback:', error);
        }
      );
    }
    

    getFeedbackDetails(feedbackId: string[]): void {
      this.feedbackService.getFebacks(feedbackId).subscribe(
        async (feedbackDetails: any) => {
          for (const item of feedbackDetails.feeback) {
            try {
              const userDetails = await this.userService.getUser(item.userId).toPromise();
              item.userName = userDetails.use.firstname + ' ' + userDetails.use.lastname;
              this.cdr.detectChanges();
            } catch (error) {
              console.error('Error getting user details:', error);
            }
          }
          this.feedback = feedbackDetails.feeback;
        },
        (error: any) => {
          console.error('Error getting feedback details:', error);
        }
      );
    }
    getBrandDetails(brandId: string): void {
      // Fetch brand details based on brandId
      this.brandService.get(brandId).subscribe(
        (brand: any) => {
          console.log(brand);
          
          this.brand = brand.getBrand
          console.log(brand.getBrand);
        },
        (error) => {
          console.error('Error fetching brand details:', error);
        }
      );
    }
    
    
    changeMainImage(event: Event, newImage: string) {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
      this.imgList[0] = newImage;
    }

    // changeMainImage(newImage: string) {
    //   this.imgList[0] = newImage;
    // }
  }
