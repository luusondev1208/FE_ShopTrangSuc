import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisComponent } from './statis.component';

describe('StatisComponent', () => {
  let component: StatisComponent;
  let fixture: ComponentFixture<StatisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisComponent]
    });
    fixture = TestBed.createComponent(StatisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
