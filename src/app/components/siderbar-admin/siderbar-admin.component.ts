import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-siderbar-admin',
  templateUrl: './siderbar-admin.component.html',
  styleUrls: ['./siderbar-admin.component.scss']
})
export class SiderbarAdminComponent {
  constructor( private router: Router, private authService: AuthService,private toast:NgToastService) {
  }
  signOut() {
    var result= confirm("Bạn có muốn đăng xuất không?")
    if(result){
     this.authService.logout();
     this.toast.success({ detail: "Thông báo", summary: 'Đăng Xuất thành công!', duration: 5000, position: "topRight" });
     this.router.navigate(['/login']);
    }
    else if(!localStorage.getItem("user")){
            alert("người dùng chưa đăng nhập")
    }
    else{
      alert("Bạn đã không đăng xuất ");
      
    }
    
  
  }
}
