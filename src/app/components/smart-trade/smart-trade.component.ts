import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { Currency } from 'src/models/currency.model';
import { DatePipe } from '@angular/common';
import { ContractService } from 'src/app/services/contract.service';
import { ethers } from 'ethers';
import { from, switchMap } from 'rxjs';
import { map } from 'rxjs/operators'

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
  directionList !: [{ direction: 'BUY' }, { direction: 'SELL' }];
  private tradeContractInstance: any;

  constructor(private customerService: CustomerService, private datePipe: DatePipe, private contractService: ContractService) {

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

    this.contractService.tradeManagerContractInstance.subscribe(contractInstance => {
      this.tradeContractInstance = contractInstance as any;

      // this.tradeContractInstance.on("NewTradeCreated", (from: any, to: any, tradeHash: any, state: any) => {
      //   console.log('##NewTradeCreated from', from);
      //   console.log('##NewTradeCreated to', to);
      //   console.log('##NewTradeCreated tradeHash', tradeHash);
      //   console.log('##NewTradeCreated state', state);
      // });
    })
  }

  async submitSmartTrade() {
    try {
      const formData = this.smartTradeForm.value;
      console.log('##formData', formData);
      const p1 = localStorage.getItem('userHash');
      const p2 = this.usersList.find(user => user.login === formData.counterParty).lastName;
      // const p2 = '0x91cD3e2d165E49970304c0a2c8BE24eDCdc90764';

      let buyCurr;
      let sellCurr;
      let notional;
      let contraNotional;
      let direction = formData.direction;
      let valueDate = formData.valueDate;
      let rate = formData.rate.toString();
      if (formData.direction.toLowerCase() === 'buy') {
        buyCurr = formData.currencyBuy === 'INR' ? 0 : 1;
        sellCurr = formData.currencySell === 'INR' ? 0 : 1;
        notional = formData.amount;
        contraNotional = formData.contraAmount, 18;
      } else {
        sellCurr = formData.currencyBuy === 'INR' ? 0 : 1;
        buyCurr = formData.currencySell === 'INR' ? 0 : 1;
        notional = formData.contraAmount;
        contraNotional = formData.amount;
      }


      console.log('##p1 and p2', p1, p2);
      console.log('##rate', rate, typeof rate);
      console.log('##direction', direction);
      console.log('##valueDate', valueDate);
      console.log('##buy and sell curr', buyCurr, sellCurr);
      console.log('##notional and contranotional curr', notional, contraNotional);
      console.log('##contractInstanceNew', this.tradeContractInstance);

      const res = await this.tradeContractInstance.createTrade(p1, p2, direction, rate, buyCurr, sellCurr, notional, contraNotional, valueDate, valueDate);
      const txReceipt = await res.wait();
      const tradeId = txReceipt.events[0].args._tradeId;
      // console.log('##txReceipt', txReceipt.events[0].args._tradeId);
      // console.log('##res', res);
      const tradeHash = res.hash;

      const loggedInUser = localStorage.getItem('loggedInUser');
      const curtDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.customerService
        .submitSmartTrade({ ...formData, tradingParty: loggedInUser, tradeDate: curtDate, status: 'Submitted', transactionId: tradeId })
        .subscribe((res: any) => {
          alert('Smart trade submitted successfully, TradeId: ' + tradeHash);
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
    } catch (err) {
      console.log('##createTrade error', err);
    }
  }
}
