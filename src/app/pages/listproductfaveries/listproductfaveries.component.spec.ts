import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListproductfaveriesComponent } from './listproductfaveries.component';

describe('ListproductfaveriesComponent', () => {
  let component: ListproductfaveriesComponent;
  let fixture: ComponentFixture<ListproductfaveriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListproductfaveriesComponent]
    });
    fixture = TestBed.createComponent(ListproductfaveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
