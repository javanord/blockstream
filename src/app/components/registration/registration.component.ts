import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  imagineLogo:string = "assets/media/imagine.svg";
  constructor(private route:Router){

  }
  logout(){
    this.route.navigate(['/login']);
  }
}
