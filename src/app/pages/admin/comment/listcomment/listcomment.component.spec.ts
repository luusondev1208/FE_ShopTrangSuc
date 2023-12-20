import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListcommentComponent } from './listcomment.component';

describe('ListcommentComponent', () => {
  let component: ListcommentComponent;
  let fixture: ComponentFixture<ListcommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListcommentComponent]
    });
    fixture = TestBed.createComponent(ListcommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
