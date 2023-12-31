import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxChatComponent } from './box-chat.component';

describe('BoxChatComponent', () => {
  let component: BoxChatComponent;
  let fixture: ComponentFixture<BoxChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoxChatComponent]
    });
    fixture = TestBed.createComponent(BoxChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
