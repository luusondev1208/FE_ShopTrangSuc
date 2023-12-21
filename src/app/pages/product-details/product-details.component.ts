import { BrandService } from 'src/app/service/brand.service';
import { UserService } from 'src/app/service/user.service';
import { FeedbackService } from './../../service/feedback.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/shared/model/product';
import { ProductService } from 'src/app/service/product.service';
import { CartService } from 'src/app/service/cart.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { sizeOptions } from 'src/app/shared/model/size';
import { AuthService } from 'src/app/service/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { CategoryService } from 'src/app/service/category.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';
import { SizeService } from 'src/app/service/size.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';

interface SizeResponse {
  getAllSize: {
    list_size: any[];
  };
}
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnInit {
  
  private cart: any[] = JSON.parse(localStorage.getItem('cart') || '[]');
  editMode = false;
  panelOpenState = false;
  product: any = {};
  imgList: any;
  user: any = null;
  feedbackId: string[] = [];
  feedback: any = {};
  feedbackList: any[] = [];
  demoProduct: any = {};
  brandId: any;
  brand: any = {};
  showOptions: boolean = false;
  sizeOption: any[] = Object.values(sizeOptions).filter(
    (value) => typeof value === 'number'
  );
  selectedSize: number | null = null;
  productsByCategory: any[] = []; // Thêm mảng để lưu trữ sản phẩm của category
  sizes: any;
  demoPrice: number = 0;
  demoSize: number = 0;
  demoQuantity: number = 0;
  showModal: boolean = false; 
  constructor(
    config: NgbRatingConfig,
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
    private userService: UserService,
    private modalService: NgbModal,
    private sizeService: SizeService
  ) {
    config.max = 5;
    activatedRoute.params.subscribe((params) => {
      this.loadProductData(params['id']);
      this.getRoute(params['id']);
      productService.getProduct(params['id']).subscribe((data) => {
        this.imgList = data.productData.images;
        this.getFeedbackDetails(data.productData.feedbacks);
        this.getBrandDetails(data.productData.brand);
        this.cdr.detectChanges();
        this.getSizeOptions(this.demoProduct._id);
        this.getProductsByCategory(this.demoProduct.category);
      });
    });
  }
  loadProductData(productId: string): void {
    this.productService.getProduct(productId).subscribe((data) => {
      this.product = data.productData;
      // console.log(this.product.list_size.list_size);
      this.demoProduct = data.productData;
      this.imgList = data.productData.images;
      this.getProductsByCategory(this.demoProduct.category);
    });
  }
  addproductfrivate(id: any) {
    this.userService.addPRoductFaveries(id).subscribe(
      (response) => {
        // Handle success
        // console.log('Product added to favorites:', response);
        this.toast.success({
          detail: 'Đã thêm sản phẩm vào danh mục yêu thích.',
          summary: 'Thành công',
          duration: 5000,
          position: 'topRight',
        });
      },
      (error) => {
        // Handle error
        console.error('Error adding product to favorites:', error);
        this.toast.error({
          detail: 'Đã xảy ra lỗi khi thêm sản phẩm vào danh mục yêu thích.',
          summary: 'Lỗi',
          duration: 5000,
          position: 'topRight',
        });
      }
    );
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') as string);
    this.activatedRoute.params.subscribe((params) => {
      this.loadProductData(params['id']);
      this.getRoute(params['id']);
      this.productService.getProduct(params['id']).subscribe((data) => {
        this.imgList = data.productData.images;

        this.getFeedbackDetails(data.productData.feedbacks);

        this.cdr.detectChanges();
        this.getSizeOptions(this.demoProduct._id);
        this.getProductsByCategory(this.demoProduct.category);
      });
    });
  }
  formValueFeedback = this.formBuilder.group({
    content: [''],
  });

  currentIndex = 0;

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.imgList.length;
  }
  // format giá tiền
  formatPrice(num: number | string) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }
  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.imgList.length) % this.imgList.length;
  }
  navigateToProductDetail(productId: string) {
    // Navigate to the product details page with the specified product ID
    this.router.navigate(['/product/', productId]);
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  isProductInCart(productId: string, size: number): boolean {
    return this.cart.some((item) => item.product === productId && item.size === size);
  }
  addToCart() {
    
    const local = localStorage.getItem('user');
    const user: any = local && JSON.parse(local);
    // const selectedSize = (document.querySelector('#sizeSelect') as HTMLSelectElement).value;
    // console.log(selectedSize);
    // demoPrice

    const productId = this.demoProduct._id;

    const size = this.demoSize;
    console.log(size);
    
    const quantity = 1;
    if (this.demoQuantity === 0) {
      return this.toast.error({
        detail: 'Đã hết hàng. Vui lòng thử lại sau',
        summary: 'Lỗi',
        duration: 5000,
        position: 'topRight',
      });
    }

    if (this.authService.checklogin()) {
      this.cartService.addToCart(productId, size, quantity, user?._id).subscribe(
        (response) => {
          // Kiểm tra giỏ hàng có giá trị không null trước khi cập nhật localStorage
          if (response.cart) {
            user.cart = response.cart; // Giả sử response.cart chứa ID của giỏ hàng
            localStorage.setItem('user', JSON.stringify(user));
          } 
          console.log(response);
          
          this.toast.success({
            detail: 'Sản phẩm đã được thêm vào giỏ hàng.',
            summary: 'Thành công',
            duration: 5000,
            position: 'topRight',
          });
        },
          (error) => {
            console.error('Add to cart failed', error);
            this.toast.error({
              detail:
                'Size sản phẩm này đã có trong giỏ hàng, nếu muốn tăng số lượng hàng hãy vào giỏ hàng.',
              summary: 'Lỗi',
              duration: 5000,
              position: 'topRight',
            });
          }
        );
    } else {
      this.router.navigate(['/login']);
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
      // console.log(this.product);
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
        // console.log(this.productsByCategory);
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
      this.toast.error({
        detail: 'Thông báo',
        summary: 'Vui lòng đăng nhập để tiếp tục!',
        duration: 5000,
        position: 'topRight',
      });
      this.router.navigate(['/login']);
      return false;
    }
  }
  handleSearch() {
    this.user = JSON.parse(localStorage.getItem('user') as string);
    if (!this.user) {
      this.toastr.info(
        'Bạn cần đăng nhập để thực hiện hàng động này',
        'Nhắc nhở'
      );
      return;
    }
    if (this.formValueFeedback.value.content == '') {
      this.toastr.info('Bạn cần nhập nội dung phản hồi', 'Cảnh báo');
      return;
    }
    if (!this.user.orders || this.user.orders.length === 0) {
      this.toast.error({
        detail: 'Bạn cần mua hàng trước. Vui lòng thử lại sau.',
        summary: 'Lỗi',
        duration: 5000, // Display duration in milliseconds
        position: 'topRight',
      });

      return;
    }
    const newValue = {
      content: this.formValueFeedback.value.content,
      productId: this.product._id,
      userId: this.user._id,
    };

    this.feedbackService.create(newValue).subscribe((resp) => {
      // Cập nhật form và hiển thị thông báo khi phản hồi đã được xử lý thành công
      this.formValueFeedback.reset();
      this.toastr.success(resp.message, 'Chúc mừng');
      // console.log(resp);

      if (!Array.isArray(this.feedback)) {
        this.feedback = [];
      }

      this.userService.getUser(resp.data.userId).subscribe(
        (userResp) => {
          const newFeedback = {
            _id: resp.data._id,
            userId: resp.data.userId,
            userName: userResp.use.firstname + ' ' + userResp.use.lastname,
            productId: resp.data.productId,
            content: resp.data.content,
            createdAt: resp.data.createdAt,
          };

          this.feedback.push(newFeedback);

          this.feedback = [...this.feedback];

          this.cdr.detectChanges();
          console.log(this.feedback);
          
          const element = document.getElementById('scroll-to-comment');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        },
        (userError) => {
          console.error('Error getting user information:', userError);
        }
      );
    });
  }
  deleteComment(id: any): void {
    const localUser = localStorage.getItem('user');
    const localUserId = localUser ? JSON.parse(localUser)._id : null;
    const feedbackItem = this.feedback.find((item: any) => item._id === id);
    if (feedbackItem && feedbackItem.userId === localUserId) {
      const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?');
      if (isConfirmed) {
        this.confirmDelete(feedbackItem._id);
        this.feedback = this.feedback.filter((item: any) => item._id !== feedbackItem._id);
      } else {
        console.log('Xóa bình luận đã bị hủy bởi người dùng.');
      }
    } else {
      this.toast.error({
        detail: "Thông báo",
        summary: `Bạn không có quyền xóa bình luận của người khác`,
        duration: 5000,
        position: "topRight",
      });
    }
  }
  
  
  confirmDelete(id: any): void {
    this.feedbackService.deleteFeback(id).subscribe(
      (response) => {
        console.log(this.feedback);
        
        this.feedback = this.feedback.filter(
          (feedback: any) => feedback._id !== response.data._id
        );
        this.toast.success({
          detail: "Thông báo",
          summary: `Xóa thành công bình luận: ${response.data.content}`,
          duration: 5000,
          position: "topRight",
        });
      },
      (error) => {
        this.toast.error({
          detail: "Thông báo",
          summary: 'Lỗi khi xóa bình luận!',
          duration: 5000,
          position: "topRight",
        });
        console.error('Lỗi khi xóa bình luận:', error);
      }
    );
  }
  closeModal(): void {
    this.showModal = false;
  }

  toggleOptions(item: any): void {
    item.showOptions = !item.showOptions;
  }
  editComment(item: any): void {
    const localUser = localStorage.getItem('user');
    const localUserId = localUser ? JSON.parse(localUser)._id : null;
  
    if (item.userId === localUserId) {
      item.editMode = true;
    } else {
      console.log('Bạn không có quyền sửa bình luận này.');
      this.toast.error({
        detail: "Thông báo",
        summary: `Bạn không có quyền sửa bình luận của người khác`,
        duration: 5000,
        position: "topRight",
      });
    }
  }
  
  UpdateComment(item: any): void {
    const localUser = localStorage.getItem('user');
    const localUserId = localUser ? JSON.parse(localUser)._id : null;
  
    const feedbackItem = this.feedback.find((feedback: any) => feedback._id === item._id);
  
    if (feedbackItem && feedbackItem.userId === localUserId) {
      item.editMode = true;
    } else {
      console.log('Bạn không có quyền sửa bình luận này.');
      this.toast.error({
        detail: 'Thông báo',
        summary: 'Bạn không có quyền sửa bình luận của người khác',
        duration: 5000,
        position: 'topRight',
      });
    }
  }
  
  saveCommentEdit(item: any): void {
    // Gọi API để cập nhật bình luận
    this.feedbackService.updateFeeback({ id: item._id, content: item.content }).subscribe(
      (response) => {
   
        this.toast.success({
          detail: 'Thông báo',
          summary: 'Sửa thành công bình luận',
          duration: 5000,
          position: 'topRight',
        });
        this.cancelEdit(response.data)
        console.log(response);
        
      },
      (error) => {
        this.toast.error({
          detail: 'Thông báo',
          summary: 'Lỗi khi sửa bình luận',
          duration: 5000,
          position: 'topRight',
        });
      }
    );
  }
  
  cancelEdit(item: any): void {
    item.editMode = false;
  }
  
  getFeedbackDetails(feedbackId: string[]): void {
    this.feedbackService.getFebacks(feedbackId).subscribe(
      async (feedbackDetails: any) => {
        for (const item of feedbackDetails.feeback) {
          try {
            const userDetails = await this.userService
              .getUser(item.userId)
              .toPromise();
            item.userName =
              userDetails.use.firstname + ' ' + userDetails.use.lastname;
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
      (respons: any) => {
        // console.log(brand);

        this.brand = respons.getBrand;
        // console.log(this.brand);
      },
      (error) => {
        console.error('Error fetching brand details:', error);
      }
    );
  }
  updatePriceAndQuantity() {
    const optionSelect = document.getElementById(
      'optionSelect'
    ) as HTMLSelectElement;
    const nameSizeSelect = optionSelect?.value;

    if (nameSizeSelect === '') {
      this.demoQuantity = 0;
    } else {
      const SizeFInd = this.product.list_size.list_size.find(
        (item: any) => item.name === nameSizeSelect
      );

      this.demoPrice = SizeFInd.price;
      this.demoSize = SizeFInd.name;
      this.demoQuantity = SizeFInd.quantity;
    }

    this.cdr.detectChanges();
  }

  getProductPrice(selectedSize: number | null): any {
    if (selectedSize === null) {
      return 0;
    }

    this.sizeService
      .getSizes()
      .pipe(
        switchMap((item: any) => {
          this.sizes = item.getAllSize;
          const size = this.sizes.find(
            (sizeItem: any) => sizeItem.name === selectedSize
          );
          // console.log(size);
          return size ? size.price : 0;
        })
      )
      .subscribe((price) => {
        // console.log(price);
      });
  }
  getProductQuantity(selectedSize: number | null): any {
    if (selectedSize === null) {
      return 0;
    }

    this.sizeService
      .getSizes()
      .pipe(
        switchMap((item: any) => {
          this.sizes = item.getAllSize;
          const size = this.sizes.find(
            (sizeItem: any) => sizeItem.name === selectedSize
          );
          // console.log(size);
          return size ? size.quantity : 0;
        })
      )
      .subscribe((quantity) => {
        // console.log(quantity);
      });
  }

  changeMainImage(event: Event, newImage: string) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
    this.imgList[0] = newImage;
  }

  sizeVong: boolean = false;
  openShowSize(modal: any) {
    this.modalService.open(modal, {
      centered: true,
      size: 'md',
      backdrop: 'static',
    });
  }
  closeInferClusterModal() {
    this.modalService.dismissAll();
  }

  showSizevong() {
    this.sizeVong = !this.sizeVong;
  }
  //do size nhan
  selectedRingSize: string = '0';
  onRatingChange(newRating: number): void {
    console.log('New Rating:', newRating);
  
    // Cập nhật đánh giá sản phẩm
    this.productService.updateAssess(this.product._id, newRating).subscribe(
      (response) => {
        // Nếu cập nhật thành công, cập nhật lại giá trị assess
        this.product.assess = response.updatedProduct.assess;
        // Thực hiện các bước khác nếu cần
      },
      (error) => {
        console.error('Error updating product assess:', error);
        // Log the error details for debugging
        if (error.error instanceof ErrorEvent) {
          console.error('Client-side error:', error.error.message);
        } else {
          console.error('Server-side error:', error.status, error.error);
        }
        // Handle the error based on your application's requirements
      }
    );
  }
  
  
  determineRingSize(value: string): string {
    switch (value) {
      case '4.6':
      case '4.7':
        return '6';
      case '4.8':
      case '4.9':
        return '7';
      case '5':
      case '5.1':
        return '8';
      case '5.2':
      case '5.3':
        return '9';
      case '5.4':
      case '5.5':
        return '10';
      case '5.6':
      case '5.7':
        return '11';
      case '14':
      case '15':
        return '6';
      case '16':
      case '17':
        return '7';
      case '18':
      case '19':
        return '8';
      case '20':
      case '21':
        return '9';
      case '22':
      case '23':
        return '10';
      case '24':
      case '25':
        return '11';
      default:
        return '';
    }
  }
}
