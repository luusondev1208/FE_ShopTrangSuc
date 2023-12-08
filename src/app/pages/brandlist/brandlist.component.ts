import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BrandService } from 'src/app/service/brand.service';

@Component({
  selector: 'app-brandlist',
  templateUrl: './brandlist.component.html',
  styleUrls: ['./brandlist.component.scss']
})
export class BrandlistComponent {
  productsByBrand: any[] = [];
  brandId: any

  constructor(private route: ActivatedRoute,private brandService: BrandService) {}

  ngOnInit(): void {
    // Sử dụng paramMap để lấy giá trị của tham số 'id'
    this.brandId = this.route.snapshot.paramMap.get('id');
    console.log(this.brandId);

    this.getProductsByCategory(this.brandId);
  }

  getProductsByCategory(brandId: string): void {
    if (!brandId) {
      console.error('Invalid brandId');
      return;
    }

    this.brandService.getProductsByBrandId(brandId).subscribe(
      (response) => {
        // Kiểm tra xem response có chứa dữ liệu không trước khi gán cho productsByCategory
        if (response && response.products) {
          this.productsByBrand = response.products;
          console.log(this.productsByBrand);
        } else {
          console.error('Empty response or missing products data');
        }
      },
      (error) => {
        console.error('Error getting products by category', error);
        // Xử lý lỗi - có thể hiển thị thông báo cho người dùng
      }
    );
  }

  // format giá tiền
formatPrice(num: number | string) {
  return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
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
}
