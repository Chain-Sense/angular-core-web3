import { ApplicationRef, Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { environment } from 'src/environments/environment';
import { erc20abi } from '../../assets/abi/erc20abi';
import Web3 from 'web3';
const globalAny: any = window;
@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  public userWalletAddress: any;
  public networkId: any;
  public displayAddress: any;
  public addresses:any=[];
  activeTransact: boolean = false;
  public erc20Abi: any =erc20abi ;
  constructor(
    private changeDetectorRef: ApplicationRef,
    private toastrService: NbToastrService
    ) { 
    
  }

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
                that.toastrService.danger('Please Select BSC Testnet','Attention');

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
                  that.toastrService.danger('Please Select BSC Testnet','Attention');

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
            that.toastrService.danger('Please Login to MetaMask','Attention');
          }
        });
      } catch (e) {
        console.log('error==>', e);
      }
    } else if (globalAny.web3) {
      const web3 = new Web3(globalAny.web3.currentProvider);
    } else {
      that.toastrService.danger('Please install MetaMask','Attention');
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

  async generateAccounts(qty:any) {
    let that = this;
    if (globalAny.ethereum) {
      const web3 = new Web3(globalAny.web3.currentProvider);
      this.addresses=[];
      for(let i=0; i<qty;i++){
        let temp  = await web3.eth.accounts.create();
        console.log(temp);
        this.addresses.push(temp)
        
      }
      localStorage.setItem('addresses',JSON.stringify(this.addresses));
      that.toastrService.success('Address Generated','Success');
      this.changeDetectorRef.tick();

    
    }
  }

  async contractCallWithParam(fn: string | number, param: any[], contractabi: any, address: string | undefined) {
    return new Promise(async (resolve, reject) => {
      const web3 = new Web3(globalAny.web3.currentProvider);
      let account = await web3.eth.getAccounts();
      const index = param.findIndex((x: boolean) => x === true);
      param[index] = account[0];
      let exactABI;

      switch (contractabi) {
        case 'erc20Abi':
          exactABI = this.erc20Abi.abi;
          break;
      }

      const contract = new web3.eth.Contract(exactABI, address);

      contract.methods[fn](...param)
        .call()
        .then((res: unknown) => {
          resolve(res);
        });
    });
  }

  async contractCall(fn: string | number, param: any[], contractabi: any, address: string | undefined) {
    return new Promise(async (resolve, reject) => {
      const web3 = new Web3(globalAny.web3.currentProvider);
      let account = await web3.eth.getAccounts();
      const index = param.findIndex((x: boolean) => x === true);
      param[index] = account[0];
      let exactABI;

      switch (contractabi) {
        case 'erc20Abi':
          exactABI = this.erc20Abi.abi;
          break;
      }

      const contract = new web3.eth.Contract(exactABI, address);

      contract.methods[fn]()
        .call({ from: account[0] })
        .then((res: unknown) => {
          resolve(res);
        });
    });
  }

  async contractPayable(fn: any, param: any[], value: any, contractabi: any, address: string | undefined) {
    console.log('param==>', param);
    console.log('value==>', value);
    return new Promise(async (resolve, reject) => {
      const web3 = new Web3(globalAny.web3.currentProvider);
      let account = await web3.eth.getAccounts();
      const index = param.findIndex((x: boolean) => x === true);
      param[index] = account[0];
      let exactABI;
      switch (contractabi) {
        case 'erc20Abi':
          exactABI = this.erc20Abi.abi;
          break;
      }

      const contract = new web3.eth.Contract(exactABI, address);

      contract.methods[`${fn}`](...param)
        .send({ from: account[0], value }, function (err: any, TxHash: any) { })
        .on('receipt', function (receipt: any) {
          resolve(receipt);
        })
        .catch((e: { message: any; }) => {
          let err = e.message;
          resolve(err);
        });
    });
  }

}
