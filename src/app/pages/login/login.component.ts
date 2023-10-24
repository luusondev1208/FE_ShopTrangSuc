import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
        alert("Đăng nhập thành công!")
        this.router.navigate(['/'])
      },
      error: ({ error }) => {
        alert("Đăng nhập thất bại!")
      }
    })
  }
}

