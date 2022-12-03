import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { Currency } from 'src/models/currency.model';

@Component({
  selector: 'app-smart-trade',
  templateUrl: './smart-trade.component.html',
  styleUrls: ['./smart-trade.component.css']
})
export class SmartTradeComponent implements OnInit {
  usersList!: any[];
  currenciesList!: Currency[];
  smartTradeForm!: FormGroup;

  constructor(private customerService: CustomerService) {
    this.smartTradeForm = new FormGroup({
      counterParty: new FormControl(null),
      currencyBuy: new FormControl(0),
      currencySell: new FormControl(0),
      rate: new FormControl(),
      amount: new FormControl(),
      contraAmount: new FormControl(),
      valueDate: new FormControl(''),
      transactionId: new FormControl(''),
      direction: new FormControl('')
    })
  }

  ngOnInit(): void {
    this.customerService.getUsers().subscribe((res: any) => {
      this.usersList = res;
    });
    this.customerService.getCurrencies().subscribe((currencies: any) => {
      this.currenciesList = currencies;
    })
  }

  submitSmartTrade() {
    const formData = this.smartTradeForm.value;
    this.customerService.submitSmartTrade(formData).subscribe(res => {
      alert('Smart trade submitted successfully');
      this.smartTradeForm
    });
  }

}
