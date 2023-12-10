import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { OrderService } from 'src/app/service/order.service';
import { UserService } from 'src/app/service/user.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-list-oder',
  templateUrl: './list-oder.component.html',
  styleUrls: ['./list-oder.component.scss']
})
export class ListOderComponent {
  row:any
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
        const dateParts: string[] = this.orders.map((orderItem: any) => {
          return orderItem.createdAt.split('T')[0];
        });

        this.orders.forEach((orderItem: any, index: number) => {
          orderItem.datePart = dateParts[index];
        });
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

  
  /**Default name for excel file when download**/
  fileName = 'ExcelSheet.xlsx';

  exportexcel() {
    /**passing table id**/
    let data = document.getElementById('table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    /**Generate workbook and add the worksheet**/
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /*save to file*/
    XLSX.writeFile(wb, this.fileName);
  }
  exportRowToPDF(order:any): void {
    const doc = new jsPDF();
    const columns = ['ID', 'Name', 'Address', 'SDT'];
    const rows = [];
  
    // Thêm dữ liệu từ hàng được chọn vào mảng rows
    rows.push([ order._id, order.name, order.address, order.phone]);
  
    // Tính kích thước của bảng và ô
    const cellWidth = 40;
    const cellHeight = 10;
    const startY = 20; // Vị trí bắt đầu vẽ bảng
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width - 2 * margin;
  
    // Vẽ tiêu đề cột
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('HÓA ĐƠN BÁN HÀNG SHOP NRO', margin, margin);
    doc.setLineWidth(0.1);
    doc.line(margin, margin + 5, margin + pageWidth, margin + 5);
  
    // Vẽ từng ô trong bảng
    for (let i = 0; i < columns.length; i++) {
      doc.text(columns[i], margin + i * cellWidth, startY + cellHeight);
    }
  
    // Vẽ dữ liệu từ hàng được chọn
    for (let i = 0; i < rows.length; i++) {
      const rowData = rows[i];
      for (let j = 0; j < rowData.length; j++) {
        doc.text(String(rowData[j]), margin + j * cellWidth, startY + (i + 2) * cellHeight);
      }
    }
  
    // Tính vị trí của các thông tin khác
    let additionalInfoY = startY + rows.length * (cellHeight + 25);
  
    // Khởi tạo biến additionalInfo
  const additionalInfo:any = {
    'Tổng tiền': order.totalPrice,
    'Ngày bán hàng': new Date().toLocaleDateString(),
    'Người bán hàng': 'Shop Trang Sức NRO',
  };
    // Vẽ các thông tin khác
    for (const key in additionalInfo) {
      doc.text(key + ': ' + additionalInfo[key], margin, additionalInfoY);
      additionalInfoY += cellHeight;
    }
  
    // Xuất file PDF
    doc.save('hoadonbanhang.pdf');
  }
}
