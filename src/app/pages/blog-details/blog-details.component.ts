import { ActivatedRoute ,Router} from '@angular/router';
import { Component } from '@angular/core';
import { BlogService } from 'src/app/service/blog.service';


@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent {
blog:any ={};
constructor( private activatedRoute: ActivatedRoute,
  private blogService: BlogService,
  private router: Router,
  ){
 
    activatedRoute.params.subscribe((params)=>{
   blogService.getBlogid(params['id']).subscribe((data)=>{
    console.log(data);
  this.blog= data.getBlog;

   })
    })
}
}
