import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const apiEndpoints = {}

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  
    tradeManagerContractInstance = new BehaviorSubject<any>('');
}
