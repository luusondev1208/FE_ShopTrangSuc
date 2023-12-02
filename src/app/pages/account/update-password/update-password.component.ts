import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent {
  user!: any;
  userForm = this.formBuilder.group({
    oldPassword:[
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(255)]
    ],
    newPassword:[
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(255)]
    ],
   
    confirmPass:[
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(255)]
    ]
  },
 

  )
constructor(
  private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService
)
{
  this.route.paramMap.subscribe((param)=>{
    const users = JSON.parse(localStorage.getItem("user") as string);
    const id = users._id
     
    this.userService.getUser(id).subscribe(
      (user) => {
        this.user = user.use;
        console.log(this.user);

     
        
      },
      (error) => console.log(error.message)
    );
  });
}
onChange(e:any){
 this.user[e.target.name] = e.target.value;
 console.log(this.user);
 
  
}

private checkPassword(group: FormGroup) {
  const password = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPass')?.value;

  if (password === confirmPassword) {
    group.get('confirmPass')?.setErrors(null); // Reset errors if passwords match
    return null; // Return null if passwords match
  } else {
    group.get('confirmPass')?.setErrors({ mismatch: true }); // Set 'mismatch' error if passwords do not match
    return { mismatch: true }; // Return an object with 'mismatch' error key if passwords do not match
  }
}

onSubmit(){
 

  // console.log(isCheckPass);


  if(this.userForm.valid){
    console.log(this.user);
    
    const password = this.userForm.get('newPassword')?.value;
    const confirmPassword = this.userForm.get('confirmPass')?.value;

    if (password !== confirmPassword) {
      // Nếu mật khẩu mới không khớp với confirmPass, hiển thị thông báo lỗi
      this.toast.error({ detail: "Mật khẩu mới không khớp với xác nhận mật khẩu!", summary: 'Lỗi', duration: 5000, position: "topRight" });
      return;
    }
    const user = {
      _id:this.user._id,
      oldPassword:this.userForm.value.oldPassword || '',
      newPassword:this.userForm.value.newPassword || '',
      
    };  
  //   if (this.userForm.value.currentPassword !== this.user.password){
  //     // Display an error message or take appropriate action
  //     this.toast.error({ detail: "Mật khẩu hiện tại không đúng!", summary: 'Lỗi', duration: 5000, position: "topRight" });
      
  // }

    
  //   if (this.userForm.value.currentPassword !== this.user.password) {
  //     // Display an error message or take appropriate action
  //     this.toast.error({ detail: "Mật khẩu hiện tại không đúng!", summary: 'Lỗi', duration: 5000, position: "topRight" });
  //     return;
  // }
  try {
    this.userService.updatePass(user).subscribe((response) => {
      this.toast.success({ detail: "Thông báo", summary: 'Cập Nhật Mật Khẩu Thành Công', duration: 5000, position: "topRight" });

      console.log(response);
     
      
    },(error) => {
      console.log("Lỗi trong quá trình subscribe:", error.error.error);
      this.toast.error({ detail: "Thông báo", summary: `${error.error.error}`, duration: 5000, position: "topRight" });

      // Xử lý lỗi ở đây nếu cần
    }
    )
  } catch (error) {
    console.log(error);
    
  }
  
  
  }
    
}
}
