import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit, OnDestroy {

  private userIdSub: Subscription;

  constructor(private walletService: WalletService) { }

  // userWallet = new BehaviorSubject<WalletI>({
  //   inr: '',
  //   gbp: '',
  //   usd: ''
  // })

  ngOnInit(): void {
    // this.userIdSub = this.walletService.userId.subscribe(data => {
    //   if (data) {
    //     console.log('#userIdInSub', data);
    //   }
    // })

    this.walletService.userWallet.subscribe(walletData => {
      console.log('#walletData', walletData);
    })

    this.userIdSub = this.walletService.userId.subscribe(data => {
      if (data) {
        console.log('#wallet OnInit', data);
        this.walletService.getUserWalletsDetails().subscribe(result => {
          console.log('##result', result);
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.userIdSub.unsubscribe();
  }
}
