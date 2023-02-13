import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract.service';
import { CustomerService } from 'src/app/services/customer.service';
import { WalletService } from 'src/app/services/wallet.service';
import { Currency } from 'src/models/currency.model';
import { getRandomInt } from 'src/utils/utils';

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

    this.depositUserData = {
      customer : {customerName : '' , customerLegalEntity : '', customerHashCode: '', id: '123@rew'}
    };

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
        console.log('##users', users);
        this.usersList = users;
      })

      this.userForm.valueChanges.subscribe(values => {
        const {userList} = values;
        if (userList) {
          this.showWallet = true;
          this.walletService.getUserWalletDetails(userList).subscribe((walletData: any) => {
            console.log('##walletData', walletData.length);
          })

          this.selectedUser = this.usersList.find((user: any) => user.login === userList);
          console.log('##selectedUser', this.selectedUser);

          this.depositUserData.customer.customerName = this.selectedUser.firstName;
          this.depositUserData.customer.customerLegalEntity = this.selectedUser.login;
          this.depositUserData.customer.customerHashCode = this.selectedUser.lastName;

          console.log('##depositUserData', this.depositUserData);
        }
        console.log('##values', values);
      })
  
      this.contractService.tradeManagerContractInstance.subscribe(async (tradeManagerContract) => {
        const randomInt = getRandomInt(1, 100);
        // const output = await tradeManagerContract.registerAccount(`RBS_${randomInt}`, 'rbs_lei');
        // console.log('##output', output.hash);
      });
    } catch(err) {

    }
    
  }

  depositWithdraw(action: string, selectedCustomerDetails: any, loginId: string) {
    console.log('##depositWithdraw', action);
    console.log(this.tokenForm.value);
    console.log('##selectedCustomerDetails', selectedCustomerDetails);
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
        // ...selectedCustomerDetails
      }
      // payload = selectedCustomerDetails;
    }
    console.log(payload)
    this.customerService.depositWithdraw(payload, loginId).subscribe((res: any) => {
      // const { currencyCode, amount } = res;
      // console.log('##depositWithdrawSub', currencyCode, amount);
      // this.walletService.currencyAmount.next({
      //   currencyCode,
      //   amount,
      //   transType: action === 'withdraw' ? 'withdraw' : 'deposit',
      // })
      console.log(res);
    })
  }
}
