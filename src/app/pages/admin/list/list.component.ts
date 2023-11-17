import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { Pipe, PipeTransform } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgToastService } from 'ng-angular-popup';

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
  constructor(private productService: ProductService, private router: Router,private toast: ToastrService,private toastService: NgToastService) {
    
  }
  

  // showMessage(message: string, title: string = 'Thông báo'): void {
  //   this.toast.success(message, title);
  // }
  // showSuccess() {
  //   this.toast.success('Hello world!', 'Toastr fun!');
  // }
  
  // showError(message: string, title: string = 'Lỗi'): void {
  //   this.toast.error(message, title);
  // }
  loadData() {
    this.productService.getProducts(this.page, this.limit).subscribe(
      (response: any) => {
        this.products = response.productDatas;
        console.log(this.products);

        //  console.log(this.products.docs);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  ngOnInit() {
    this.loadData();
  }
  //deleteProduct
  deleteProduct(id:any){
    var result = confirm("Bạn có muốn xóa không?");
    if (result) {
      // Người dùng đã chọn Đồng ý
      console.log("Người dùng đã chọn xóa.");
      // Gọi hàm xóa hoặc thực hiện các hành động khác tùy ý
      this.productService.deleteProduct(id).subscribe(
        response => {
         
          this.toast.success('Xóa thành công!', 'Thông báo');
  
          
          // this.showSuccess()
          this.router.navigate(['/admin/list']);
          // Thực hiện các hành động sau khi sản phẩm được xóa thành công
        },
        error => {
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
  
  showAlert(): void {
    this.toast.success('Thông báo thành công!', 'Tiêu đề');
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
    this.filteredList = this.products.filter((item:any) =>
      item.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.products = this.filteredList
    console.log(this.filteredList)
  }

 
}
