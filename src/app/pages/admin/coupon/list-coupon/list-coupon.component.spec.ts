import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCouponComponent } from './list-coupon.component';

describe('ListCouponComponent', () => {
  let component: ListCouponComponent;
  let fixture: ComponentFixture<ListCouponComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCouponComponent]
    });
    fixture = TestBed.createComponent(ListCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
