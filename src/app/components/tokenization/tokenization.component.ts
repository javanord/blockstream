import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract.service';
import { CustomerService } from 'src/app/services/customer.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Currency } from 'src/models/currency.model';
import { getRandomInt, updateWallet } from 'src/utils/utils';
import { ethers} from "ethers";

@Component({
  selector: 'app-tokenization',
  templateUrl: './tokenization.component.html',
  styleUrls: ['./tokenization.component.css']
})
export class TokenizationComponent implements OnInit {
  public currenciesList: Currency[] = [{currencyName: 'INR', currencyCode: 'inr'}, {currencyName: 'GBP', currencyCode: 'gbp'}];
  public tokenForm!: FormGroup;
  public userForm: FormGroup;
  public usersList: any;
  public selectedUser: any;
  public depositUserData: any;

  public showWallet: boolean;

  private contractInstance: any;

  constructor(private customerService: CustomerService, private walletService: WalletService, private contractService: ContractService) {
    this.tokenForm = new FormGroup({
      depositCurr: new FormControl(null),
      depositAmount: new FormControl(''),
      // withdrawCurr: new FormControl(null),
      // withdrawAmount: new FormControl('')
    })

    this.userForm = new FormGroup({
      userList: new FormControl(null),
    })
  }

  async ngOnInit() {
    this.showWallet = false;

    this.contractService.tradeManagerContractInstance.subscribe(contractInstance => {
      this.contractInstance = contractInstance;
    })

    this.userForm.setValue({
      userList: 'Select User'
    });

    this.tokenForm.setValue({
      depositCurr: 'Select Currency',
      depositAmount: ''
    });

    try {
      this.customerService.getCurrencies().subscribe((currencies: any) => {
        this.currenciesList = currencies;
      })

      this.customerService.getUsers().subscribe((users: any) => {
        this.usersList = users;
      })

      this.userForm.valueChanges.subscribe(values => {
        const {userList} = values;
        if (userList) {
          this.showWallet = true;
          this.walletService.getUserWalletDetails(userList).subscribe((walletData: any) => {
            const updatedWallet = updateWallet(walletData);
            this.walletService.userWallet.next(updatedWallet);
          })

          this.selectedUser = this.usersList.find((user: any) => user.login === userList);
        }
      })
    } catch(err) {

    }
    
  }

  async depositWithdraw(action: string, loginId: string) {
    let payload;
    if(action == 'withdraw') {
      payload = {
        currencyCode: this.tokenForm.value['withdrawCurr'],
        amount: -this.tokenForm.value['withdrawAmount']
      }
    } else {
      payload = {
        currencyCode: this.tokenForm.value['depositCurr'],
        amount: +this.tokenForm.value['depositAmount'],
      }
    }
    console.log(payload);
    const formData = this.tokenForm.value;
    const p1Address = this.selectedUser.lastName;
    const decimals = 18;
    try {
      const amount = ethers.utils.parseUnits(formData.depositAmount, decimals);
      const currency = formData.depositCurr === 'INR' ? 0 : 1;
      const checkDeposit: boolean =  await this.contractInstance.depositeAmount(p1Address, currency, amount);
      if (checkDeposit) {
        this.customerService.depositWithdraw(payload, loginId).subscribe((walletData: any) => {
          const updatedWallet = updateWallet(walletData);
          this.walletService.userWallet.next(updatedWallet);
    
        })
      }
    } catch(err) {
      console.log('##error', err);
    }
  }
}
