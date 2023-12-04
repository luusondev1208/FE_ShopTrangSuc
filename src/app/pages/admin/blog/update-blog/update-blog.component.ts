import { BlogService } from 'src/app/service/blog.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators,FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CategoryService } from 'src/app/service/category.service';
@Component({
  selector: 'app-update-blog',
  templateUrl: './update-blog.component.html',
  styleUrls: ['./update-blog.component.scss']
})
export class UpdateBlogComponent {
  categories: any = []
  blogForm: FormGroup;
  selectedImages: FileList | null = null;
  
  blog:any
  blogs: any = {};
 
  constructor(private blogService: BlogService, private categoryService: CategoryService, private router: Router, private formBuider: FormBuilder, private toast: NgToastService, private route:ActivatedRoute) {
    this.route.paramMap.subscribe((param)=> {
      const id = String(param.get('id'))
      this.blogService.getBlogid(id).subscribe(
        (blog:any) => {
          console.log(blog);
          this.blog = blog.getBlog;
          
          
          this.blogForm.patchValue({
            title: blog.getBlog.title,
            imageschange: blog.getBlog.images,
            description: blog.getBlog.description,
            category: blog.getBlog.category
          })
          
        },
        (error) => console.log(error.message)
      );
    });
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
    console.log(event.target.files);
    
  }

  onHandleSubmitt() {
    
      const formData:any = {};
      formData.id =  this.blog._id;
      console.log(this.blog);
      
      formData.title = this.blogForm.value.title || '',
      formData.description = this.blogForm.value.description || '',
      formData.category = this.blogForm.value.category || '',
      // ... id other form fields ...
  console.log(formData);
 
  
      if (this.selectedImages?.length != 0 && this.selectedImages) {

        for (let i = 0; i < this.selectedImages.length; i++) {
          console.log(this.selectedImages[i]);
          formData.image = this.selectedImages[i];
        }
      }
  
  
      
    this.blogService.updateBlog(formData).subscribe(
      (response) => {
        this.toast.success({
          detail: 'Thông báo',
          summary: `Cập nhập bài viết thành công:`,
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
