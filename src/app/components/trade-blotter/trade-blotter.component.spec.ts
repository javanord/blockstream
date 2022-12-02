import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeBlotterComponent } from './trade-blotter.component';

describe('TradeBlotterComponent', () => {
  let component: TradeBlotterComponent;
  let fixture: ComponentFixture<TradeBlotterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradeBlotterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeBlotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
