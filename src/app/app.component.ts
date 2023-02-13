import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { TRADE_MANAGER_V2_ADDRESS } from 'src/constants/contractaddresses';
import { TradeManagerv2Abi } from 'src/constants/TradeManagerv2.abi';
import { ContractService } from './services/contract.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'blockstream';
  private wind: any;
  public signer: any;
  public signerAddress: any;
  public balance: any;

  private contractInstance: any;

  constructor(private contractService: ContractService) {}

  async ngOnInit() {
    try {
      this.wind = window;

      const provider = new ethers.providers.Web3Provider(this.wind.ethereum, "any");
      console.log(provider);
      await provider.send("eth_requestAccounts", []);
      provider.on("network", (newNetwork: any, oldNetwork: any) => {
        console.log('network changed');
        if (oldNetwork) {
          window.location.reload();
        }
      });

      this.signer = provider.getSigner();
      this.signerAddress = await this.signer.getAddress();
      this.balance = await provider.getBalance(this.signerAddress);
      console.log(this.signerAddress);
      console.log(this.balance.toString());

      this.contractInstance = new ethers.Contract(TRADE_MANAGER_V2_ADDRESS, TradeManagerv2Abi, this.signer);
      console.log('##CI', this.contractInstance);
      this.contractInstance.connect(this.signer);

      this.contractService.tradeManagerContractInstance.next(this.contractInstance);

      // const output = await this.contractInstance.registerAccount('RBS', 'rbs_lei');
      // console.log('##output', output.hash);

    } catch (err) {
      console.log('Error', err);
    }
  }
}
