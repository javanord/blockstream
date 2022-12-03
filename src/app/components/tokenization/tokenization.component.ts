import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { Currency } from 'src/models/currency.model';

@Component({
  selector: 'app-tokenization',
  templateUrl: './tokenization.component.html',
  styleUrls: ['./tokenization.component.css']
})
export class TokenizationComponent implements OnInit {
  public currenciesList: Currency[] = [{currencyName: 'INR', currencyCode: 'inr'}, {currencyName: 'GBP', currencyCode: 'gbp'}];
  public tokenForm!: FormGroup;

  constructor(private customerService: CustomerService) {
    this.tokenForm = new FormGroup({
      depositCurr: new FormControl(null),
      depositAmount: new FormControl(0),
      withdrawCurr: new FormControl(''),
      withdrawAmount: new FormControl(0)
    })
  }

  ngOnInit(): void {
    this.customerService.getCurrencies().subscribe((currencies: any) => {
      this.currenciesList = currencies;
    })
  }

  depositWithdraw(action: string) {
    console.log(this.tokenForm.value)
    let payload;
    if(action == 'withdraw') {
      payload = {
        currencyCode: this.tokenForm.value['withdrawCurr'],
        amount: -this.tokenForm.value['withdrawAmount']
      }
    } else {
      payload = {
        currencyCode: this.tokenForm.value['depositCurr'],
        amount: +this.tokenForm.value['depositAmount']
      }
    }
    console.log(payload)
    this.customerService.depositWithdraw(payload).subscribe((res) => {
      console.log(res);
    })
  }
}
