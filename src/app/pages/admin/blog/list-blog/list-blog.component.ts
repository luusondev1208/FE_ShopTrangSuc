import { BlogService } from 'src/app/service/blog.service';
import { Component,OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { Pipe, PipeTransform } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-list-blog',
  templateUrl: './list-blog.component.html',
  styleUrls: ['./list-blog.component.scss']
})
export class ListBlogComponent {
  images: any = []
  blogs: any = []
 
  constructor(private blogService: BlogService, private router: Router,private toast: NgToastService) {
    
  }
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
  
  
  loadData() {
    this.blogService.getBlog().subscribe(
      (response: any) => {
        console.log(response);
        
        this.blogs = response.getBlog;
        console.log(this.blogs);

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
  deleteBlog(id:any){
    
      this.blogService.deleteBlog(id).subscribe(
        response => {
          console.log(response);
          
          this.blogs = this.blogs.filter((getBlog:any) => getBlog._id !== response.deleteBlog._id)
          this.toast.success({ detail: "Thông báo", summary: `Xóa thành công sản phẩm: ${response.deleteBlog.title}`, duration: 5000, position: "topRight" });
          this.router.navigate(['/admin/listBlog']);
          // Thực hiện các hành động sau khi sản phẩm được xóa thành công
        },
        error => {
          this.toast.error({ detail: "Thông báo", summary: 'Lỗi khi xóa sản phẩm!', duration: 5000, position: "topRight" });
          console.error('Lỗi khi xóa sản phẩm:', error);

          // Xử lý lỗi nếu có
        }
      )
   
  }
  
   
  


}
