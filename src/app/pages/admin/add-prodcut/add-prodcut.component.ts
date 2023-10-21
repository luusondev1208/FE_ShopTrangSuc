import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-prodcut',
  templateUrl: './add-prodcut.component.html',
  styleUrls: ['./add-prodcut.component.scss'],
})
export class AddProdcutComponent {
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
    ]
  })
  constructor(private productService: ProductService, private router: Router, private formBuider: FormBuilder) {}
  onsubmit() {
    this.productService.addProducts(this.products).subscribe((response) => {
      console.log('san pham them thanh cong: ',response);
      this.router.navigate(['/admin/list'])
      alert("add thanh cong")
      // Thực hiện các hành động sau khi sản phẩm được thêm thành công
    },
    error => {
      console.log("loi khi them san pham: ", error);
      // Xử lý lỗi nếu có
    }
    );
  }
  imageList: string[] = [];

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
