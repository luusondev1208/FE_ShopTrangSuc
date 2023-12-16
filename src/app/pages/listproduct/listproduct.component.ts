import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandService } from 'src/app/service/brand.service';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';


@Component({
  selector: 'app-listproduct',
  templateUrl: './listproduct.component.html',
  styleUrls: ['./listproduct.component.scss'],
})
export class ListproductComponent {
  products: any[] = [];
  sort: string = "";  
  page = 1;
  limit = 10;
  category: string = ""; 
  brand: string = ""; 
  categorories: any[] = []
  brands: any[] = []
  @ViewChild('searchInput') searchInput!: ElementRef;

  productList: any = null
  constructor(private productService: ProductService, private categoryService: CategoryService,private formBuilder: FormBuilder, private brandService: BrandService) {
    this.categoryService.getCategories().subscribe((data) => {
   
      this.categorories = data.getAllCategory
      console.log(this.categorories);
      
    })
    this.brandService.getBrands().subscribe((data: any) => {
   
      this.brands = data.getAllBrand
      console.log(this.brands);
    })
   }
   formValueSearch = this.formBuilder.group({
    search: [""],
  })
  formatPrice(num: number | string) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }
   ngOnInit(): void {
    // Gọi hàm getFilteredProducts() một lần để hiển thị tất cả sản phẩm ban đầu
    this.getFilteredProducts();
  }
  resetFilters() {

    // Gọi lại hàm getProducts để lấy tất cả sản phẩm
    this.productService.getProducts(this.page, this.limit).subscribe(
      (data) => {
        // Gán dữ liệu sản phẩm vào biến products
        this.products = data.productDatas;
      },
      (error) => {
        console.error('Error fetching all products:', error);
      }
    );
  }
  getFilteredProducts(): void {
    // Kiểm tra xem có điều kiện lọc hay không
    if (this.sort || this.category || this.brand) {
      this.productService.getFilteredProducts(this.sort, this.limit, this.category, this.brand)
        .subscribe(
          (data: any) => {
            this.products = data.productDatas;
          },
          (error: any) => {
            console.error('Error fetching filtered products:', error);
          }
        );
    } else {
      // Nếu không có điều kiện lọc, hiển thị tất cả sản phẩm
      this.productService.getProducts(this.page,this.limit)
        .subscribe(
          (data: any) => {
            console.log(data) ;
            
            this.products = data.productDatas;
          },
          (error: any) => {
            console.error('Error fetching all products:', error);
          }
        );
    }
  }

  filterProducts(): void {
    // Gọi hàm getFilteredProducts() khi người dùng thực hiện lọc
    this.getFilteredProducts();
  }
  handleSearch() {
    this.productService.search(this.formValueSearch.value).subscribe((resp) => {
      this.productList = resp.data
    })
  }
  handleModalSearch () {
    this.productList = null
    
  }
  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    if (!this.searchInput.nativeElement.contains(event.target)) {
      this.handleModalSearch();
    }
  }
}
