import { HttpClient } from '@angular/common/http';


import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-infor-account',
  templateUrl: './infor-account.component.html',
  styleUrls: ['./infor-account.component.scss']
})
export class InforAccountComponent {
user!:any;


constructor(

  private userService:UserService,
  private router: ActivatedRoute

) 
{

  this.router.paramMap.subscribe((params) => {
    const id = String(params.get('id'));
    this.userService.getUser(id).subscribe(
      (data) => {
        console.log(data);
        this.user = data;
      },
      (error) => console.log(error.message)
    );
  });
}
}















