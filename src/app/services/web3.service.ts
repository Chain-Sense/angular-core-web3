import { ApplicationRef, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
const globalAny: any = window;
@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  public userWalletAddress: any;
  public networkId: any;
  public displayAddress: any;
  activeTransact: boolean = false;
  
  constructor(private changeDetectorRef: ApplicationRef) { }

  async connectWallet() {
    let that = this;
    if (globalAny.ethereum) {
      try {
        await globalAny.ethereum.enable().then(async function () {
          const web3 = new Web3(globalAny.web3.currentProvider);
          const userWalletAddressArray = await web3.eth.getAccounts();

          if (userWalletAddressArray.length > 0) {
            that.userWalletAddress = userWalletAddressArray[0];
            that.displayAddress = await that.truncStringPortion(
              that.userWalletAddress,
              4,
              4,
              3
            );

            await web3.eth.net.getId().then(async (network: any) => {
              that.networkId = network;
              if (that.networkId != environment.network) {
                alert('Please Select Goerli testNet');
                that.activeTransact = false;
              } else {
                that.activeTransact = true;
              }
            });

            await globalAny.ethereum.on(
              'chainChanged',
              async function (network: any) {
                that.networkId = parseInt(network, 16);
                if (that.networkId != environment.network) {
                  alert('Please Select Goerli testNet');

                  that.userWalletAddress = '';
                  that.displayAddress = ''
                  that.changeDetectorRef.tick()
                  that.activeTransact = false;
                } else {

                  that.activeTransact = true;
                }
              }
            );

            await globalAny.ethereum.on(
              'accountsChanged',
              async function (accounts: any) {
                window.location.reload();
                if (!accounts[0]) {
                  that.userWalletAddress = '';
                  that.displayAddress = ''
                  that.changeDetectorRef.tick()
                  return;
                }
                that.userWalletAddress = accounts[0];
                that.displayAddress = await that.truncStringPortion(
                  that.userWalletAddress,
                  4,
                  4,
                  3
                );

                that.changeDetectorRef.tick()
              }
            );
            that.changeDetectorRef.tick();
          } else {
            alert('Please Login to MetaMask');
          }
        });
      } catch (e) {
        console.log('error==>', e);
      }
    } else if (globalAny.web3) {
      const web3 = new Web3(globalAny.web3.currentProvider);
    } else {
      alert('Please install MetaMask');
    }
  }

  async truncStringPortion(
    str: any,
    firstCharCount = str.length,
    endCharCount = 0,
    dotCount = 3
  ) {
    var convertedStr = '';
    convertedStr += str.substring(0, firstCharCount);
    convertedStr += '.'.repeat(dotCount);
    convertedStr += str.substring(str.length - endCharCount, str.length);
    return convertedStr;
  }

}
