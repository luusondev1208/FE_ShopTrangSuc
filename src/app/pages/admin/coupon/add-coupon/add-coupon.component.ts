import { CouponService } from './../../../../service/coupon.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { NgxUploaderModule,UploaderOptions  } from 'ngx-uploader';
import { ToastrService } from 'ngx-toastr';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.component.html',
  styleUrls: ['./add-coupon.component.scss']
})
export class AddCouponComponent {
  couponForm: FormGroup;
  name: any

  code: any
  discountPrice: any
  fromPrice: any
  type: any
  limit: any
  startDate: any
  endDate: any
  coupons: any = {};
  
  // })
  constructor(private couponService: CouponService, private router: Router, private formBuider: FormBuilder, private toast: NgToastService) {
    this.couponForm = this.formBuider.group({
      name: [''],
      code: [''],
      discountPrice:[''],
      fromPrice:[''],
      type:[''],
      limit:[''],
      startDate:[''],
      endDate:['']

    });

  }
  ngOnInit(): void {
    // this.couponForm = this.formBuider.group({
    //   name: ['', [Validators.required]],
    //   code: ['', [Validators.required]], // Add the required validator for images
    //   discountPrice: ['', [Validators.required, Validators.minLength(6)]],
    //   fromPrice: ['', [Validators.required]],
    //   type: ['', [Validators.required]],
    //   limit: ['', [Validators.required]],
    //   startDate: ['', [Validators.required]],
    //   endDate: ['', [Validators.required]],
    // });
  }
  

  // onSubmit() {
  //   const formData = new FormData();
  //   formData.append('name', this.couponForm.value.name);
  //   formData.append('code', this.couponForm.value.code);
  //   formData.append('discountPrice', this.couponForm.value.discountPrice);
  //   formData.append('fromPrice', this.couponForm.value.fromPrice);
  //   formData.append('type', this.couponForm.value.type);
  //   formData.append('limit', this.couponForm.value.limit);
  //   formData.append('startDate', this.couponForm.value.startDate);
  //   formData.append('endDate', this.couponForm.value.endDate);

  //   // ... append other form fields ...

   

  //   console.log(formData);
    
  // this.couponService.addCoupon(formData).subscribe(

    
  //   (response) => {
  //     this.toast.success({
  //       detail: 'Thông báo',
  //       summary: `Thêm bài viết thành công: ${response.data.title}`,
  //       duration: 5000,
  //       position: 'topRight'
  //     });
  //     this.router.navigate(['/admin/listBlog']);
  //   },
  //   (error) => {
  //     this.toast.error({
  //       detail: 'Thông báo',
  //       summary: 'Lỗi khi thêm bài viết!',
  //       duration: 5000,
  //       position: 'topRight'
  //     });
  //     console.error('Lỗi khi thêm bài viết: ', error);
  //   }
  // ); 
  // }
  onSubmit() {
    this.couponService.addCoupon(this.coupons).subscribe((response) => {
      console.log(response);
      
     this.name = response.data.name;
     this.code = response.data.code;
     this.discountPrice = response.data.discountPrice;
     this.fromPrice = response.data.fromPrice;
     this.type = response.data.type;
     this.limit = response.data.limit;
     this.startDate = response.data.startDate;
     this.endDate = response.data.endDate;
      this.toast.success({ detail: "Thông báo", summary: `add thành công danh mục: ${this.name}`, duration: 5000, position: "topRight" });
      this.router.navigate(['/admin/listCoupon'])
     
      // Thực hiện các hành động sau khi sản phẩm được thêm thành công
    },
    error => {
      console.log("loi khi them danh muc: ", error);
      // Xử lý lỗi nếu có
    }
    );
  }
}
