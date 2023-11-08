import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  formLogin: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: NgToastService
  ) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onHandleSubmit() {
    if (this.formLogin.invalid) return;
    this.authService.loggin(this.formLogin.value).subscribe({
      next: (user) => {
        this.toast.success({ detail: "Thông báo", summary: 'Đăng nhập thành công!', duration: 5000, position: "topCenter" });
        this.router.navigate(['/'])
      },
      error: ({ error }) => {
        this.toast.success({ detail: "Thông báo", summary: 'Đăng nhập thất bại!', duration: 5000, position: "topCenter" });
      }
    })
  }
}

