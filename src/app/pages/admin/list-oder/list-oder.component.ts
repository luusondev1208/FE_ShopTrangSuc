import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { forkJoin, map } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { OrderService } from 'src/app/service/order.service';
import { UserService } from 'src/app/service/user.service';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
// Bạn cần import font vào mã nguồn của bạn (ví dụ sử dụng DejaVuSans)
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-list-oder',
  templateUrl: './list-oder.component.html',
  styleUrls: ['./list-oder.component.scss'],
})
export class ListOderComponent {
  orders: any[] = [];
  selectedStatus: string = '';
  selectedNewStatus: string = '';
  sortOrder: string = 'asc';
  sortColumn: string = 'createdAt';
  sortPriceOrder: string = 'asc';
  sortBy: string = '';
  showloyalCustomer: boolean = false;
  title: any;
  user: any;
  previousStatus: string = '';
  searchTerm: string = '';
  sortmt: boolean = false;
  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private toast: NgToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getOrders();
  }

  sortTable(column: string): void {
    this.sortmt = !this.sortmt;
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
    this.orderService.getAllOrders().subscribe((data) => {
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
  getPriceBySize(product: any, size: any) {
    const pr = product.list_size.list_size.find(
      (item: any) => Number(item.name) === Number(size)
    );
    return pr.price;
  }

  filterOrders() {
    if (this.selectedStatus) {
      this.orderService
        .getOrdersByStatus(this.selectedStatus)
        .subscribe((data) => {
          this.orders = data.orders;
        });
    } else {
      this.getOrders();
    }
  }
  searchResults: any[] = [];
 
  filteredList: any[] = [];
  search() {
    this.orderService.search({ search: this.searchTerm })
      .subscribe(response => {
        if (response.data && response.data.length > 0) {
          this.orders = response.data;
        } else {
       
          this.toast.error({ detail: "Thông báo", summary: 'Không tìm thấy người mua!', duration: 5000, position: "topRight" });
        }
      }, error => {

        console.error(error);
      });
  }

  updateStatus(orderId: string, newStatus: string): void {
    this.orderService
      .updateOrderStatusSendEmail(orderId, newStatus)
      .subscribe((data: any) => {
        // console.log(data);
        this.getOrders();

        this.toast.success({
          detail: 'Thông báo',
          summary:
            'Cập nhật thành công trạng thái đơn hàng.Email thông báo sẽ được gửi cho khách hàng.',
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
  exportRowToPDF(order: any) {
    const doc = new jsPDF();
    doc.addFont('DejaVuSans', 'DejaVuSans', 'normal');
    doc.setFont('DejaVuSans', 'normal');
    const margin = 5;
    const cellWidth = 40;
    const cellHeight = 10;

    // Add header
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('NRO SHOP SALES INVOICE', 5, 10);

    // Add line under the header
    doc.setLineWidth(0.1);
    doc.line(
      margin,
      margin + 7,
      doc.internal.pageSize.width - margin,
      margin + 7
    );

    // Add additional info
    const additionalInfo: Record<string, any> = {
      Name: order.name,
      Address: this.removeDiacritics(order.address),
      Phone: order.mobile,
      Note: order.note,
      'Day for Sales': new Date().toLocaleDateString(),
      Salesman: 'Shop NRO',
    };

    let additionalInfoY = margin + 15;

    for (const key in additionalInfo) {
      doc.text(key + ': ' + additionalInfo[key], margin, additionalInfoY);
      additionalInfoY += 7;
    }

    // Add table header
    const columns = ['Product', 'Quantity', 'Size', 'Price', 'Total'];
    let currentX = margin;
    columns.forEach((column) => {
      doc.setFillColor(200, 220, 255); // Background color for header
      doc.rect(currentX, additionalInfoY, cellWidth, cellHeight, 'F');
      doc.setTextColor(0);
      doc.text(
        column,
        currentX + cellWidth / 2,
        additionalInfoY + cellHeight / 2,
        { align: 'center' }
      );
      currentX += cellWidth;
    });

    additionalInfoY += cellHeight;

    // Add table data
    order.products.forEach((product: any) => {
      let currentX = margin;
      const rowData = [
        this.removeDiacritics(
          product.product ? product.product.title : 'No Name'
        ),
        product.quantity,
        product.size,
        product.product ? product.product.price : 0,
        product.quantity * (product.product ? product.product.price : 0),
      ];

      rowData.forEach((data) => {
        doc.rect(currentX, additionalInfoY, cellWidth, cellHeight);
        // Đặt kích thước font chữ một cách tường minh
        const fontSize = 3; // Đặt kích thước font chữ theo mong muốn của bạn

        // Ước lượng chiều cao của dòng dựa trên font size
        const estimatedLineHeight = 1 * fontSize; // Có thể điều chỉnh hệ số 1.5 theo nhu cầu

        // Sử dụng estimatedLineHeight để tính toán vị trí văn bản trong một ô
        const textX = currentX + cellWidth / 2;
        const textY =
          additionalInfoY + cellHeight / 2 + estimatedLineHeight / 2;

        // Vẽ văn bản
        doc.text(data.toString(), textX, textY, { align: 'center' });

        currentX += cellWidth;
      });

      additionalInfoY += cellHeight;
    });

    doc.save('hoadonbanhang.pdf');
  }

  removeDiacritics(str: any) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  formatPrice(num: number | string) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }
}
