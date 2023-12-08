import { CouponService } from './../../../../service/coupon.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { NgxUploaderModule,UploaderOptions  } from 'ngx-uploader';
import { ToastrService } from 'ngx-toastr';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-update-coupon',
  templateUrl: './update-coupon.component.html',
  styleUrls: ['./update-coupon.component.scss']
})
export class UpdateCouponComponent {
  couponForm: FormGroup;
  coupon!:any;
  name: any

  code: any
  discountPrice: any
  fromPrice: any
  type: any
  limit: any
  startDate: any
  endDate: any
  coupons: any = {};
  
  couponid : any
  constructor(
    private formBuilder: FormBuilder,
    private couponService: CouponService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService
  ){
    this.route.paramMap.subscribe((param)=> {
      const id = String(param.get('id'))
      this.couponService.getCouponid(id).subscribe(
        (respon) => {
          console.log(respon);
          this.couponid = respon.data;
          this.couponForm.patchValue({
            code: respon.data.code,
            discountPrice: respon.data.discountPrice,
            fromPrice: respon.data.fromPrice,
            limit: respon.data.limit,
            name: respon.data.name,
            startDate: respon.data.startDate,
            endDate: respon.data.endDate,
            type: respon.data.type
          })
          
        },
        (error) => console.log(error.message)
      );
    });
    this.couponForm = this.formBuilder.group({
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
 
  onSubmit() {
    if (this.couponForm.valid) {
      const coupon = {
      
        
        id: this.couponid._id,
        name: this.couponForm.value.name || '',
        code: this.couponForm.value.code || '',
        fromPrice: this.couponForm.value.fromPrice || '',
        limit: this.couponForm.value.limit || '',
        startDate: this.couponForm.value.startDate || '',
        endDate: this.couponForm.value.endDate || '',
        type: this.couponForm.value.type || '',
        
      }
      

      this.couponService.updateCoupon(coupon).subscribe((respon) => {
        console.log(respon);
        
        this.name = respon.data.name;
        this.toast.success({ detail: "Thông báo", summary: `Sửa thành công, danh mục mới: ${this.name}`, duration: 5000, position: "topRight" });
        this.router.navigate(['/admin/listCoupon']);
      });
    }
  }
}
