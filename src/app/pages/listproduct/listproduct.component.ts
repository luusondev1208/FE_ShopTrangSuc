import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  categorories: any[] = [];
  brands: any[] = [];
  @ViewChild('searchInput') searchInput!: ElementRef;

  productList: any = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private brandService: BrandService
  ) {
    this.categoryService.getCategories().subscribe((data) => {
      this.categorories = data.getAllCategory;
    });

    this.brandService.getBrands().subscribe((data: any) => {
      this.brands = data.getAllBrand;
    });
  }

  formValueSearch = this.formBuilder.group({
    search: [''],
  });

  formatPrice(num: number | string) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }

  ngOnInit(): void {
    // Gọi hàm getFilteredProducts() một lần để hiển thị tất cả sản phẩm ban đầu
    this.resetFilters();
  }

  resetFilters(): void {
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
  nextPage(){
    this.page++
    this.resetFilters()
  }
  backPage(){
    this.page--
    this.resetFilters()
  }

  getFilteredProducts(): void {
    const params = new HttpParams()
      .set('sort', this.sort)
      .set('limit', this.limit.toString())
      .set('category', this.category)
      .set('brand', this.brand);
  
    const url = `http://localhost:5000/api/product?${params.toString()}`;
  
    this.productService.getFilteredProducts(url).subscribe(
      (data: any) => {
        this.products = data.productDatas;
      },
      (error: any) => {
        console.error('Error fetching filtered products:', error);
      }
    );
  }

 // ...

filterProducts(): void {
  // Kiểm tra nếu sort, category, hoặc brand không tồn tại hoặc rỗng, không thêm chúng vào URL truy vấn
  const queryParams: any = {};

  if (this.sort && this.sort !== "") {
    queryParams.sort = this.sort;
  }

  if (this.limit) {
    queryParams.limit = this.limit;
  }

  if (this.category && this.category !== "") {
    queryParams.category = this.category;
  }

  if (this.brand && this.brand !== "") {
    queryParams.brand = this.brand;
  }

  // Sử dụng queryParams để xây dựng URL truy vấn
  const query = Object.keys(queryParams)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
    .join('&');

  const url = `http://localhost:5000/api/product?${query}`;

  console.log('URL:', url); // In ra URL để kiểm tra giá trị của các biến

  // Gọi API với URL đã xây dựng
  this.productService.getFilteredProducts(url)
    .subscribe(
      (data: any) => {
        this.products = data.productDatas;
      },
      (error: any) => {
        console.error('Error fetching filtered products:', error);
      }
    );
}

// ...

  handleSearch() {
    this.productService.search(this.formValueSearch.value).subscribe((resp) => {
      this.productList = resp.data;
    });
  }

  handleModalSearch() {
    this.productList = null;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    if (!this.searchInput.nativeElement.contains(event.target)) {
      this.handleModalSearch();
    }
  }
}
