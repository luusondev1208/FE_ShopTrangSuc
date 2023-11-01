import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/Auth/auth.service';


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
    address: ['',[Validators.required]],
    name: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],

  })


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }


  onHandleSubmit() {

    this.authService.register(this.formRegister.value).subscribe({
      next: (user) => {
        alert("Đăng ký thành công!")
        this.router.navigate(['/login'])
      },
      error: (errors) => {
        alert("Đăng ký thất bại!")
      }
    })
  }
}
