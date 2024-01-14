import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { Chart } from 'chart.js';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  public lineChartData = [
    { data: [10, 15, 7, 12, 18, 6, 22, 11, 10, 8, 23, 30], label: 'Doanh số bán hàng' }
  ];

  public lineChartLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5','Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10','Tháng 11', 'Tháng 12',];

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


  public lineChartDatas = [
    { data: [10, 15, 7, 12, 18, 6, 22, 11, 10, 8, 23, 30], label: 'Doanh số bán cứt' }
  ];

  public lineChartLabelss = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5','Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10','Tháng 11', 'Tháng 12',];

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
  
  ngOnInit(){
    this.currentStatistical = 'statistical1';
  }
  currentStatistical: string | null = null;

  statistical2() {
    this.currentStatistical = 'statistical2';
  }
  
}
