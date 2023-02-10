import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { Currency } from 'src/models/currency.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-smart-trade',
  templateUrl: './smart-trade.component.html',
  styleUrls: ['./smart-trade.component.css'],
  providers: [DatePipe]
})
export class SmartTradeComponent implements OnInit {
  usersList!: any[];
  currenciesList!: Currency[];
  smartTradeForm!: FormGroup;
  directionList !: [{direction : 'BUY'}, {direction: 'SELL'}];
  
  constructor(private customerService: CustomerService, private datePipe: DatePipe) {
    
    this.smartTradeForm = new FormGroup({
      counterParty: new FormControl(null),
      currencyBuy: new FormControl(0),
      currencySell: new FormControl(0),
      rate: new FormControl(),
      amount: new FormControl(),
      contraAmount: new FormControl(),
      valueDate: new FormControl(''),
      transactionId: new FormControl(''),
      direction: new FormControl(''),
    });
  }

  ngOnInit(): void {
    
    this.customerService.getUsers().subscribe((res: any) => {
      this.usersList = res;
    });
    this.customerService.getCurrencies().subscribe((currencies: any) => {
      this.currenciesList = currencies;
    });
  }

  submitSmartTrade() {
    const formData = this.smartTradeForm.value;
    const userHash = localStorage.getItem('userHash');
    const curtDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd'); 
    this.customerService
      .submitSmartTrade({ ...formData, tradingParty: userHash, tradeDate: curtDate, status: 'Submitted' })
      .subscribe((res) => {
        alert('Smart trade submitted successfully');
        this.smartTradeForm.patchValue({
          counterParty: null,
          currencyBuy: 0,
          currencySell: 0,
          rate: '',
          amount: 0,
          contraAmount: 0,
          valueDate: '',
          transactionId: '',
          direction: '',
        });
      });
  }
}
