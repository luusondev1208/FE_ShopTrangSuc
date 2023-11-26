import { Component } from '@angular/core';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-change-status-order',
  templateUrl: './change-status-order.component.html',
  styleUrls: ['./change-status-order.component.scss']
})
export class ChangeStatusOrderComponent {
  constructor(
    private orderSevice: OrderService,
  ) {
  };

  ngOnInit(): void {
    const local = localStorage.getItem("idOrder")
    const idOrder = local && local;

    this.orderSevice.changeStatusPayment(idOrder).subscribe((res) => {
      console.log(res);
    })
  }
}
