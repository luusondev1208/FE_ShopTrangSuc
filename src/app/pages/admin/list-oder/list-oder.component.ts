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
  showText: boolean = false
  users: any = []
  firstname: any
  keyWord:string = '';
  lastname: any
  ordersSearch:any = []
  orders: any = [];
  quantity: any = [];
  datePart:any;
  size: any;
  page: number = 1;
  limit: number = 10;
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
        this.ordersSearch = response.response;
        
        const updatedOrdersObservables = this.orders.map((item: any) => {
          const createdAtDate = new Date(item.createdAt);
          //   // console.log(item.createdAt);
            this.datePart = item.createdAt.split("T")[0];
          return this.userService.getUser(item.user);
        });
        // console.log(updatedOrdersObservables);
        
    
        forkJoin(updatedOrdersObservables).subscribe((responses: any) => {
          // console.log(responses);
          
          responses.forEach((response:any, index:any) => {
            console.log(response);
            
            this.orders[index].name = response.use.firstname +" "+ response.use.lastname;
            this.orders[index].phone = response.use.mobile;
            this.orders[index].email = response.use.email;
            this.orders[index].ord = response.use.orders;
            this.ordersSearch[index].name = response.use.firstname +" "+ response.use.lastname;
            this.ordersSearch[index].phone = response.use.mobile;
          });
          // console.log(this.orders); // Orders đã được cập nhật với trường name
        });
        
        this.quantity = response.response
        console.log(this.quantity);
        
      },
      (error) => {
        console.log(error);
      }
    );
    
  }
  
  showTranLuong() {
    this.showText = !this.showText;
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
