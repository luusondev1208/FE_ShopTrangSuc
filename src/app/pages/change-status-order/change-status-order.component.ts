import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-change-status-order',
  templateUrl: './change-status-order.component.html',
  styleUrls: ['./change-status-order.component.scss'],
})
export class ChangeStatusOrderComponent implements OnInit {
  user: any = {};
  userOrder: any[] = [];
  orderDetails: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.getUserDataFromLocalStorage();
    this.getOrderDetails();
  }

  getUserDataFromLocalStorage() {
    const localStorageData = localStorage.getItem('user');

    if (localStorageData) {
      this.user = JSON.parse(localStorageData);
      console.log('User Orders:', this.user);
      this.userOrder = this.user.orders;
      console.log(this.userOrder);
    }
  }

  getOrderDetails() {
    this.orderService.getOrderDetails(this.userOrder).subscribe(
      (response) => {
        console.log('Dữ liệu đơn hàng:', response.orders);
        this.orderDetails = response.orders;
        this.logOrderDetails(); // Gọi hàm log để hiển thị dữ liệu trong console
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
      }
    );
  }

  // Hàm log để hiển thị thông tin trong console
  logOrderDetails() {
    for (const order of this.orderDetails) {
      console.log('Địa chỉ:', order.address);
      console.log('Số lượng sản phẩm:', order.products.length);
      console.log('Tổng giá tiền:', order.totalPrice);
      console.log('Tổng giá tiền:', order.products?.product);
      // Thêm các trường khác tùy ý
      for (const product of order.products) {
        // Kiểm tra xem có trường `product` và có trường `title` không
        if (product.product && product.product.title) {
          console.log('Tiêu đề sản phẩm:', product.product.title);
          // Thêm các trường khác tùy ý
        } else {
          console.log('Không có thông tin sản phẩm hoặc tiêu đề.');
        }
      }
    }
  }
}
