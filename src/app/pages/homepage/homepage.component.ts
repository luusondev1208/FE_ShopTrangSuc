import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  topcreatedAt: any = []
  saleproduct: any = []
  topProducts: any = []
  filteredProducts: any = [];
  showForm: boolean = false
  sortedByPrice: boolean = false
  products: any = [];
  topFourItems: any = [];
  page: number = 1;
  limit: number = 100;
  constructor(private productService: ProductService, private router: Router) {}
  isHovering: boolean = false;

  loadData() {
    this.productService.getProducts(this.page, this.limit).subscribe((data: any[]) => {
      console.log(data);
      
      this.products = data;
      this.filteredProducts = this.products.productDatas.filter((product:any) => product.sold > 50);
      console.log(this.filteredProducts);

    });
  }

  toggleSortByPrice() {
    this.productService.getProducts(this.page, this.limit).subscribe((data: any[]) => {
      this.products = data;
      this.topProducts = this.products.productDatas.filter((product:any) => product.assess > 100);
      console.log(this.topProducts);

    });
  }

  filtercreatedAt() {
    this.productService.getProducts(this.page, this.limit).subscribe((data: any[]) => {
      this.products = data;
      this.topcreatedAt = this.products.productDatas
      // Sắp xếp theo createdAt giảm dần (newest first)
      this.topcreatedAt = this.topcreatedAt.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      // this.topcreatedAt = this.products.productDatas.filter((product:any) => product.createdAt >= 1698009190100);
      console.log(this.topcreatedAt);
    });
  }

  doubledPriceProducts(){
    this.productService.getProducts(this.page, this.limit).subscribe((data: any[]) => {
      this.products = data;
      this.saleproduct = this.products.productDatas;
        this.saleproduct = this.saleproduct.filter((product:any) => {

          const discountPercentage = ((product.priceroot - product.price) / product.priceroot) * 100;

          return discountPercentage > 50;


        });
        console.log(this.saleproduct);
    })
  }
  formatPrice(num: number | string) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }

  ngOnInit() {
    this.toggleSortByPrice()
    this.loadData()
    this.filtercreatedAt()
    this.doubledPriceProducts()
  }

  images = ['https://res.cloudinary.com/dmkh3w0of/image/upload/c_scale,h_500,w_1341/v1701436522/9_we7kcr.png',
  'https://res.cloudinary.com/dmkh3w0of/image/upload/c_scale,h_550,w_1500/v1701436537/5_drhdu7.png',
   'https://res.cloudinary.com/dmkh3w0of/image/upload/c_scale,h_550,w_1500/v1701436513/1_muyliz.png'];
  currentIndex = 0;

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }
  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  showHoverImage() {
    this.isHovering = true;
  }

  hideHoverImage() {
    this.isHovering = false;
  }
  hover: Boolean = false;

  selectProduct(id: Number) {
    console.log(id);

  this.router.navigate(['/product', id]).then();
  }



}
