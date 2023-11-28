import { Component,Renderer2 ,ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss']
})
export class HeaderAdminComponent {
  currentUrl: any
  currentUrls: any
  isDarkMode: boolean = false;
  constructor(private router: Router, private renderer: Renderer2, private el: ElementRef) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.url.split("/").slice(-2)[0].toUpperCase();
        this.currentUrls = this.router.url.split("/").slice(-2)[1]
        console.log(this.currentUrl);
        
      }
    
    });
    
    
  }
  


}
