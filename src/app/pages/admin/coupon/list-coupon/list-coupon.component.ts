import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgToastService } from 'ng-angular-popup';
import * as XLSX from 'xlsx';
import { CouponService } from 'src/app/service/coupon.service';
@Component({
  selector: 'app-list-coupon',
  templateUrl: './list-coupon.component.html',
  styleUrls: ['./list-coupon.component.scss']
})
export class ListCouponComponent {
  coupons: any = [];
  isExpanded: boolean = false;
  dateParts: any = [];
  // ...

  constructor(
    private couponService: CouponService,
    private router: Router,
    private toast: NgToastService
  ) {}
  

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  loadData() {
    this.couponService.getAll().subscribe(
      (response: any) => {
        // console.log(response);

        this.coupons = response.data;

        const dateParts: string[] = this.coupons.map((couponItem: any) => {
          return couponItem.createdAt.split('T')[0];
        });

        this.coupons.forEach((couponItem: any, index: number) => {
          couponItem.datePart = dateParts[index];
        });
        // console.log(this.coupons);
      },
      (error) => {
        // console.log(error);
      }
    );
  }

  ngOnInit() {
    this.loadData();
  }

  formatPrice(num: number | string) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }

  //deleteProduct
  deleteCoupon(id: any) {
    this.couponService.deleteCoupon(id).subscribe(
      (response) => {
        // console.log(response);

        this.coupons = this.coupons.filter(
          (data: any) => data._id !== response.deleteCoupon._id
        );
        this.toast.success({
          detail: 'Thông báo',
          summary: `Xóa thành công sản phẩm: ${response.deleteCoupon.title}`,
          duration: 5000,
          position: 'topRight',
        });
        this.router.navigate(['/admin/listCoupon']);
        // Thực hiện các hành động sau khi sản phẩm được xóa thành công
      },
      (error) => {
        this.toast.error({
          detail: 'Thông báo',
          summary: 'Lỗi khi xóa sản phẩm!',
          duration: 5000,
          position: 'topRight',
        });
        console.error('Lỗi khi xóa sản phẩm:', error);

        // Xử lý lỗi nếu có
      }
    );
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
}
