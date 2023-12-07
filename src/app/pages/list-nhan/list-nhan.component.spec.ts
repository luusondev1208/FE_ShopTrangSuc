import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNhanComponent } from './list-nhan.component';

describe('ListNhanComponent', () => {
  let component: ListNhanComponent;
  let fixture: ComponentFixture<ListNhanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListNhanComponent]
    });
    fixture = TestBed.createComponent(ListNhanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
