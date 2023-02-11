import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';

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

  async ngOnInit() {
    this.wind = window;
    console.log(this.wind.ethereum);

    const provider = new ethers.providers.Web3Provider(this.wind.ethereum, "any");
    console.log(provider);
    await provider.send("eth_requestAccounts", []);
    provider.on("network", (newNetwork: any, oldNetwork: any) => {
      console.log('network changed');
      if(oldNetwork) {
        window.location.reload();
      }
    });

    this.signer = provider.getSigner();
    this.signerAddress = await this.signer.getAddress();
    console.log(this.signerAddress);
  }
}
