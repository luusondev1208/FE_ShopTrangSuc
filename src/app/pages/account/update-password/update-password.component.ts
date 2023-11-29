import { Component } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
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
    currentPassword:[
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(255)]
    ],
    password:[
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(255)]
    ],
   
    newPassword:[
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(255)]
    ]
  })
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
        console.log(user);
        this.user = user.use;
        this.userForm.patchValue({
          
          password: user.use.password
         
        })
        
      },
      (error) => console.log(error.message)
    );
  });
}
onChange(e:any){
 this.user[e.target.name] = e.target.value;
 console.log(this.user);
 
  
}
onSubmit(){
  
  if(this.userForm.valid){
    console.log(this.user);
    
 
    const user = {
      _id:this.user._id,
     
      password:this.userForm.value.newPassword || '',
      
    };
    if (this.userForm.value.currentPassword !== this.user.password){
      // Display an error message or take appropriate action
      this.toast.error({ detail: "Mật khẩu hiện tại không đúng!", summary: 'Lỗi', duration: 5000, position: "topRight" });
      
  }
  //   if (this.userForm.value.currentPassword !== this.user.password) {
  //     // Display an error message or take appropriate action
  //     this.toast.error({ detail: "Mật khẩu hiện tại không đúng!", summary: 'Lỗi', duration: 5000, position: "topRight" });
  //     return;
  // }
  
    this.userService.updateUser(user).subscribe((response) => {
      this.toast.success({ detail: "Thông báo", summary: 'Cập Nhật Mật Khẩu', duration: 5000, position: "topRight" });

      console.log(response);
     
      
    })
  }
    
}
}
