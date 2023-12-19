import { BlogService } from 'src/app/service/blog.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { Pipe, PipeTransform } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgToastService } from 'ng-angular-popup';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-list-blog',
  templateUrl: './list-blog.component.html',
  styleUrls: ['./list-blog.component.scss'],
})
export class ListBlogComponent {
  images: any = [];
  blogs: any = [];
  isExpanded: boolean = false;
  dateParts: any = [];
  // ...

  constructor(
    private blogService: BlogService,
    private router: Router,
    private toast: NgToastService
  ) {}
  // ngOnInit(): void {
  //   // Gọi hàm để lấy danh sách blog khi component được khởi tạo
  //   this.loadBlogs();
  // }

  // loadBlogs(): void {
  //   // Sử dụng service để lấy danh sách blog từ API
  //   this.blogService.getBlog().subscribe(
  //     (data) => {

  //       // Assuming data is an object with a 'blogs' property containing the array
  //       this.blogs = data.getBlog;
  //       // console.log(this.blogss);
  //     },
  //     (error) => {
  //       console.error('Error loading blogs', error);
  //     }
  //   );
  // }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  loadData() {
    this.blogService.getBlog().subscribe(
      (response: any) => {
        // console.log(response);

        this.blogs = response.getBlog;

        const dateParts: string[] = this.blogs.map((blogItem: any) => {
          return blogItem.createdAt.split('T')[0];
        });

        this.blogs.forEach((blogItem: any, index: number) => {
          blogItem.datePart = dateParts[index];
        });
        // console.log(this.blogs);
      },
      (error) => {
        // console.log(error);
      }
    );
  }

  ngOnInit() {
    this.loadData();
  }

  //deleteProduct
  deleteBlog(id: any) {
    this.blogService.deleteBlog(id).subscribe(
      (response) => {
        // console.log(response);

        this.blogs = this.blogs.filter(
          (getBlog: any) => getBlog._id !== response.deleteBlog._id
        );
        this.toast.success({
          detail: 'Thông báo',
          summary: `Xóa thành công sản phẩm: ${response.deleteBlog.title}`,
          duration: 5000,
          position: 'topRight',
        });
        this.router.navigate(['/admin/listBlog']);
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
