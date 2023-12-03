import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';
@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent {
  categories: any = []
  productForm: FormGroup;
  selectedImages: FileList | null = null;
  
product:any
  products: any = {};
  // productForm = this.formBuider.group({
  //   title:[
  //     '',
  //     [Validators.required, Validators.minLength(6), Validators.maxLength(255)]
  //   ],
  //   price:[
  //     0,
  //     [Validators.required, Validators.min(1)]
  //   ],
  //   description:[
  //     '',
  //     [Validators.required, Validators.minLength(6), Validators.maxLength(255)]
  //   ],
  //   brand:[
  //     '',
  //     [Validators.required, Validators.minLength(6), Validators.maxLength(255)]
  //   ],
  //   slug:[
  //     '',
  //     [Validators.required, Validators.minLength(6), Validators.maxLength(255)]
  //   ],
  //   images:[
  //     '',
  //     [Validators.required]
  //   ],
  //   priceroot:[
  //     '',
  //     [Validators.required,Validators.min(1), Validators.minLength(6), Validators.maxLength(255)]
  //   ],
  //   category:[
  //     '',
  //     [Validators.required]
  //   ],
    
  // })
  constructor(private productService: ProductService, private categoryService: CategoryService, private router: Router, private formBuider: FormBuilder, private toast: NgToastService, private route:ActivatedRoute) {
    this.route.paramMap.subscribe((param)=> {
      const id = String(param.get('id'))
      this.productService.getProduct(id).subscribe(
        (product:any) => {
          console.log(product);
          this.product = product.productData;
          
          
          this.productForm.patchValue({
            title: product.productData.title,
            price: product.productData.price,
            priceroot: product.productData.price,
            // images: product.productData.images,
            imageschange: product.productData.images,
            brand: product.productData.brand,
            description: product.productData.description,
            slug: product.productData.slug,
            category: product.productData.category
          })
          
        },
        (error) => console.log(error.message)
      );
    });
    this.categoryService.getCategories().subscribe(
      (response:any) => {
        this.categories = response.getAllCategory;
        console.log(this.categories);
        
      },
      (error) => {
        console.log(error);
      }
    );
    this.productForm = this.formBuider.group({
      title: [''],
      description: [''],
      brand: [''],
      price: [0],
      // ... other form fields ...
    });

  }
  ngOnInit(): void {
    this.productForm = this.formBuider.group({
      title: ['', [Validators.required]],
      priceroot: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
      images: ['', [Validators.required]], // Add the required validator for images
      brand: ['TTL'], // Set a default value or remove it if not needed
      description: ['', [Validators.required, Validators.minLength(6)]],
      category: ['', [Validators.required]],
    });
  }
  onFilesSelected(event: any) {
    this.selectedImages = event.target.files;
    console.log(event.target.files);
    
  }

  onHandleSubmit() {
    
      const formData:any = {};
      formData.id =  this.product._id;
      console.log(this.product);
      
      formData.title = this.productForm.value.title || '',
      formData.description = this.productForm.value.description || '',
      formData.brand = this.productForm.value.brand || '',
      formData.priceroot = this.productForm.value.priceroot || 0,
      formData.price =  this.productForm.value.price || 0,
      formData.category = this.productForm.value.category || '',
      // ... id other form fields ...
  console.log(formData);
 
  
      if (this.selectedImages?.length != 0 && this.selectedImages) {

        for (let i = 0; i < this.selectedImages.length; i++) {
          console.log(this.selectedImages[i]);
          formData.image = this.selectedImages[i];
        }
      }
  
  
      
    this.productService.updateProduct(formData).subscribe(
      (response) => {
        this.toast.success({
          detail: 'Thông báo',
          summary: `update sản phẩm thành công:`,
          duration: 5000,
          position: 'topRight'
        });
        // this.router.navigate(['/admin/list']);
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
