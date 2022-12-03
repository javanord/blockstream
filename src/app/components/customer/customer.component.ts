import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {
  logo:string ="https://cashflows-uat.traiana.com/web/uu/img/OSTTRA_Logo.PNG";

  constructor(private route:Router){
   
  }
  logout(){
    this.route.navigate(['/login']);
  }
}
