import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  imagineLogo:string = "assets/media/imagine.svg";
  constructor(private router: Router) {}

  submit() {
    this.router.navigate(['customer'])
}
}

