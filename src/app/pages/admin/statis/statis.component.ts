import { Component, OnInit, Renderer2, ElementRef, NgZone, ChangeDetectorRef  } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import { StatisService } from 'src/app/service/statis.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-statis',
  templateUrl: './statis.component.html',
  styleUrls: ['./statis.component.scss']
})
export class StatisComponent implements OnInit {
   statistics: any = {};
   bestSellingProductDetails: any;
  isDarkMode: boolean = false;
  constructor(
    private statisticService: StatisService,
    private productService: ProductService,
    private renderer: Renderer2, 
    private el: ElementRef,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
    
  ) {}

  ngOnInit(): void {
    this.getStatistics();
  }
  getStatistics(): void {    
    this.statisticService.getStatistics().subscribe(
      data => {
        
          this.statistics = data.statistic;
          console.log(this.statistics);
       ;
       
        if (this.statistics.bestSellingProduct) {
          this.productService.getProduct(this.statistics.bestSellingProduct).subscribe(
            productDetails => {
              this.bestSellingProductDetails = productDetails.productData;
              console.log(this.bestSellingProductDetails); 
            },
            error => {
              console.error('Error fetching best selling product details:', error);
            }
          );
        }
      },
      error => {
        console.error('Error fetching statistics:', error);
      }
    );
  }
  toggleTheme(event: any): void {
    this.isDarkMode = !this.isDarkMode;
    const slider = this.el.nativeElement.querySelector('.slider');
    const isChecked = event.target.checked;

    if (isChecked) {
      this.renderer.addClass(slider, 'dark-theme'); 
    } else {
      this.renderer.removeClass(slider, 'dark-theme'); 
    }
  }
  formatPrice(price: number): string {
    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    return formattedPrice;
  }
}
