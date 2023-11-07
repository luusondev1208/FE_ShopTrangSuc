import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  formRegister = this.fb.group({
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required]],
    address: ['', [Validators.required]],
    name: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],

  })


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: NgToastService
  ) { }


  onHandleSubmit() {
    this.authService.register(this.formRegister.value).subscribe({
      next: (user) => {
        this.toast.success({ detail: "Thông báo", summary: 'Đăng ký thành công!', duration: 5000, position: "topCenter" });
        this.router.navigate(['/login'])
      },
      error: (errors) => {
        this.toast.success({ detail: "Thông báo", summary: 'Đăng ký thất bại!', duration: 5000, position: "topCenter" });
      }
    })
  }
}