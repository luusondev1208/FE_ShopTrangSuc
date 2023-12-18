import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-siderbar-admin',
  templateUrl: './siderbar-admin.component.html',
  styleUrls: ['./siderbar-admin.component.scss']
})
export class SiderbarAdminComponent {
  user!: any;
  userRole!: string;
  firstname: any;
  lastname: any
  constructor( private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private toast: NgToastService,
    private route: ActivatedRoute) {
    this.route.paramMap.subscribe((param) => {
      const users = JSON.parse(localStorage.getItem("user") as string);
      const id = users._id

      this.userService.getUser(id).subscribe(
        (user) => {
          console.log(user);
          this.user = user.use;
          this.userRole = user.use.role
          this.firstname = user.use.firstname.replace(/\b\w/g, function (char:any) {
            return char.toUpperCase();
          });
          this.lastname = user.use.lastname.replace(/\b\w/g, function (char:any) {
            return char.toUpperCase();
          });
          
          console.log(this.userRole);
          

        },
        (error) => console.log(error.message)
      );
    });
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
