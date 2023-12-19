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
  orders: any[] = [];
  selectedStatus: string = '';
  selectedNewStatus: string = '';
  sortOrder: string = 'asc';
  sortColumn: string = 'createdAt';
  sortPriceOrder: string = 'asc';
  sortBy: string = '';
  showloyalCustomer: boolean = false
  title: any
  user: any
  searchTerm: string = '';
  constructor(private orderService: OrderService,private userService: UserService, private toast: NgToastService, private route: ActivatedRoute) {
  
  }

  ngOnInit() {
    this.getOrders();
  }
  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
      this.sortColumn = column;
    }

    this.orders = this.sortArray([...this.orders]);
  }
  sortTableByPrice(): void {
    this.sortPriceOrder = this.sortPriceOrder === 'asc' ? 'desc' : 'asc';
    this.orders = this.sortArrayByPrice([...this.orders]);
  }


  sortArrayByPrice(array: any[]): any[] {
    return array.sort((a, b) => {
      const order = this.sortPriceOrder === 'asc' ? 1 : -1;

      if (a.totalPrice > b.totalPrice) {
        return 1 * order;
      } else if (a.totalPrice < b.totalPrice) {
        return -1 * order;
      } else {
        return 0;
      }
    });
  }

  sortArray(array: any[]): any[] {
    return array.sort((a, b) => {
      const order = this.sortOrder === 'asc' ? 1 : -1;

      if (a[this.sortColumn] > b[this.sortColumn]) {
        return 1 * order;
      } else if (a[this.sortColumn] < b[this.sortColumn]) {
        return -1 * order;
      } else {
        return 0;
      }
    });
  }
  getOrders() {
    this.orderService.getAllOrders()
      .subscribe(data => {
        // console.log(data);
        this.orders = data.response;
        // console.log(this.orders);
      });
  }

  confirmUpdateStatus(orderId: string): void {
    const isConfirmed = confirm('Bạn có chắc chắn muốn cập nhật trạng thái?');
    if (isConfirmed) {
      this.updateStatus(orderId, this.selectedNewStatus);
    }
  }

  filterOrders() {
    if (this.selectedStatus) {
      this.orderService.getOrdersByStatus(this.selectedStatus)
        .subscribe(data => {
          this.orders = data.orders;
        });
    } else {
      
      this.getOrders();
    }
  }


  updateStatus(orderId: string, newStatus: string): void {
    this.orderService.updateOrderStatusSendEmail(orderId, newStatus)
      .subscribe((data: any) => {
        // console.log(data);
        this.getOrders();
        // this.title = data.response.status;
        this.toast.success({
          detail: 'Thông báo',
          summary: 'Cập nhật thành công trạng thái đơn hàng.Email thông báo sẽ được gửi cho khách hàng.',
          duration: 5000,
          position: 'topRight',
          // escape: false, // Cho phép sử dụng HTML trong summary
      });
      
      });
  }
  
  showloyalCustomers(){
    this.showloyalCustomer = !this.showloyalCustomer;
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
  formatPrice(num: number | string) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }
}
