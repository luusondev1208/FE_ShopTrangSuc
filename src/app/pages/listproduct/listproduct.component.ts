import { Component } from '@angular/core';

@Component({
  selector: 'app-listproduct',
  templateUrl: './listproduct.component.html',
  styleUrls: ['./listproduct.component.scss']
})
export class ListproductComponent {
  isHovering: boolean = false;

  showHoverImage() {
    this.isHovering = true;
  }

  hideHoverImage() {
    this.isHovering = false;
  }
  hover: Boolean = false;
}
