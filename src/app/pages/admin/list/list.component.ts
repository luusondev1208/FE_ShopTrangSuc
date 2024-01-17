import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { Pipe, PipeTransform } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgToastService } from 'ng-angular-popup';
import * as XLSX from 'xlsx';
import { SizeService } from 'src/app/service/size.service';
import { combineLatest, forkJoin, EMPTY } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent {
  images: any = []
  products: any = []
  page: number = 1;
  limit: number = 10;
  size: any = []
  constructor(private productService: ProductService,private sizeService: SizeService, private router: Router, private toast: NgToastService) {

  }
  loadData() {
    this.productService.getAdminProducts(this.page, this.limit).subscribe(
      (response: any) => {
        this.products = response.productDatas;

        // Assuming list_size is available in every product
        const sizeObservables = this.products.map((product: any) => this.loadSizeData(product.list_size, product));

        // Wait for all size observables to complete
        combineLatest(sizeObservables).subscribe(() => {
          // All size data is loaded, you can perform further processing if needed
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  loadSizeData(sizeId: string, product: any) {
    return this.sizeService.getSize(sizeId).pipe(
      // Assuming the size data will be available in sizeData
      tap((sizeData: any) => {
        console.log(sizeData.getSize.nameSize);
        // Assign size information to a property in each product
        product.sizeName = sizeData.getSize.nameSize;
        // Further processing of sizeData if needed
      }),
      catchError((error) => {
        console.error(`Error fetching size data for ${sizeId}:`, error);
        return EMPTY; // or return an observable with a default value
      })
    );
  }
  ngOnInit() {
    this.loadData();
  }
  //deleteProduct
  deleteProduct(id: any) {
    var result = confirm("Bạn có muốn xóa không?");
    if (result) {
      // Người dùng đã chọn Đồng ý
      // console.log("Người dùng đã chọn xóa.");
      // Gọi hàm xóa hoặc thực hiện các hành động khác tùy ý
      this.productService.deleteProduct(id).subscribe(
        response => {
          // console.log(response);

          this.products = this.products.filter((product: any) => product._id !== response.deletedProduct._id)
          this.toast.success({ detail: "Thông báo", summary: `Xóa thành công sản phẩm: ${response.deletedProduct.title}`, duration: 5000, position: "topRight" });
          this.router.navigate(['/admin/list']);
          // Thực hiện các hành động sau khi sản phẩm được xóa thành công
        },
        error => {
          this.toast.error({ detail: "Thông báo", summary: 'Lỗi khi xóa sản phẩm!', duration: 5000, position: "topRight" });
          console.error('Lỗi khi xóa sản phẩm:', error);

          // Xử lý lỗi nếu có
        }
      )
    } else {
      // Người dùng đã chọn Hủy
      alert("Người dùng đã chọn không xóa.");
      // Thực hiện các hành động khác tùy ý
    }
  }
  formatPrice(num: number | string) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
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

  searchResults: any[] = [];
  searchTerm: string = '';
  filteredList: any[] = [];

  search() {
    this.productService.search({ search: this.searchTerm }).pipe(
      switchMap((response) => {
        if (response.data && response.data.length > 0) {
          this.products = response.data;

          // Assuming list_size is available in every product
          const sizeObservables = this.products.map((product: any) => this.loadSizeData(product.list_size, product));

          // Wait for all size observables to complete
          return combineLatest(sizeObservables);
        } else {
          this.toast.error({ detail: 'Thông báo', summary: 'Không tìm thấy sản phẩm!', duration: 5000, position: 'topRight' });
          return EMPTY;
        }
      })
    ).subscribe(() => {
      // All size data is loaded, you can perform further processing if needed
    }, (error) => {
      console.error(error);
    });
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
