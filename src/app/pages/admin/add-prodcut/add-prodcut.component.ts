import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { NgxUploaderModule,UploaderOptions  } from 'ngx-uploader';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-add-prodcut',
  templateUrl: './add-prodcut.component.html',
  styleUrls: ['./add-prodcut.component.scss'],
})
export class AddProdcutComponent {
  public files: File[] = [];
  public images: File[] = [];
  categories: any = []
  // public uploader: FileUploader = new FileUploader({ url: 'http://localhost:5000/api/upload' });
  
  onFileSelect(event: any): void {
    const selectedFiles = event.target.files;
    
    // Lặp qua các tệp đã chọn và đưa chúng vào mảng images
    for (let i = 0; i < selectedFiles.length; i++) {
        this.images.push(selectedFiles[i]);
    }

    // Kiểm tra mảng images sau khi thêm tệp
    console.log(this.images);
}
  products: any = {};
  productForm = this.formBuider.group({
    title:[
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(255)]
    ],
    price:[
      0,
      [Validators.required, Validators.min(1)]
    ],
    description:[
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(255)]
    ],
    brand:[
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(255)]
    ],
    slug:[
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(255)]
    ],
    images:[
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(255)]
    ],
    priceroot:[
      '',
      [Validators.required,Validators.min(1), Validators.minLength(6), Validators.maxLength(255)]
    ]
    
  })
  constructor(private productService: ProductService, private categoryService: CategoryService, private router: Router, private formBuider: FormBuilder, private toastr: ToastrService) {
    this.categoryService.getCategories().subscribe(
      (response:any) => {
        this.categories = response.getAllCategory;
      },
      (error) => {
        console.log(error);
      }
    );

  }
  onsubmit() {
    this.productService.addProducts(this.products, this.files).subscribe((response) => {
      console.log('san pham them thanh cong: ',response);
      this.toastr.success(
        'Unable merge, please try again!'
      );
      this.router.navigate(['/admin/list'])
      // alert("add thanh cong")
      // Thực hiện các hành động sau khi sản phẩm được thêm thành công
    },
    error => {
      console.log("loi khi them san pham: ", error);
      // Xử lý lỗi nếu có
    }
    );
  }


  // onFileDropped(event: any) {
  //   if (event instanceof FileList) {
  //     for (let i = 0; i < event.length; i++) {
  //       const file = event.item(i);
  //       if (file) {
  //         const reader = new FileReader();
  //         reader.onload = (e) => {
  //           if (e && e.target) {
  //             this.imageList.push(e.target.result as string);
  //           } else {
  //             console.error('Lỗi: e hoặc e.target là null');
  //           }
  //         };
  //         reader.readAsDataURL(file);
  //       } else {
  //         console.error('Lỗi: File là null');
  //       }
  //     }
  //   } else {
  //     console.error('Lỗi: Sự kiện không phải là FileList');
  //   }
  // }
}
