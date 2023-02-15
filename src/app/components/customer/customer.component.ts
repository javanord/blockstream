import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  logo:string ="https://cashflows-uat.traiana.com/web/uu/img/OSTTRA_Logo.PNG";
  loggedInUserName: string = '';

  constructor(private route:Router){
   
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loggedInUserName = localStorage.getItem('loggedInUser') as string;
    }, 500)
    
  }

  logout(){
    this.route.navigate(['/login']);
  }
}
