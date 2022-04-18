import { Injectable } from '@angular/core';
import Web3 from 'web3';
const globalAny: any = window;
@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  constructor() { }

  async connectWallet(){
    if (globalAny.ethereum) {
      try {
        await globalAny.ethereum.enable().then(async function () {
          const web3 = new Web3(globalAny.web3.currentProvider);
          const userWalletAddressArray = await web3.eth.getAccounts();
        });
      } catch (error) {
        console.log(error);
      }
    }

  }
}
