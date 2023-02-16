import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { CustomerService } from 'src/app/services/customer.service';
import { WalletService } from 'src/app/services/wallet.service';
import { updateWallet } from 'src/utils/utils';

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

  constructor(private customerService: CustomerService, private contractService: ContractService, private walletService: WalletService) {

  }

  ngOnInit(): void {
    this.customerService.getSmartTrades().subscribe((res: any) => {
      this.smartTradesList = res;
      this.smartTradesList = this.smartTradesList.map(trade => {
        return { ...trade, checked: false }
      })
    })

    this.loggedInUser = localStorage.getItem('loggedInUser') as string;
    if (this.loggedInUser) {
      this.walletService.userId.next(this.loggedInUser);
    }

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
  }

  public depositWithdraw(direction: string, trade: any, party: string) {
    let payload1;
    let payload2;
    if (party === 'TRADING') {
      if (direction === 'sell') {
        payload1 = {
          currencyCode: trade.currencyBuy,
          amount: -trade.amount
        }
        payload2 = {
          currencyCode: trade.currencySell,
          amount: trade.contraAmount
        }
      } else {
        payload1 = {
          currencyCode: trade.currencySell,
          amount: -trade.contraAmount
        }
        payload2 = {
          currencyCode: trade.currencyBuy,
          amount: trade.amount
        }
      }
    } else {
      if (direction === 'sell') {
        payload2 = {
          currencyCode: trade.currencySell,
          amount: -trade.contraAmount
        }
        payload1 = {
          currencyCode: trade.currencyBuy,
          amount: trade.amount
        }
      } else {
        payload1 = {
          currencyCode: trade.currencyBuy,
          amount: -trade.amount
        }
        payload2 = {
          currencyCode: trade.currencySell,
          amount: trade.contraAmount
        }
      }
    }

    return { payload1, payload2 };

  }

  public async settleTrade() {
    try {
      const selectedTradeId = this.selectedTrade.transactionId;
      if (selectedTradeId) {
        this.settleTradeResponse = await this.contractInstance.settleTrade(selectedTradeId);
        if (this.settleTradeResponse) {
          const payload = { id: this.selectedTrade.id, status: 'Settled' };
          this.customerService.settleSmartTrade(payload, this.selectedTrade.id).subscribe((response: any) => {
            this.smartTradesList = this.smartTradesList.map(trade => {
              if (trade.id === response.id) {
                return { ...trade, status: "Settled", checked: false };
              }
              return trade;
            });

            const { payload1: tradingPl1, payload2: tradingPl2 } = this.depositWithdraw(this.selectedTrade.direction, this.selectedTrade, 'TRADING');
            const { payload1: counterPl1, payload2: counterPl2 } = this.depositWithdraw(this.selectedTrade.direction, this.selectedTrade, 'COUNTER');
            console.log('##trading', tradingPl1, tradingPl2);
            console.log('##counet', counterPl1, counterPl2);
            const tradingLoginId = this.selectedTrade.tradingParty;
            
            this.customerService.depositWithdraw(tradingPl1, this.selectedTrade.tradingParty).subscribe(res => {
              console.log(res);
              this.customerService.depositWithdraw(tradingPl2, this.selectedTrade.tradingParty).subscribe(res => {
                console.log(res);
                this.walletService.getUserWalletsDetails().subscribe((result: any) => {
                  this.walletService.userWallet.next(updateWallet(result));
                })
              })
            })

           

            this.customerService.depositWithdraw(counterPl1, this.selectedTrade.counterParty).subscribe(res => {
              console.log(res);
              this.customerService.depositWithdraw(counterPl2, this.selectedTrade.counterParty).subscribe(res => {
                console.log(res);
              })
            })
          });
        }
      } else {
        console.log('##Transaction id not found');
      }
    } catch (err) {
      console.log('##settleTradeError', err);
    }
  }
}
