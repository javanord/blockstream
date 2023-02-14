import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { ContractService } from 'src/app/services/contract.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-trade-blotter',
  templateUrl: './trade-blotter.component.html',
  styleUrls: ['./trade-blotter.component.css']
})
export class TradeBlotterComponent implements OnInit {
  smartTradesList!: any[];
  selectedTrade: any;
  loggedInUser: string = '';
  settleTradeResponse: any;

  private contractInstance: any;

  constructor(private customerService: CustomerService, private contractService: ContractService) { }

  ngOnInit(): void {
    this.customerService.getSmartTrades().subscribe((res: any) => {
      this.smartTradesList = res;
      this.smartTradesList = this.smartTradesList.map(trade => {
        return { ...trade, checked: false }
      })

      console.log('##smartTradeList', this.smartTradesList);
    })

    this.loggedInUser = localStorage.getItem('loggedInUser') as string;

    this.contractService.tradeManagerContractInstance.subscribe(contractInstance => {
      this.contractInstance = contractInstance;
    })
  }

  public toggleCheckbox(tradeId: string): void {
    this.selectedTrade = this.smartTradesList.find(trade => trade.id === tradeId);

    if (this.selectedTrade.checked) {
      this.selectedTrade = null;
      this.smartTradesList = this.smartTradesList.map(trade => {
        if (trade.id === tradeId) {
          return { ...trade, checked: false };
        }
        return { ...trade };
      })
    } else {
      this.smartTradesList = this.smartTradesList.map(trade => {
        let checked;
        if (trade.id === tradeId) {
          checked = true;
        } else {
          checked = false;
        }
        return { ...trade, checked };
      })
    }


    console.log('##selectedTrade', this.selectedTrade);
  }

  public async settleTrade() {
    try {
      const selectedTradeId = this.selectedTrade.transactionId;
      console.log('##selectedTradeId', selectedTradeId, typeof selectedTradeId);
      if (selectedTradeId) {
        this.settleTradeResponse = await this.contractInstance.settleTrade(selectedTradeId);
        console.log('##settleTradeResponse', this.settleTradeResponse);
        this.smartTradesList = this.smartTradesList.map(trade => {
          if (trade.transactionId === selectedTradeId) {
            trade.status = "Settled";
          }
          return trade;
        })
      } else {
        console.log('##Transaction id not found');
      }
    } catch (err) {
      console.log('##settleTradeError', err);
    }
  }
}
