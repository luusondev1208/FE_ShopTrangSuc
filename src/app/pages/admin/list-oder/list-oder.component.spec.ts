import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOderComponent } from './list-oder.component';

describe('ListOderComponent', () => {
  let component: ListOderComponent;
  let fixture: ComponentFixture<ListOderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListOderComponent]
    });
    fixture = TestBed.createComponent(ListOderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
