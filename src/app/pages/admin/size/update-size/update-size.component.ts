import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { SizeService } from 'src/app/service/size.service';
@Component({
  selector: 'app-update-size',
  templateUrl: './update-size.component.html',
  styleUrls: ['./update-size.component.scss']
})
export class UpdateSizeComponent {
  sizeId: any  ;
  size: any = {}; // Adjust the type according to your data structure
  title: any;

  sizeform = this.formBuilder.group({
    list_size: this.formBuilder.array([]), // Adjust as needed
    nameSize: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]]
  });

  constructor(
    private sizeService: SizeService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.sizeId = this.route.snapshot.params['id'];
    this.getSize();
  }
  

  getSize(): void {
    this.sizeService.getSize(this.sizeId).subscribe(
      (response) => {
        console.log(response);
        
        this.size = response.getSize; // Assuming your service provides the size details
        this.populateForm();
      },
      (error) => {
        console.error('Error fetching size:', error);
      }
    );
  }

  populateForm(): void {
    // Populate the form with the size details
    this.sizeform.patchValue({
      nameSize: this.size.nameSize
      // Add other fields as needed
    });

    // Remove existing controls in 'list_size'
    while (this.listSizeFormArray.length !== 0) {
      this.listSizeFormArray.removeAt(0);
    }

    // Add controls to 'list_size'
    this.size.list_size.forEach((sizeItem: any) => {
      this.addSize(sizeItem);
    });
  }

  addSize(sizeItem?: any): void {
    const sizeGroup = this.formBuilder.group({
      name: [sizeItem?.name || '', [Validators.required, Validators.minLength(1)]],
      quantity: [sizeItem?.quantity || null, [Validators.required, Validators.min(1)]],
      price: [sizeItem?.price || null, [Validators.required, Validators.min(1)]]
    });

    this.listSizeFormArray.push(sizeGroup);
  }

  onSubmit(): void {
    this.sizeService.updateSize(this.sizeId, this.sizeform.value).subscribe(
      (response) => {
        this.title = response;
        this.toast.success({ detail: 'Cập nhật size thành công.', duration: 5000, position: 'topRight' });
        this.router.navigate(['/admin/listSize'])
        // Additional logic if needed
      },
      (error) => {
        console.log('Error when updating size: ', error);
        this.toast.error({ detail: 'Lỗi, kiếm tra lại thông tin đã nhập.', duration: 5000, position: 'topRight' });
        // Handle error
      }
    );
  }

  removeSize(index: number): void {
    this.listSizeFormArray.removeAt(index);
  }

  get listSizeFormArray() {
    return this.sizeform.get('list_size') as FormArray;
  }
}
