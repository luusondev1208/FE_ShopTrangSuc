import { Component } from '@angular/core';

@Component({
  selector: 'app-blogpage',
  templateUrl: './blogpage.component.html',
  styleUrls: ['./blogpage.component.scss']
})
export class BlogpageComponent {
  items: string[] = [
  'Top 5 trang sức không đính đá PNJ mới nhất tháng 9/2023',
  'TRUNG TÂM KIM HOÀN HUỲNH THÚC KHÁNG, GIA NGHĨA TƯNG BỪNG KHAI TRƯƠNG KHÔNG GIAN MỚI',
  'TRUNG TÂM KIM HOÀN HUỲNH THÚC KHÁNG, GIA NGHĨA TƯNG BỪNG KHAI TRƯƠNG KHÔNG GIAN MỚI']; // Các mục trong slideshow
  activeIndex: number = 0; // Chỉ số của mục hiện tại

  constructor() {
    setInterval(() => {
      this.nextSlide();
    }, 1000); // Chuyển đổi mục sau mỗi 5 giây
  }

  nextSlide(): void {
    this.activeIndex = (this.activeIndex + 1) % this.items.length;
  }
}
