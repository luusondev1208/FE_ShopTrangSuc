import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { BrandService } from 'src/app/service/brand.service';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-update-brand',
  templateUrl: './update-brand.component.html',
  styleUrls: ['./update-brand.component.scss']
})
export class UpdateBrandComponent {
  brand!: any; // Update the type here if needed
  title: any;
  brandForm = this.formBuilder.group({
    title: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(255)]
    ]
  });

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService
  ){
    this.route.paramMap.subscribe((param) => {
      const id = String(param.get('id'))
      this.brandService.get(id).subscribe(
        (response: any) => {  // Adjust the type here if possible
          // console.log(response);
          this.brand = response.getBrand;
          this.brandForm.patchValue({
            title: this.brand.title,
          });
        },
        // (error) => console.log(error.message)
      );
    });
    
  }
  onHandleSubmit() {
    if (this.brandForm.valid) {
      const brand = {
        id: this.brand._id,
        title: this.brandForm.value.title || '',
       
        
      };
      // console.log(brand);
      

      this.brandService.updateBrand(brand).subscribe((brand) => {
        // console.log(brand);
        
        this.title = brand.updateBrand.title;
        this.toast.success({ detail: "Thông báo", summary: `Sửa thành công, thương hiệu mới: ${this.title}`, duration: 5000, position: "topRight" });
        this.router.navigate(['/admin/listBrand']);
      });
    }
  }
}
