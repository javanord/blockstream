import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Wallet } from 'src/models/wallet.model';
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

  @Input() isAdmin: boolean = false;

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
      if (data && !this.isAdmin) {
        this.walletService.getUserWalletsDetails().subscribe((result: any) => {
          this.walletService.userWallet.next(updateWallet(result));
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
