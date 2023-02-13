import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Wallet } from 'src/models/wallet.model';
import { WalletDetails } from 'src/models/walletdetails.model';
import { WalletService } from 'src/app/services/wallet.service';
import { updateWallet, findCurrency } from 'src/utils/utils';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit, OnDestroy {

  private userIdSub: Subscription;
  private userWalletSub: Subscription;
  private currencyAmountSub: Subscription;

  constructor(private walletService: WalletService) { }

  userWallet: Wallet;

  ngOnInit(): void {
    this.userWalletSub = this.walletService.userWallet.subscribe(walletData => {
      const {inr, gbp} = walletData;
      this.userWallet = {
        inr,
        gbp
      };
    })

    this.currencyAmountSub = this.walletService.currencyAmount.subscribe(data => {
      const { currencyCode, amount, transType } = data;
      if (currencyCode && transType) {
        const updatedUserWallet = findCurrency(this.userWallet, currencyCode, amount, transType);
        this.walletService.userWallet.next(updatedUserWallet);
      }
    });

    this.userIdSub = this.walletService.userId.subscribe(data => {
      if (data) {
        this.walletService.getUserWalletsDetails().subscribe((result: any) => {
          console.log('#result', result);
          // this.userWallet = updateWallet(result);
          this.walletService.userWallet.next(updateWallet(result));
          console.log('#userWallet', this.userWallet);
          const { currencyCode, amount } = result;
          if (currencyCode) {
            const lowerCaseCC = currencyCode.toLowerCase();
            // findCurrency(this.userWallet, lowerCaseCC, amount);
            // console.log('##userWallet', this.userWallet);
          }
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.userIdSub.unsubscribe();
    this.currencyAmountSub.unsubscribe();
    this.userWalletSub.unsubscribe();
  }
}
