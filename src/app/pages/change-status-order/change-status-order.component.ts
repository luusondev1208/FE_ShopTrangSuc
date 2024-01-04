import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  showConfirm: boolean = false;

  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastrService
  ) { }
  scrollY = 0;
  canChangeStatus(order: any): boolean {
    return order.status !== 'Đã giao hàng' && order.status !== 'Đã hủy' && order.status !== 'Đã nhận hàng';
  }

  canChangeStatusXacNhanHang(order: any): boolean {
    return (order.status === 'Đã giao hàng') && order.status !== 'Đã hủy';
  }



  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    this.scrollY = window.scrollY;
  }
  showConfirmDialog(item: any) {
    this.updateOrderStatus(item._id, 'Đã hủy');
    item.showConfirm = true;
  }

  cancelConfirmDialog(item: any) {
    item.showConfirm = false;
  }
  updateXacNhan(item: any) {
    this.updateXacNhanHang(item._id, 'Đã nhận hàng');
    item.showConfirm = true;
  }

  cancelConfirm(item: any) {
    item.showConfirm = false;
  }
  formatPrice(num: number | string) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const userId = params['id'];

      // Gọi service để lấy thông tin người dùng
      this.userService.getUser(userId).subscribe(
        (userData) => {
          this.user = userData.use;
          // console.log(this.user);

          // Gọi service để lấy thông tin đơn hàng của người dùng
          this.getOrderDetails(this.user.orders);
          setInterval(() => {
            this.updateOrdersAfter10Seconds(this.user.orders);
          }, 24 * 60 * 60 * 1000);
        },
        (error) => {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
      );
    });

  }

  getPriceBySize(product: any, size: any) {
    const pr = product.list_size.list_size.find((item: any) => Number(item.name) === Number(size))
    return pr.price
  }

  getOrderDetails(userOrders: any[]) {
    // Gọi service để lấy thông tin đơn hàng
    this.orderService.getOrderDetails(userOrders).subscribe(
      (response) => {
        // console.log('Dữ liệu đơn hàng:', response);

        // Check if the response is an array
        if (Array.isArray(response.orders)) {
          this.orderDetails = response.orders;
          response.orders.forEach((order: any) => {
            // console.log(order);

            const orderCreationTime = new Date(order.createdAt).getTime();
            const currentTime = new Date().getTime();
            const timeDifference = currentTime - orderCreationTime;

            // Kiểm tra nếu đã qua 5 ngày, trạng thái không phải 'Đã hủy', 'Đã nhận hàng' và không phải 'Đã giao hàng'
            if (
              timeDifference >= 5 * 24 * 60 * 60 * 1000 &&
              order.status !== 'Đã hủy' &&
              order.status !== 'Đã nhận hàng' &&
              order.status !== 'Đã giao hàng'
            ) {
              this.updateOrderStatus(order._id, 'Đã nhận hàng');
            }
          });
        } else {
          console.error('Lỗi: Dữ liệu đơn hàng không hợp lệ.');
        }
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
      }
    );

  }

  updateOrdersAfter10Seconds(userOrders: any[]) {
    this.getOrderDetails(userOrders);
  }

  updateOrderStatus(orderId: string, newStatus: string) {
    this.orderService.updateOrderStatusSendEmail(orderId, newStatus).subscribe(
      (response) => {
        // console.log('Hủy đơn hàng thành công:', response);
        // Gọi lại hàm lấy thông tin đơn hàng để cập nhật dữ liệu mới
        this.getOrderDetails(this.user.orders);
        // Hiển thị thông báo toast
        this.toastService.show('Đã hủy đơn hàng thành công');
      },
      (error) => {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        // Hiển thị thông báo toast lỗi
        this.toastService.show('Lỗi khi cập nhật trạng thái đơn hàng');
      }
    );
  }
  updateXacNhanHang(orderId: string, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe(
      (response) => {
        // console.log('Xác nhận hàng thành công:', response);
        // Gọi lại hàm lấy thông tin đơn hàng để cập nhật dữ liệu mới
        this.getOrderDetails(this.user.orders);
        // Hiển thị thông báo toast
        this.toastService.show('Đã nhận hàng thành công');
      },
      (error) => {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        // Hiển thị thông báo toast lỗi
        this.toastService.show('Lỗi khi cập nhật trạng thái đơn hàng');
      }
    );
  }
}
