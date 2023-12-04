import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { OrderService } from 'src/app/service/order.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-list-oder',
  templateUrl: './list-oder.component.html',
  styleUrls: ['./list-oder.component.scss']
})
export class ListOderComponent {
  previousStatus: string = "";
  showText: boolean = false
  showloyalCustomer: boolean = false
  users: any = []
  firstname: any
  keyWord:string = '';
  lastname: any
  ordersSearch:any = []
  orders: any = [];
  loyalCustomers: any = []
  order: any = [];
  newStatus: string = ''
  quantity: any = [];
  datePart:any;
  size: any;
  page: number = 1;
  limit: number = 10;
  title: any
  constructor(
    private orderService: OrderService,
    private router: Router, 
    private toast:NgToastService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute
    ) {
      this.route.paramMap.subscribe((param) => {
        const users = JSON.parse(localStorage.getItem("user") as string);
        const id = users._id    
      });
  }
  loadData(){
    this.orderService.getAllOrders().subscribe(
      (response:any) => {
        console.log(response);
        
        this.orders = response.response;
        console.log(this.orders);
        
        this.ordersSearch = response.response;
          
        
        const updatedOrdersObservables = this.orders.map((item: any) => {
          console.log(item);
          // console.log(item.user);
          
          
          
          console.log(this.title);
          
          const createdAtDate = new Date(item.createdAt);
          //   // console.log(item.createdAt);
            this.datePart = item.createdAt.split("T")[0];
            
          return this.userService.getUser(item.user);
        });
        // console.log(updatedOrdersObservables);
        
    
        forkJoin(updatedOrdersObservables).subscribe((responses: any) => {
          console.log(responses);
          
          responses.forEach((response:any, index:any) => {
            // console.log(response.use.orders.length);
            console.log(response);
            
            
            
            this.orders[index].name = response.use.firstname +" "+ response.use.lastname;
            this.orders[index].phone = response.use.mobile;
            this.orders[index].address = response.use.address;
            this.orders[index].email = response.use.email;
            console.log(response.use.address);
            
            this.orders[index].ord = response.use.orders?.length;
            this.ordersSearch[index].name = response.use.firstname +" "+ response.use.lastname;
            this.ordersSearch[index].phone = response.use.mobile;
            
          });
          this.loyalCustomers = this.orders.filter((orders:any) => orders.ord >= 5);
          console.log(this.loyalCustomers);
          // console.log(this.orders); // Orders đã được cập nhật với trường name
        });
        
        this.quantity = response.response
        // console.log(this.quantity);
         console.log(this.orders); 
        
      },
      (error) => {
        console.log(error);
      }
    );
    
  }
  
  showTranLuong() {
    this.showText = !this.showText;
  }
  
  

changeStatus(order: any, newStatus:string) {
 console.log(newStatus);
 
  switch (order.status) {
    case "Chờ thanh toán":
      this.previousStatus = order.status;
      order.status = "Đã xác nhận";
      break;
    case "Đã xác nhận":
      if (this.previousStatus === "Chờ thanh toán" || this.previousStatus === "Đang xử lý") {
        order.status = this.previousStatus;
      }
      break;
    case "Đang xử lý":
      this.previousStatus = order.status;
      order.status = "Đã xác nhận";
      break;
    default:
      
      break;
  }
  console.log(order.status);
  
  
  this.orderService.updateOrderStatus(order._id, String(order.status)).subscribe(
    response => {
      console.log('Trạng thái đã được cập nhật thành công!', response);
      this.order.status = newStatus; // Cập nhật trạng thái trong giao diện sau khi thành công
    },
    error => {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      // Xử lý lỗi nếu có
    }
  );
}



  
  search(){
  const filtered =  this.ordersSearch.filter((item:any) => {
    return (
      item.name.toLowerCase().includes(this.keyWord.toLowerCase()) ||
      (item.phone && item.phone.includes(this.keyWord)) //
    )
  })
  this.orders = filtered
}
  ngOnInit() {
    this.loadData();
  }

  showloyalCustomers(){
    this.showloyalCustomer = !this.showloyalCustomer;
  }

  

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadData();
    }
  }

  nextPage() {
    this.page++;
    this.loadData();
  }
}
