import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ProductService } from 'src/app/service/product.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-listproductfaveries',
  templateUrl: './listproductfaveries.component.html',
  styleUrls: ['./listproductfaveries.component.scss']
})
export class ListproductfaveriesComponent {
  userId: any
  products: any[] = []
  images = ['https://res.cloudinary.com/dmkh3w0of/image/upload/c_scale,h_500,w_1341/v1701436522/9_we7kcr.png',
  'https://res.cloudinary.com/dmkh3w0of/image/upload/c_scale,h_550,w_1500/v1701436537/5_drhdu7.png',
   'https://res.cloudinary.com/dmkh3w0of/image/upload/c_scale,h_550,w_1500/v1701436513/1_muyliz.png'];
  currentIndex = 0;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private toast: NgToastService,
  ){
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      // Chuyển đổi dữ liệu từ chuỗi JSON sang đối tượng JavaScript (nếu cần)
      var userData = JSON.parse(userDataString);
      this.userId = userData._id
      // Sử dụng dữ liệu đã lấy được
      console.log(this.userId);
  } else {
      console.log('Không có dữ liệu trong localStorage');
  }
    this.userService.getFaverie(this.userId).subscribe((data) =>{
      console.log(data);
      this.products = data
    })
  }
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }
  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
  formatPrice(num: number | string) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }
  removeProductFaveries(id: any){
    this.userService.deleteProFaveries(id)
      .subscribe(
        (response) => {
          // Handle success
          console.log(response);
          
          this.products = this.products.filter((pro:any) => pro._id !== response.productIdToRemove)
          this.toast.success({
            detail: 'Đã xóa sản phẩm vào danh mục yêu thích.',
            summary: 'Thành công',
            duration: 5000,
            position: 'topRight',
          });
        },
        (error) => {
          // Handle error
          console.error('Error adding product to favorites:', error);
          this.toast.error({
            detail: 'Đã xảy ra lỗi khi xóa sản phẩm vào danh mục yêu thích.',
            summary: 'Lỗi',
            duration: 5000,
            position: 'topRight',
          });
        }
      );
  }
}
