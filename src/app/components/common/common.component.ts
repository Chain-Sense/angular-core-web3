import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss']
})
export class CommonComponent implements OnInit {

  constructor(public web3 :Web3Service) { }

  ngOnInit(): void {
    this.web3.connectWallet();
  }

}
