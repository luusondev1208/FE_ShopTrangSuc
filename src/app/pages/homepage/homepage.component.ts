import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  topUpdatedAt: any = []
  saleproduct: any = []
  topProducts: any = []
  filteredProducts: any = [];
  showForm: boolean = false
  sortedByPrice: boolean = false
  products: any = [];
  topFourItems: any = [];
  page: number = 1;
  limit: number = 100;
  constructor(private productService: ProductService, private router: Router, private renderer: Renderer2, private el: ElementRef) { }
  isHovering: boolean = false;

  loadData() {
    this.productService.getProducts(this.page, this.limit).subscribe((data: any[]) => {
      // console.log(data);

      this.products = data;
      console.log("data", data);
      this.filteredProducts = this.products.productDatas.filter((product: any) => product.sold > 50);


    });
  }

  //sản phẩm bán chạy
  toggleSortByPrice() {
    this.productService.getProducts(this.page, this.limit).subscribe((data: any[]) => {
      this.products = data;
      this.topProducts = this.products.productDatas.filter((product: any) => product.assess > 50);
    });
  }

  //sản phẩm mới nhất
  filtercreatedAt() {
    this.productService.getProducts(this.page, this.limit).subscribe((data: any[]) => {
      this.products = data;
      console.log(data);

      this.topUpdatedAt = this.products.productDatas
      this.topUpdatedAt = this.topUpdatedAt.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      // console.log(this.topcreatedAt);
    });
  }

  //sản phẩm sale sock
  doubledPriceProducts() {
    this.productService.getProducts(this.page, this.limit).subscribe((data: any[]) => {
      this.products = data;
      this.saleproduct = this.products.productDatas;
      this.saleproduct = this.saleproduct.filter((product: any) => {

        const discountPercentage = ((product.priceroot - product.price) / product.priceroot) * 100;

        return discountPercentage > 50;


      });
      // console.log(this.saleproduct);
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
    // console.log(id);

    this.router.navigate(['/product', id]).then();
  }

  scrollToSection(sectionId: string) {
    const element = this.el.nativeElement.querySelector(`#${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }


}
