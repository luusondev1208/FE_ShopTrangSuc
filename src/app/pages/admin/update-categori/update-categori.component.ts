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
      [Validators.required, Validators.minLength(6), Validators.maxLength(255)]
    ]
  });
  @Input() data: any; // Thuộc tính để nhận dữ liệu từ bên ngoài
  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService
  ){
    
    // this.route.paramMap.subscribe((param)=> {
    //   const id = String(param.get('id'))
    //   this.categoryService.getCategory(id).subscribe(
    //     (category) => {
    //       this.category = category.getOneCategory;
    //       this.categoryForm.patchValue({
    //         title: category.getOneCategory.title,
    //       })
          
    //     },
    //   );
    // });
  }
  // Gán giá trị từ data vào FormControl trong FormGroup
  
  onHandleSubmit() {
    if (this.categoryForm.valid) {
      const updatedData = { ...this.categoryForm.value, };
      this.categoryService.updateCategory(updatedData).subscribe(
        (response) => {
          console.log('Update successful:', response);
          // Xử lý sau khi cập nhật thành công, ví dụ: điều hướng tới trang khác
          this.router.navigate(['/your-route']);
        },
        (error) => {
          console.error('Update failed:', error);
        }
      );
    }
  }
}
