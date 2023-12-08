import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { UserService } from 'src/app/service/user.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-listuser',
  templateUrl: './listuser.component.html',
  styleUrls: ['./listuser.component.scss']
})
export class ListuserComponent {
  users: any = []
  userr: any
  constructor(private userService: UserService, private router: Router, private toast:NgToastService) {
    this.userService.getUsers().subscribe(
      (response:any) => {
        this.users = response.users;
        console.log(this.users);
        const dateParts: string[] = this.users.map((userItem: any) => {
          return userItem.createdAt.split('T')[0];
        });
        const dates: string[] = this.users.map((userItem: any) => {
          return userItem.updatedAt.split('T')[0];
        });


        this.users.forEach((userItem: any, index: number) => {
          userItem.datePart = dateParts[index];
          userItem.date = dates[index];
        });
        console.log(this.users);
      },
      (error) => {
        console.log(error);
      }
    );

   

  }
 //deleteUser
 deleteUser(_id:any){
  var result = confirm("Bạn có muốn xóa không?");
  if (result) {
    // Người dùng đã chọn Đồng ý
    console.log("Người dùng đã chọn xóa.");
    // Gọi hàm xóa hoặc thực hiện các hành động khác tùy ý
    this.userService.deleteUser(_id).subscribe(
      response => {
        console.log(response);
        this.toast.success({ detail: "Thông báo", summary: `:${response.deletedUser}`, duration: 5000, position: "topRight" });
        this.router.navigate(['/admin/listUser']);
        // Thực hiện các hành động sau khi sản phẩm được xóa thành công
        this.users = this.users.filter((user:any) => user._id !== response.data._id)
      },
      error => {
        console.error('Lỗi khi xóa tai khoan:', error);
        // Xử lý lỗi nếu có
      }
    )
  } else {
    // Người dùng đã chọn Hủy
    alert("Người dùng đã chọn không xóa.");
    // Thực hiện các hành động khác tùy ý
  }
}
  
  
  /**Default name for excel file when download**/
  fileName = 'ExcelSheet.xlsx';

  exportexcel() {
    /**passing table id**/
    let data = document.getElementById('table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    /**Generate workbook and add the worksheet**/
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /*save to file*/
    XLSX.writeFile(wb, this.fileName);
  }
}
