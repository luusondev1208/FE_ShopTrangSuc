import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStatusOrderComponent } from './change-status-order.component';

describe('ChangeStatusOrderComponent', () => {
  let component: ChangeStatusOrderComponent;
  let fixture: ComponentFixture<ChangeStatusOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeStatusOrderComponent]
    });
    fixture = TestBed.createComponent(ChangeStatusOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
