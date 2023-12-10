import { BrandService } from 'src/app/service/brand.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';
import { NgToastService } from 'ng-angular-popup';
import { CategoryService } from 'src/app/service/category.service';


@Component({
  selector: 'app-header-client',
  templateUrl: './header-client.component.html',
  styleUrls: ['./header-client.component.scss']
})
export class HeaderClientComponent {
  isMenuOpen: boolean = true;
  page: number = 1;
  limit: number = 10;
  currentUrl: any
  currentUrls: any
  isDarkMode: boolean = false;
  categories: any[] = []
  brand: any[] = []
  constructor(private productService: ProductService,private brandService: BrandService,private categoryService: CategoryService, private router: Router, private authService: AuthService, private toast: NgToastService) 
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

  }
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
