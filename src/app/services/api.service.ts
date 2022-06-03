import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  exchanges:any;

  constructor() { }

  async getExchangesList(){
    return await axios.get(environment.baseCoinGecho+'/exchanges');
  }
}
