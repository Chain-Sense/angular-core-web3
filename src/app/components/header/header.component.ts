import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  items: NbMenuItem[] = [
    {
      title: 'Profile',
      icon: 'person-outline',
    },
    {
      title: 'Change Password',
      icon: 'lock-outline',
    },
    {
      title: 'Privacy Policy',
      icon: { icon: 'checkmark-outline', pack: 'eva' },
    },
    {
      title: 'Logout',
      icon: 'unlock-outline',
    },
  ];
  constructor(public web3 :Web3Service) { }

  ngOnInit(): void {
  }
  connectWallet(){
    this.web3.connectWallet();
  }
}
