import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-add-categori',
  templateUrl: './add-categori.component.html',
  styleUrls: ['./add-categori.component.scss']
})
export class AddCategoriComponent {
  categories: any = {};
  categoryForm = this.formBuider.group({
    title:[
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(255)]
    ]
  })
  constructor(private categoryService: CategoryService, private router: Router, private formBuider: FormBuilder) {}
  onsubmit() {
    this.categoryService.addCategory(this.categories).subscribe((response) => {
      console.log('danh muc them thanh cong: ',response);
      this.router.navigate(['/admin/listCategori'])
      alert("add thanh cong")
      // Thực hiện các hành động sau khi sản phẩm được thêm thành công
    },
    error => {
      console.log("loi khi them danh muc: ", error);
      // Xử lý lỗi nếu có
    }
    );
  }
}
