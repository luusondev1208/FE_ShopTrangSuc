import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/service/order.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-change-status-order',
  templateUrl: './change-status-order.component.html',
  styleUrls: ['./change-status-order.component.scss'],
})
export class ChangeStatusOrderComponent implements OnInit {
  user: any = {};
  orderDetails: any[] = [];

  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const userId = params['id'];

      // Gọi service để lấy thông tin người dùng
      this.userService.getUser(userId).subscribe(
        (userData) => {
          this.user = userData.use;
          console.log(this.user);
          
          // Gọi service để lấy thông tin đơn hàng của người dùng
          this.getOrderDetails(this.user.orders);
        },
        (error) => {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
      );
    });
  }

  getOrderDetails(userOrders: any[]) {
    // Gọi service để lấy thông tin đơn hàng
    this.orderService.getOrderDetails(userOrders).subscribe(
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
