import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ProductService } from '../service/product.service';
@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideshowComponent {
  currentUrl: any
  currentUrls: any
  constructor(private router: Router,  private productService: ProductService, ) {
   
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.url.split("/").slice(-2)[1]
        this.currentUrls = this.router.url.split("/").slice(-2)[1]
        console.log(this.currentUrls);
        
      }
    
    })
   
  }
}
