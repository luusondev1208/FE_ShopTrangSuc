import { HttpClient } from '@angular/common/http';


import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute,Route,Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service';



@Component({
  selector: 'app-infor-account',
  templateUrl: './infor-account.component.html',
  styleUrls: ['./infor-account.component.scss']
})
export class InforAccountComponent {
userData!:any


constructor(
  private userService:UserService,
  private router: Router,
  
  private authService: AuthService
) 
{
  // this.router.paramMap.subscribe((params) => {
  //   const id = String(params.get('id'));
  //   this.userService.getUser(id).subscribe(
  //     (data) => {
  //       console.log(data);
  //       this.user = data;
  //     },
  //     (error) => console.log(error.message)
  //   );
  // });
  this.userData = localStorage.getItem('user');
  
    if (this.userData) {
       this.userData = JSON.parse(this.userData);
      
    }

  }
  signOut() {
         var result= confirm("Ban co muon dang xuat khong?")
         if(result){
          this.authService.logout();
         alert("Ban da dang xuat thanh cong")
          this.router.navigate(['/login']);
         }
         
      
     }


}
















