import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { BrandService } from 'src/app/service/brand.service';

@Component({
  selector: 'app-list-brand',
  templateUrl: './list-brand.component.html',
  styleUrls: ['./list-brand.component.scss']
})
export class ListBrandComponent {
  brands: any[] = []
  title: any
  constructor(private brandService: BrandService, private router: Router, private toast:NgToastService) {
  }
  ngOnInit(): void {
    this.getBrands();
  }

  getBrands(): void {
    this.brandService.getBrands().subscribe(
      (response: any) => {
        this.brands = response.getAllBrand;
        // console.log(this.brands);
         // Gán dữ liệu từ API vào biến 'brands'
      },
      (error) => {
        console.error('Error fetching brands:', error);
      }
    );
  }
  deleteBrand(id:any){
    var result = confirm(`Bạn có muốn xóa không ?`);
    if (result) {
      // Người dùng đã chọn Đồng ý
      // console.log("Người dùng đã chọn xóa.");
      // Gọi hàm xóa hoặc thực hiện các hành động khác tùy ý
      this.brandService.deleteBrand(id).subscribe(
        response => {
          // console.log(response);
          
          this.title = response.deleteBrand.title;
          this.toast.success({ detail: "Thông báo", summary: `xóa thành công thương hiệu: ${this.title}`, duration: 5000, position: "topRight" });
          this.router.navigate(['/admin/listBrand']);
          // console.log(response);
          
          this.brands = this.brands.filter((brand:any) => brand._id !== response.deleteBrand._id)
          
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
    this.filteredList = this.brands.filter((item:any) =>
      item.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.brands = this.filteredList
    // console.log(this.brands)
  }
  
}
