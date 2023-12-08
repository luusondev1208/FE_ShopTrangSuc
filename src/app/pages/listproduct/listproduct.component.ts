import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-listproduct',
  templateUrl: './listproduct.component.html',
  styleUrls: ['./listproduct.component.scss'],
})
export class ListproductComponent {
  submitted: boolean = false
  productsByCategory: any[] = []
  categoryId: string = '656ae52bf2cd2ead26b7ca79';
  lactay: string = '656ae318f2cd2ead26b7ca21'
  khuyen:string = '656ae018f2cd2ead26b7c934'
  categories: any = []
  title: any
  filteredProducts: any = [];
  showForm: boolean = false;
  showForms: boolean = false;
  showFormss: boolean = false;
  sortedByPrice: boolean = false;
  products: any = [];
  page: number = 1;
  limit: number = 12;
  type:string = ""
filterOptions = {
  filterProduct: 'option1',
  filterCategory: 'option1',
  filterBrand: 'option1'
};

  constructor(private productService: ProductService, private router: Router, private categoryService: CategoryService) {
    this.categoryService.getCategories().subscribe(
      (response:any) => {
        
        
        this.categories = response.getAllCategory;
        console.log(this.categories);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  isHovering: boolean = false;
  //lấy dữ liệu
  loadData() {
    this.productService.getProducts(this.page, this.limit).subscribe(
      (response: any) => {
        console.log(response);
        
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
  


//Lọc dựa vào lựa chọn theo option
filterProducts() {
  if(this.filterOptions.filterProduct === "option2"){
    this.toggleSortByPrice()
  } else if(this.filterOptions.filterProduct === "option3"){
    this.toggleSortByPriceS()
  } else if(this.filterOptions.filterProduct === "option4"){
    this.filterProductsByassess()
  } else if(this.filterOptions.filterProduct === "option5"){
    this.filterProductsBySold()
  } else if(this.filterOptions.filterBrand === "option2"){
    this.filterProductsByBrandPNJ()
  } else if(this.filterOptions.filterBrand === "option3"){
    this.filterProductsByBrandNRO()
  }  else if(this.filterOptions.filterBrand === "option4"){
    this.filterProductsByBrandTTL()
  } else if(this.filterOptions.filterCategory === "option2"){
    this.filterProductsByCategori(this.categoryId)
  } else if(this.filterOptions.filterCategory === "option3"){
    this.filterProductsBylactay(this.lactay)
  } else if(this.filterOptions.filterCategory === "option4"){
    this.filterProductsBykhuyen(this.khuyen)
  } 
}


// format giá tiền
formatPrice(num: number | string) {
  return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

// hover sản phẩm
  showHoverImage() {
    this.isHovering = true;
  }

//ẩn hover
  hideHoverImage() {
    this.isHovering = false;
  }
  hover: Boolean = false;

// chuyển trang -
  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadData();
    }
  }

// chuyển trang +
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
      
    }
  }

// lọc giá từ cao đến thấp
  toggleSortByPriceS() {
    this.sortedByPrice = !this.sortedByPrice;

    if (this.sortedByPrice) {

      this.products.sort((a: any, b: any) => b.price - a.price);
    } else {
      
    }
  }

  // hiện thị lọc
  toggleForm() {
    this.showForm = !this.showForm;
  }
  toggleForms() {
    this.showForms = !this.showForms;
  }
  toggleFormss() {
    this.showFormss = !this.showFormss;
  }

  // lọc theo số lượng sản phẩm đã bán
  filterProductsBySold() {
    this.sortedByPrice = !this.sortedByPrice;
    if(this.sortedByPrice){
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
    } else {
      
    }

  }

  // lọc theo số lượng người đánh giá
  filterProductsByassess() {
    this.sortedByPrice = !this.sortedByPrice;
    if(this.sortedByPrice){
      this.productService
      .getProducts(this.page, this.limit)
      .subscribe((data: any[]) => {
        this.products = data;
        // console.log(this.products);

        this.filteredProducts = this.products.productDatas.filter(
          (product: any) => product.assess > 50
        );
        console.log(this.filteredProducts);
        this.products = this.filteredProducts;
      });
    } else {
      
    }

  }

//tìm kiếm
  searchResults: any[] = [];
  searchTerm: string = '';
  filteredList: any[] = [];

  search() {
    this.filteredList = this.products.filter((item:any) =>
      item.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.products = this.filteredList
    console.log(this.products)
  }

  

//loc theo loại nhẫn
filterProductsByCategori(categoryId: string): void {
  this.submitted = true
  if (!categoryId) {
    console.error('Invalid categoryId');
    return;
  }

  this.categoryService.getProductsByCategoryId(categoryId).subscribe(
    (response) => {
      if (response && response.products) {
        this.productsByCategory = response.products;
        console.log(this.productsByCategory);
      } else {
        console.error('Empty response or missing products data');
      }
    },
    (error) => {
      console.error('Error getting products by category', error);
    }
  );
}

//loc theo lăc tay
filterProductsBylactay(lactay: string): void {
  this.submitted = true
  if (!lactay) {
    console.error('Invalid categoryId');
    return;
  }

  this.categoryService.getProductsByCategoryId(lactay).subscribe(
    (response) => {
      if (response && response.products) {
        this.productsByCategory = response.products;
        console.log(this.productsByCategory);
      } else {
        console.error('Empty response or missing products data');
      }
    },
    (error) => {
      console.error('Error getting products by category', error);
    }
  );
}

//loc theo khuyên tai
filterProductsBykhuyen(khuyen: string): void {
  this.submitted = true
  if (!khuyen) {
    console.error('Invalid categoryId');
    return;
  }

  this.categoryService.getProductsByCategoryId(khuyen).subscribe(
    (response) => {
      if (response && response.products) {
        this.productsByCategory = response.products;
        console.log(this.productsByCategory);
      } else {
        console.error('Empty response or missing products data');
      }
    },
    (error) => {
      console.error('Error getting products by category', error);
    }
  );
}

// lọc theo brand  PNJ
filterProductsByBrandPNJ() {
  this.sortedByPrice = !this.sortedByPrice;
  if(this.sortedByPrice){
    this.productService
    .getProducts(this.page, this.limit)
    .subscribe((data: any[]) => {
      this.products = data;
      this.filteredProducts = this.products.productDatas.filter(
        (product: any) => product.brand == 'PNJ'
      );
      console.log(this.filteredProducts);
      this.products = this.filteredProducts;
    });
  } else {
    
  }

}
  // lọc theo brand  NRO
  filterProductsByBrandNRO() {
    this.sortedByPrice = !this.sortedByPrice;
    if(this.sortedByPrice){
      this.productService
      .getProducts(this.page, this.limit)
      .subscribe((data: any[]) => {
        this.products = data;
        this.filteredProducts = this.products.productDatas.filter(
          (product: any) => product.brand == 'NRO'
        );
        console.log(this.filteredProducts);
        this.products = this.filteredProducts;
      });
    } else {
      this.loadData()
    }

  }

  // lọc theo brand TTl
  filterProductsByBrandTTL() {
    this.sortedByPrice = !this.sortedByPrice;
    if(this.sortedByPrice){
      this.productService
      .getProducts(this.page, this.limit)
      .subscribe((data: any[]) => {
        this.products = data;
        this.filteredProducts = this.products.productDatas.filter(
          (product: any) => product.brand == 'TTL'
        );
        console.log(this.filteredProducts);
        this.products = this.filteredProducts;
      });
    } else {
      this.loadData()
    }

  }
  selectProduct(id: Number) {
    console.log(id);

  this.router.navigate(['/product', id]).then();
  }
  images = ['https://cdn.pnj.io/images/promo/184/CT_LOVE_WEDDING_1972x640CTA.jpg',
  'https://cdn.pnj.io/images/promo/182/TABSALE_CHUNG_THANG_09-1972x640CTA.jpg',
   'https://cdn.pnj.io/images/promo/180/pnjfast-1972x640CTA.jpg'];
  currentIndex = 0;

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }
  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
