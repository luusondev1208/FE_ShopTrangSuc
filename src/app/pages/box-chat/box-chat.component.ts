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
      "Xin chào! Tôi là một trợ lý ảo của NRO?",
      "Bạn đã tìm thấy sản phẩm ưng ý chưa, tôi có thể giúp bạn tư vấn ?",
      "Xin lỗi bạn, chức năng nói chuyện với bạn tôi đang phát triển....",
      "Để được tư vấn kỹ hơn về sản phẩm vui lòng liên hệ 034761704 ạ ! Free nha bạn iu",
      "Hoặc bạn có thể nhắn tin trực tiếp qua fanpage https://www.facebook.com/profile.php?id=100083060362771 nhé",
      "Cảm ơn bạn đã liên hệ với chúng tôi. say bye !!" 
      
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
