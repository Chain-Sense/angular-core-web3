import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/services/web3.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  qty:any=0;
  constructor(
    public web3 :Web3Service
  ) { }

 
  ngOnInit(): void {
    if(localStorage.getItem('addresses')){
      let temp = localStorage.getItem('addresses') || '';
      this.web3.addresses = JSON.parse(temp);
    }
  }
  connectWallet(){
    this.web3.connectWallet();
  }

  async geneRate(){
    if(this.qty)await this.web3.generateAccounts(this.qty);

  }

  async transfer(){
    let contractAddr = environment.ecr20Token;
    
    await this.web3.contractPayable('transfer', [this.web3.addresses[0].address,'1000000000000000000'],0, 'erc20Abi', contractAddr)

  }
}
