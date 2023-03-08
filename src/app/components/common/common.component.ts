import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss']
})
export class CommonComponent implements OnInit {

  constructor(public web3 :Web3Service) { }
  qty:any=0;
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
}
