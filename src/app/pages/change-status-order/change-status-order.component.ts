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
     
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
      }
    );
  }

}
