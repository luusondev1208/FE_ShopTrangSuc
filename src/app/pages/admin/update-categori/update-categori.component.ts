import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CategoryService } from 'src/app/service/category.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-categori',
  templateUrl: './update-categori.component.html',
  styleUrls: ['./update-categori.component.scss']
})
export class UpdateCategoriComponent {
  category!:any;
  title: any
  categoryForm = this.formBuilder.group({
    id:[
      '',
    ],
    title:[
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    ]
  });
  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService
  ){
    
    this.route.paramMap.subscribe((param)=> {
      const id = String(param.get('id'))
      this.categoryService.getCategory(id).subscribe(
        (category) => {
          console.log(category);
          
          this.category = category.getOneCategory;
          console.log(this.category);
          
          this.categoryForm.patchValue({
            title: category.getOneCategory.title,
          })
        },
      );
    });
  }
  // Gán giá trị từ data vào FormControl trong FormGroup
  
  onHandleSubmit() {
    if (this.categoryForm.valid) {
      // const updatedData = { ...this.categoryForm.value, };
      const category = {
        id: this.category._id,
        title: this.categoryForm.value.title || '',
      };
      console.log(category);
      
      
      this.categoryService.updateCategory(category).subscribe(
        (response) => {
          console.log('Update successful:', response);
          this.toast.success({ detail: "Thông báo", summary: `Update thành công danh mục: ${this.title}`, duration: 5000, position: "topRight" });
          // Xử lý sau khi cập nhật thành công, ví dụ: điều hướng tới trang khác
          this.router.navigate(['/admin/listCategori']);
        },
        (error) => {
          console.error('Update failed:', error);
        }
      );
    }
  }
}
