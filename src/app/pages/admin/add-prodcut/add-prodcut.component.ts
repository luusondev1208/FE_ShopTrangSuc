import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { NgxUploaderModule, UploaderOptions } from 'ngx-uploader';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/service/category.service';
import { NgToastService } from 'ng-angular-popup';
import { BrandService } from 'src/app/service/brand.service';
import { SizeService } from 'src/app/service/size.service';


@Component({
  selector: 'app-add-prodcut',
  templateUrl: './add-prodcut.component.html',
  styleUrls: ['./add-prodcut.component.scss'],
})
export class AddProdcutComponent {
  // public files: File[] = [];
  // public images: File[] = [];
  categories: any = []
  brands: any = []
  listsize: any = []
  productForm: FormGroup;
  selectedImages: FileList | null = null;


  products: any = {};

  constructor(private productService: ProductService, private brandService: BrandService, private sizeService: SizeService, private categoryService: CategoryService, private router: Router, private formBuider: FormBuilder, private toast: NgToastService) {
    this.categoryService.getCategories().subscribe(
      (response: any) => {
        this.categories = response.getAllCategory;
        // console.log(this.categories);

      },
      (error) => {
        // console.log(error);
      }
    );
    this.sizeService.getSizes().subscribe(
      (response: any) => {
        this.listsize = response.getAllSize;
        // console.log(this.listsize);

      },
      (error) => {
        // console.log(error);
      }
    );
    this.brandService.getBrands().subscribe(
      (response: any) => {

        this.brands = response.getAllBrand;
        // console.log(this.brands);

      },
      (error) => {
        // console.log(error);
      }
    );
    this.productForm = this.formBuider.group({
      title: [''],
      description: [''],
      brand: [''],
      price: [0],
      priceroot: [0],
      assess: [0],
      quantity: [''],

      // ... other form fields ...
    });

  }
  ngOnInit(): void {
    this.productForm = this.formBuider.group({
      title: ['', [Validators.required]],
      assess: ['', [Validators.required, Validators.min(0)]],
      priceroot: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
      images: ['', [Validators.required]], // Add the required validator for images
      brand: [''], // Set a default value or remove it if not needed
      description: ['', [Validators.required, Validators.minLength(6)]],
      category: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      list_size: ['', [Validators.required]]
    });
  }
  onFilesSelected(event: any) {
    this.selectedImages = event.target.files;
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.productForm.value.title);
    formData.append('description', this.productForm.value.description);
    formData.append('brand', this.productForm.value.brand);
    formData.append('price', this.productForm.value.price);
    formData.append('assess', this.productForm.value.assess);
    formData.append('priceroot', this.productForm.value.priceroot);
    formData.append('category', this.productForm.value.category);
    formData.append('quantity', this.productForm.value.quantity);
    formData.append('list_size', this.productForm.value.list_size);
    // ... append other form fields ...
    if (this.selectedImages) {
      for (let i = 0; i < this.selectedImages.length; i++) {
        formData.append('image', this.selectedImages[i]);
      }
    }



    this.productService.addProduct(formData).subscribe(
      (response) => {
        this.toast.success({
          detail: 'Thông báo',
          summary: `Thêm sản phẩm thành công: ${response.createdProduct.title}`,
          duration: 5000,
          position: 'topRight'
        });
        this.router.navigate(['/admin/list']);
      },
      (error) => {
        this.toast.error({
          detail: 'Thông báo',
          summary: 'Lỗi khi thêm sản phẩm!',
          duration: 5000,
          position: 'topRight'
        });
        console.error('Lỗi khi thêm sản phẩm: ', error);
      }
    );
  }
}
