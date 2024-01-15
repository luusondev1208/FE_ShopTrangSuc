import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { forkJoin, map } from 'rxjs';
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
  previousStatus: string = '';
  searchTerm: string = '';
  sortmt: boolean = false
  constructor(private orderService: OrderService, private userService: UserService, private toast: NgToastService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getOrders();
  }
  sortTable(column: string): void {
    this.sortmt = !this.sortmt
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
        console.log(this.orders);
        
      });
  }

  confirmUpdateStatus(orderId: string): void {
    const isConfirmed = confirm('Bạn có chắc chắn muốn cập nhật trạng thái?');
    if (isConfirmed) {
      this.updateStatus(orderId, this.selectedNewStatus);
    }
  }
 getPriceBySize(product:any,size:any){
    const pr = product.list_size.list_size.find((item:any)=>Number(item.name)===Number(size))
    return pr.price
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

        this.toast.success({
          detail: 'Thông báo',
          summary: 'Cập nhật thành công trạng thái đơn hàng.Email thông báo sẽ được gửi cho khách hàng.',
          duration: 5000,
          position: 'topRight',

        });

      });
  }

  showloyalCustomers() {
    this.showloyalCustomer = !this.showloyalCustomer;
  }

  fileName = 'ExcelSheet.xlsx';

  exportexcel() {

    let data = document.getElementById('table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);


    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');


    XLSX.writeFile(wb, this.fileName);
  }
  exportRowToPDF(order: any): void {
    const doc = new jsPDF();
    const rows = [];

    const cellWidth = 40;
    const cellHeight = 10;
    const startY = 40;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width - 2 * margin;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('NRO SHOP SALES INVOICE', margin, margin);
    doc.setLineWidth(0.1);
    doc.line(margin, margin + 5, margin + pageWidth, margin + 5);
    let additionalInfoY = startY + rows.length * (cellHeight + 25);
    
   const title: String = "Shop NRO"
   const addressWithoutDiacritics = this.removeDiacritics(order.address);
   const titleWithoutDiacritics = this.removeDiacritics(order.products[0].product ? order.products[0].product.title : "No Name");
    console.log(addressWithoutDiacritics);
    const additionalInfo: any = {
      'Name': order.name,
      'Adrees': addressWithoutDiacritics,
      'Phone': order.mobile,
      'title': titleWithoutDiacritics,
      'Total price': order.totalPrice,
      'Note': order.note,
      'Day for sales': new Date().toLocaleDateString(),
      'quantity': order.products?.[0].quantity,
      'size': order.products?.[0].size,
      'Salesman': title,
    };
    
    for (const key in additionalInfo) {
      doc.text(key + ': ' + additionalInfo[key], margin, additionalInfoY);
      additionalInfoY += cellHeight;
    }

    doc.save('hoadonbanhang.pdf');
  }
  removeDiacritics(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  
  formatPrice(num: number | string) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }

}
