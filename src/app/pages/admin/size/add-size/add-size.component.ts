import { Component } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { SizeService } from 'src/app/service/size.service';

@Component({
  selector: 'app-add-size',
  templateUrl: './add-size.component.html',
  styleUrls: ['./add-size.component.scss']
})
export class AddSizeComponent {
  title: any;

  sizeform = this.formBuilder.group({
    list_size: this.formBuilder.array([
      this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
        quantity: [null, [Validators.required, Validators.min(1)]],
        price: [null, [Validators.required, Validators.min(1)]]
      })
    ]),
    nameSize: ['', Validators.required]
  });

  constructor(
    private sizeService: SizeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toast: NgToastService,
    
  ) {}

  get listSizeFormArray() {
    return this.sizeform.get('list_size') as FormArray;
  }

  addSize() {
    const sizeGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(1)]]
    });

    this.listSizeFormArray.push(sizeGroup);
  }

 onSubmit() {
  this.sizeService.createSize(this.sizeform.value).subscribe(
    (response) => {
      this.title = response;
      this.toast.success({ detail: 'Thêm size thành công.', duration: 5000, position: 'topRight' });
      this.router.navigate(['/admin/listSize'])
      
    },
    (error) => {
      console.log('Error when adding size: ', error);
      this.toast.error({ detail: 'Lỗi vui lòng kiếm tra lại thông tin đã nhập.', duration: 5000, position: 'topRight' });
      
    }
  );
 }

  removeSize(index: number) {
    this.listSizeFormArray.removeAt(index);
  }
}
