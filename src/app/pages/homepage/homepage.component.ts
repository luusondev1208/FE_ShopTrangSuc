import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  filteredProducts: any = [];
  showForm: boolean = false
  sortedByPrice: boolean = false
  products: any = [];
  page: number = 1;
  limit: number = 4;
  constructor(private productService: ProductService, private router: Router) {}
  isHovering: boolean = false;

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
  }

  ngOnInit() {
    this.productService.getProducts(this.page, this.limit).subscribe((data: any[]) => {
      this.products = data;
      this.filteredProducts = this.products.productDatas.filter((product:any) => product.price > 100);
    });
  }
  

  showHoverImage() {
    this.isHovering = true;
  }

  hideHoverImage() {
    this.isHovering = false;
  }
  hover: Boolean = false;

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadData();
    }
  }

  nextPage() {
    this.page++;
    this.loadData();
  }

  toggleSortByPrice() {
    this.sortedByPrice = !this.sortedByPrice;

    if (this.sortedByPrice) {
      this.products.sort((a:any, b:any) => a.price - b.price);
    } else {
      this.loadData();
    }
  }

  toggleSortByPriceS() {
    this.sortedByPrice = !this.sortedByPrice;

    if (this.sortedByPrice) {
      this.products.sort((a:any, b:any) => b.price - a.price);
    } else {
      this.loadData();
    }
  }
   
  // Trong component
toggleForm() {
  this.showForm = !this.showForm;
}
filterProductsBySold(){
  this.productService.getProducts(this.page, this.limit).subscribe((data: any[]) => {
    this.products = data;
    // console.log(this.products);
    
    this.filteredProducts = this.products.productDatas.filter((product:any) => product.sold > 50);
    console.log(this.filteredProducts);
    // this.products = this.filteredProducts
    
  });
}

// filterProductsByassess(){
//   this.productService.getProducts(this.page, this.limit).subscribe((data: any[]) => {
//     this.products = data;
//     // console.log(this.products);
    
//     this.filteredProducts = this.products.productDatas.filter((product:any) => product.assess > 50);
//     console.log(this.filteredProducts);
//     this.products = this.filteredProducts
    
//   });
// }
}
