import { BrandService } from 'src/app/service/brand.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';
import { NgToastService } from 'ng-angular-popup';
import { CategoryService } from 'src/app/service/category.service';
import { CartService } from 'src/app/service/cart.service';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
interface User {
  cart?: any; // hoặc kiểu dữ liệu chính xác của cart nếu có
  // Các thuộc tính khác của user
  
}

@Component({
  selector: 'app-header-client',
  templateUrl: './header-client.component.html',
  styleUrls: ['./header-client.component.scss']
})
export class HeaderClientComponent {
  private updateIntervalInSeconds = 1; // Update every 1 second
  private destroy$ = new Subject<void>();
  isMenuOpen: boolean = true;
  page: number = 1;
  limit: number = 10;
  currentUrl: any
  currentUrls: any
  isDarkMode: boolean = false;
  categories: any[] = []
  brand: any[] = []
  idcart: any = {}
  productCount: number = 0;
  userData: User = {};
  constructor(private productService: ProductService, private cartService: CartService,private brandService: BrandService,private categoryService: CategoryService, private router: Router, private authService: AuthService, private toast: NgToastService) 
  {
    
    
  }
  loadData() {
    this.productService.getProducts(this.page, this.limit).subscribe(
      (response: any) => {
        this.products = response.productDatas;
        // console.log(this.products);

        //  console.log(this.products.docs);
      },
      (error) => {
        console.log(error);
      }
    );
    this.categoryService.getCategories().subscribe( (response: any) =>{
      console.log(response.getAllCategory);
      this.categories= response.getAllCategory
    })
    this.brandService.getBrands().subscribe( (response: any) =>{
      console.log(response.getAllBrand);
      this.brand= response.getAllBrand
    })
  }
  ngOnInit() {
    this.loadData();
    this.ButtonAdmin();
    this.userData = JSON.parse(localStorage.getItem('user') || '{}');
    this.idcart = this.userData.cart
    console.log(this.idcart);
    // this.refreshCartData();

    // // Set up an interval to refresh the cart data every second until the component is destroyed
    // interval(this.updateIntervalInSeconds * 1000)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(() => {
    //     this.refreshCartData();
    //   });
  }
  ngOnDestroy() {
    // Emit a value to notify the interval to complete when the component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }

  // refreshCartData() {
  //   this.cartService.getCart(this.idcart).subscribe(
  //     (data: any) => {
  //       if (data && data.cart && data.cart.products) {
  //         this.productCount = data.cart.products.length;
  //       } else {
  //         console.error('Dữ liệu không đúng định dạng:', data);
  //       }
  //     },
  //     (error) => {
  //       console.error('Lỗi khi gọi API:', error);
  //     }
  //   );
  // }
  products: any = []
  searchResults: any[] = [];
  searchTerm: string = '';
  filteredList: any[] = [];


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  search() {
    this.filteredList = this.products.filter((item: any) =>
      item.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.products = this.filteredList
    // console.log(this.products)
  }

  CheckLogin(): boolean {
    if (this.authService.checklogin()) {
      this.router.navigate(['/infor-account']);
      return true;

    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  signOut() {
    var result = confirm("Bạn có muốn đăng xuất không?")
    if (result) {
      this.authService.logout();
      this.toast.success({ detail: "Thông báo", summary: 'Đăng Xuất thành công!', duration: 5000, position: "topRight" });
      this.router.navigate(['/login']);
    }
    else if (!localStorage.getItem("user")) {
      alert("người dùng chưa đăng nhập")
    }
    else {
      alert("Người dùng không đăng xuất ");

    }


  }
  
  userRole!: string;

  ButtonAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userRole = user != null && user.role != null ? user.role : '';
  }
}
