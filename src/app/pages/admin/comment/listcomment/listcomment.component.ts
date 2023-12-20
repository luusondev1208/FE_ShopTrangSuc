import { Component } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

import { FeedbackService } from 'src/app/service/feedback.service';

@Component({
  selector: 'app-listcomment',
  templateUrl: './listcomment.component.html',
  styleUrls: ['./listcomment.component.scss']
})
export class ListcommentComponent {
  comments: any[] = []
  page: number = 1;
  limit: number = 10;
 constructor(private feedbackService: FeedbackService,  private toast: NgToastService,){
this.feedbackService.get().subscribe((data) => {
  
  this.comments = data.data
  console.log(this.comments);
})
 }
 deleteComment(id: any){
  this.feedbackService.deleteFeback(id).subscribe(
    (response) => {

      console.log(response);
      
      this.comments = this.comments.filter(
        (comments: any) => comments.feedback._id !== response.data._id
      );
      this.toast.success({
        detail: "Thông báo",
        summary: `Xóa thành công bình luận: ${response.data.content}`,
        duration: 5000,
        position: "topRight",
      });
    },
    (error) => {
      this.toast.error({
        detail: "Thông báo",
        summary: 'Lỗi khi xóa bình luận!',
        duration: 5000,
        position: "topRight",
      });
      console.error('Lỗi khi xóa bình luận:', error);
    }
  );

 }
 previousPage() {
  if (this.page > 1) {
    this.page--;
    // this.loadData();
  }
}

nextPage() {
  this.page++;
  // this.loadData();
}

}
