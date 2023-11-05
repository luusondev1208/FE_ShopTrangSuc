import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/service/category.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  users: any = {};
  userForm = this.formBuider.group({
    firstname:[
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
    ],
    lastname:[
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
    ],
    email:[
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
    ],
    mobile:[
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
    ],
    password:[
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
    ]
  })
  constructor(private UserService: UserService, private router: Router, private formBuider: FormBuilder) {}
  onsubmit() {
    this.UserService.addUser(this.users).subscribe((response) => {
      console.log('danh tai khoan thanh cong: ',response);
      this.router.navigate(['/admin/listUser'])
      alert("add thanh cong")
      // Thực hiện các hành động sau khi sản phẩm được thêm thành công
    },
    error => {
      console.log("loi khi them tai khoan: ", error);
      // Xử lý lỗi nếu có
    }
    );
  }
}
