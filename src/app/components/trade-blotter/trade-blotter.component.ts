import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-trade-blotter',
  templateUrl: './trade-blotter.component.html',
  styleUrls: ['./trade-blotter.component.css']
})
export class TradeBlotterComponent implements OnInit {
  smartTradesList!: any[];
  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerService.getSmartTrades().subscribe((res: any) => {
      this.smartTradesList = res;
    })
  }
}
