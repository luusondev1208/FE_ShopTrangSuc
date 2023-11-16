import { HttpClient } from '@angular/common/http';


import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-infor-account',
  templateUrl: './infor-account.component.html',
  styleUrls: ['./infor-account.component.scss']
})
export class InforAccountComponent {
userData!:any;


constructor(

  private userService:UserService,
  private router: Router,
  private authService:AuthService,
  private toast:NgToastService

) 
{
  this.userData = localStorage.getItem('user');
  
    if (this.userData) {
       this.userData = JSON.parse(this.userData);
      
    }
 
}
signOut() {
  var result= confirm("Ban co muon dang xuat khong?")
  if(result){
   this.authService.logout();
   this.toast.success({ detail: "Thông báo", summary: 'Đăng Xuất thành công!', duration: 5000, position: "topRight" });
   this.router.navigate(['/login']);
  }
  

}
}















