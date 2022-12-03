import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  imagineLogo:string = "assets/media/imagine.svg";
  public customerForm!: FormGroup;

  constructor(private route:Router, private authService: AuthService){
    this.customerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      login: new FormControl('', Validators.required)
    })
  }

  register() {
    const formData = this.customerForm.value;
    this.authService.createUser(formData).subscribe((res) => {
      console.log(res);
    });
  }

  logout(){
    this.route.navigate(['/login']);
  }
}
