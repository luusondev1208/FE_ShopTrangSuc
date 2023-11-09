import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent {
  product!:any;
  productForm = this.formBuilder.group({
   
    title:[
      '',
     
    ],
    brand:[
      '',
     
    ],
    images:[
      '',
     
    ],
    
    price:[
      0,
      [Validators.required, Validators.min(1)]
    ],
    priceroot:[
      0,
      [Validators.required, Validators.min(1)]
    ],
    
    description:[
      '',
     
    ],
    slug:[
      '',
     
    ]
  });
  constructor(
    private formBuilder: FormBuilder,
    private producService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.route.paramMap.subscribe((param)=> {
      const id = String(param.get('id'))
      this.producService.getProduct(id).subscribe(
        (product) => {
          console.log(product);
          this.product = product.productData;
          
          
          this.productForm.patchValue({
            title: product.productData.title,
            price: product.productData.price,
            priceroot: product.productData.price,
            images: product.productData.images,
            brand: product.productData.brand,
            description: product.productData.description,
            slug: product.productData.slug
          })
          
        },
        (error) => console.log(error.message)
      );
    });
  }
  onHandleSubmit() {
    // console.log(this.product);
    
    if (this.productForm.valid) {
      const product = {
        id:this.product._id,
        title: this.productForm.value.title || '',
        price: this.productForm.value.price || 0,
        priceroot: this.productForm.value.priceroot || 0,
        description: this.productForm.value.description || '',
        images: this.productForm.value.images || '',
        brand: this.productForm.value.brand || '',
        slug:  this.productForm.value.slug || '',
      };

      this.producService.updateProduct(product).subscribe((product) => {
        alert("update thanh cong !!");
        this.router.navigate(['/admin/list']);
      });
    }
  }

  
}
