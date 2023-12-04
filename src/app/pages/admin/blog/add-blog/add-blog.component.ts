import { BlogService } from 'src/app/service/blog.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { NgxUploaderModule,UploaderOptions  } from 'ngx-uploader';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/service/category.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss']
})
export class AddBlogComponent {
  categories: any = []
  blogForm: FormGroup;
  selectedImages: FileList | null = null;
  

  blogs: any = {};
  
  // })
  constructor(private blogService: BlogService, private categoryService: CategoryService, private router: Router, private formBuider: FormBuilder, private toast: NgToastService) {
    this.categoryService.getAllCategory().subscribe(
      (response:any) => {
        this.categories = response.getAllCategory;
        console.log(this.categories);
        
      },
      (error) => {
        console.log(error);
      }
    );
    this.blogForm = this.formBuider.group({
      title: [''],
      description: [''],
      category:['']
      // ... other form fields ...
    });

  }
  ngOnInit(): void {
    this.blogForm = this.formBuider.group({
      title: ['', [Validators.required]],
      images: ['', [Validators.required]], // Add the required validator for images
      description: ['', [Validators.required, Validators.minLength(6)]],
      category: ['', [Validators.required]],
    });
  }
  onFilesSelected(event: any) {
    this.selectedImages = event.target.files;
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.blogForm.value.title);
    formData.append('description', this.blogForm.value.description);
    formData.append('category', this.blogForm.value.category);
    // ... append other form fields ...

    if (this.selectedImages) {
      for (let i = 0; i < this.selectedImages.length; i++) {
        formData.append('image', this.selectedImages[i]);
      }
    }

    console.log(formData);
    
  this.blogService.addBlog(formData).subscribe(

    
    (response) => {
      this.toast.success({
        detail: 'Thông báo',
        summary: `Thêm bài viết thành công: ${response.createdBlog.title}`,
        duration: 5000,
        position: 'topRight'
      });
      this.router.navigate(['/admin/listBlog']);
    },
    (error) => {
      this.toast.error({
        detail: 'Thông báo',
        summary: 'Lỗi khi thêm bài viết!',
        duration: 5000,
        position: 'topRight'
      });
      console.error('Lỗi khi thêm bài viết: ', error);
    }
  );
  }
}
