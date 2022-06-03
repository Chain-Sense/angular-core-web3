import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public apiService:ApiService
  ) { }

  ngOnInit(): void {
    this.apiService.getExchangesList().then(res=>{
      console.log(res);
      this.apiService.exchanges = res.data;
    }).catch(err=>{
      console.log(err);
    });
  }

}
