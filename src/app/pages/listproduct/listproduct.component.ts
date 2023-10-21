import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-listproduct',
  templateUrl: './listproduct.component.html',
  styleUrls: ['./listproduct.component.scss'],
})
export class ListproductComponent {
  filteredProducts: any = [];
  showForm: boolean = false;
  sortedByPrice: boolean = false;
  products: any = [];
  page: number = 1;
  limit: number = 12;
  constructor(private productService: ProductService, private router: Router) {}
  isHovering: boolean = false;
  //lấy dữ liệu
  loadData() {
    this.productService.getProducts(this.page, this.limit).subscribe(
      (response: any) => {
        this.products = response.productDatas;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
    this.loadData();
  }
// đổi ảnh sản phẩm
  showHoverImage() {
    this.isHovering = true;
  }

  hideHoverImage() {
    this.isHovering = false;
  }
  hover: Boolean = false;
// chuyển trang
  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadData();
    }
  }
// chuyển trang
  nextPage() {
    this.page++;
    this.loadData();
  }

// lọc giá từ thấp đến cao
  toggleSortByPrice() {
    this.sortedByPrice = !this.sortedByPrice;

    if (this.sortedByPrice) {
      this.products.sort((a: any, b: any) => a.price - b.price);
    } else {
      this.loadData();
    }
  }
// lọc giá từ cao đến thấp
  toggleSortByPriceS() {
    this.sortedByPrice = !this.sortedByPrice;

    if (this.sortedByPrice) {
      this.products.sort((a: any, b: any) => b.price - a.price);
    } else {
      this.loadData();
    }
  }

  // hiện thị lọc
  toggleForm() {
    this.showForm = !this.showForm;
  }

  // lọc theo số lượng sản phẩm đã bán 
  filterProductsBySold() {
    this.productService
      .getProducts(this.page, this.limit)
      .subscribe((data: any[]) => {
        this.products = data;
        this.filteredProducts = this.products.productDatas.filter(
          (product: any) => product.sold > 50
        );
        console.log(this.filteredProducts);
        this.products = this.filteredProducts;
      });
  }

  // lọc theo sóo lượng người đánh giá
  filterProductsByassess() {
    this.productService
      .getProducts(this.page, this.limit)
      .subscribe((data: any[]) => {
        this.products = data;
        this.filteredProducts = this.products.productDatas.filter(
          (product: any) => product.assess > 50
        );
        console.log(this.filteredProducts);
        this.products = this.filteredProducts;
      });
  }
}
