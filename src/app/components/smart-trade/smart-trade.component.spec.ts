import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartTradeComponent } from './smart-trade.component';

describe('SmartTradeComponent', () => {
  let component: SmartTradeComponent;
  let fixture: ComponentFixture<SmartTradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartTradeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
