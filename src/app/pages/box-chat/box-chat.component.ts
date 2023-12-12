import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-box-chat',
  templateUrl: './box-chat.component.html',
  styleUrls: ['./box-chat.component.scss']
})
export class BoxChatComponent {
  messages: string[] = []; 
  newMessage: string = '';
  showHiHiHi: boolean = false;
  hiHiHiInterval: any
  textBlocks: string[] = []
  constructor(private modalService: NgbModal){
    this.textBlocks = [
      "Xin chào! Tôi là một trợ lý ảo của NRO. Bạn cần hỗ trợ gì nhỉ?",
      "Bạn đang tìm kiếm sản phẩm nào? Tôi có thể giúp bạn tìm kiếm hoặc tư vấn về sản phẩm",
      "Bạn cần biết về chính sách vận chuyển hoặc đổi trả hàng hóa không?",
      "Chúng tôi đang có khuyến mãi đặc biệt cho chiếc sịt lọt khe. Có phải bạn quan tâm không?",
      "Tiếc quá tôi đang không hiểu bạn nói linh tinh cái quái gì nữa...",
      "Cảm ơn bạn đã liên hệ với chúng tôi. đừng ngần ngại liên hệ 0347617094, hoặc ib https://www.facebook.com/Quangchien.kg.2003/ Nếu cần thêm thông tin," 
    ];
  }
  // Hàm được gọi khi người dùng nhấn nút gửi tin nhắn
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push(this.newMessage);
      this.newMessage = '';
      
    }
  }

  // Lấy đoạn text tương ứng với mỗi tin nhắn
  getTextBlock(index: number) {
    return this.textBlocks[index % this.textBlocks.length];
  }

  openShowSize(modal: any) {
    this.modalService.open(modal, {
      
    });
  }
  closeInferClusterModal() {
    this.modalService.dismissAll();
  }

}
