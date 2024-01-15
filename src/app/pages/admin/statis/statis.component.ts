import { Component, OnInit, Renderer2, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import { StatisService } from 'src/app/service/statis.service';
import { AuthService } from 'src/app/service/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { startOfMonth, endOfMonth, format } from 'date-fns';

@Component({
  selector: 'app-statis',
  templateUrl: './statis.component.html',
  styleUrls: ['./statis.component.scss']
})
export class StatisComponent implements OnInit {
  constructor(private StatisService: StatisService, private datePipe: DatePipe) { }

  // statistical 1
  public lineChartData = [
    { data: [], label: 'Doanh thu theo ngày và tháng' }
  ];

  public lineChartLabels: any = [];
  public lineChartOptions: any = {
    responsive: true,
  };

  public lineChartColors: any[] = [
    {
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      fill: false
    }
  ];

  // statistical 2
  public lineChartDatas = [
    { data: [], label: 'Doanh thu theo tháng và năm' }
  ];

  public lineChartLabelss = [];

  public lineChartOptionss: any = {
    responsive: true,
  };

  public lineChartColorss: any[] = [
    {
      borderColor: 'rgba(255, 0, 0, 1)',
      borderWidth: 2,
      fill: false
    }
  ];


  public lineChartLegend = true;
  public lineChartType = 'line';

  // bieudoduong
  myForm: any;
  orderStatusCounts: any
  topBuyers: any
  topProductSeller: any

  onDateSelect() {
    if (this.myForm.value.startDate && this.myForm.value.endDate) {
      this.getTotalPriceMonthAndYear();
      this.getTotalPriceDayAndMonth()
    }
  }

  ngOnInit() {
    this.currentStatistical = 'statistical2';
    const currentDate = new Date();
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);

    this.myForm = new FormGroup({
      startDate: new FormControl(this.datePipe.transform(firstDayOfMonth, 'yyyy-MM-dd')),
      endDate: new FormControl(this.datePipe.transform(lastDayOfMonth, 'yyyy-MM-dd'))
    });

    this.getTotalPriceMonthAndYear();
    this.getTotalPriceDayAndMonth()
    this.getStatis()
    this.getTopBuyer()
    this.getTopProductSeller()
  }

  getTotalPriceMonthAndYear() {
    if (this.myForm?.value.startDate && this.myForm?.value.endDate) {
      const startYear = new Date(this.myForm.value.startDate).getFullYear();
      const endYear = new Date(this.myForm.value.endDate).getFullYear();

      const data = {
        startYear: startYear,
        endYear: endYear
      }

      this.StatisService.getTotalPriceMonth(data)
        .subscribe(data => {
          this.lineChartLabelss = data.result.map((item: any) => item.month);
          this.lineChartDatas[0].data = data.result.map((item: any) => item.totalAmount);
        });
    }
  }

  getStatis() {
    this.StatisService.getStatistics().subscribe(data => {
      this.orderStatusCounts = data.statistic.orderStatusCounts;
    })
  }

  getTopProductSeller() {
    this.StatisService.getTopProductSeller().subscribe(data => {
      this.topProductSeller = data.topProducts;
    })
  }


  getTopBuyer() {
    this.StatisService.getTopBuyer().subscribe(data => {
      this.topBuyers = data.topBuyers
    })
  }

  getTotalPriceDayAndMonth() {
    if (this.myForm?.value.startDate && this.myForm?.value.endDate) {
      const data = {
        startDate: this.myForm.value.startDate,
        endDate: this.myForm.value.endDate
      }

      this.StatisService.getTotalPriceDay(data)
        .subscribe(data => {
          this.lineChartLabels = data.dailyTotals.map((item: any) => item._id);
          this.lineChartData[0].data = data.dailyTotals.map((item: any) => item.totalAmount);
        });
    }
  }

  currentStatistical: string | null = null;

  statistical2() {
    this.currentStatistical = 'statistical2';
  }
}
