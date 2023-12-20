import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { SizeService } from 'src/app/service/size.service';
interface SizeResponse {
  getAllSize: {
    list_size: any[]; 
  };
}
@Component({
  selector: 'app-list-size',
  templateUrl: './list-size.component.html',
  styleUrls: ['./list-size.component.scss']
})
export class ListSizeComponent {
  sizes: any
  nameSize: any
  sizedetail: any[] = []
  constructor(private sizeService: SizeService, private router: Router, private toast:NgToastService) {
  }
  ngOnInit(): void {
    this.getSize();
  }

  getSize(): void {
    this.sizeService.getSizes().subscribe(
      (response: any) => {
        this.sizes = response.getAllSize;
        // console.log(this.sizes);
  
        // Iterate through each size object
        this.sizes.forEach((sizeObj: any) => {
          // Access the list_size array for each size object
          const listSize = sizeObj.list_size;
          // console.log(listSize);
          
          // Iterate through the list_size array to access individual size details
          listSize.forEach((sizeDetail: any) => {
            // console.log(sizeDetail);
            // Now 'sizeDetail' contains the individual size details
          });
        });
  
      },
      (error) => {
        console.error('Error fetching brands:', error);
      }
    );
  }
  formatPrice(num: number | string) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }
  deletesize(id:any){
    var result = confirm(`Bạn có muốn xóa không ?`);
    if (result) {
      // Người dùng đã chọn Đồng ý
      // console.log("Người dùng đã chọn xóa.");
      // Gọi hàm xóa hoặc thực hiện các hành động khác tùy ý
      this.sizeService.deleteSize(id).subscribe(
        response => {
          // console.log(response);
          // console.log(response);
          
          this.nameSize = response.deleteSize.nameSize;
          this.toast.success({ detail: "Thông báo", summary: `xóa thành công thương hiệu: ${this.nameSize}`, duration: 5000, position: "topRight" });
          this.router.navigate(['/admin/listSize']);
          console.log(response);
          
          this.sizes = this.sizes.filter((brand:any) => brand._id !== response.deleteSize._id)
          
        },
        error => {
          this.toast.success({ detail: "Thông báo", summary: 'lỗi rồi !!', duration: 5000, position: "topRight" });
          console.error('Lỗi khi xóa sản phẩm:', error);
          
        }
      )
    } else {
      // Người dùng đã chọn Hủy
      alert("Người dùng đã chọn không xóa.");
      // Thực hiện các hành động khác tùy ý
    }
  }

  searchResults: any[] = [];
  searchTerm: string = '';
  filteredList: any[] = [];

  search() {
    this.filteredList = this.sizes.filter((item:any) =>
      item.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sizes = this.filteredList
    // console.log(this.sizes)
  }
  
}
