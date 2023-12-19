import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { BrandService } from 'src/app/service/brand.service';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent {
  brand: any = {};
  title: any
  brandfrom = this.formBuider.group({
    title:[
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(255)]
    ]
  })
  constructor(private brandService: BrandService, private router: Router, private formBuider: FormBuilder,  private toast:NgToastService,) {}
  onsubmit() {
    this.brandService.createBrand(this.brand).subscribe((response) => {
     this.title = response;
      
      this.toast.success({ detail: "Thông báo", summary: `Thêm Thành Công Thương Hiệu: ${this.title}`, duration: 5000, position: "topRight" });
      this.router.navigate(['/admin/listBrand'])
     
      // Thực hiện các hành động sau khi sản phẩm được thêm thành công
    },
    error => {
      console.log("Lỗi khi thêm thương hiệu: ", error);
      // Xử lý lỗi nếu có
    }
    );
  }
}
