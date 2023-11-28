import { Component, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isDarkMode: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

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
}
