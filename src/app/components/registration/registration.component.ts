import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  imagineLogo:string = "assets/media/imagine.svg";
  public customerForm!: FormGroup;

  private contractInstance: any;

  constructor(private route:Router, private authService: AuthService, private contractService: ContractService){
    this.customerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      login: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    this.contractService.tradeManagerContractInstance.subscribe(contractInstance => {
      this.contractInstance = contractInstance;
    })
  }

  async register() {
    const formData = this.customerForm.value;
    console.log('##registerFormData', formData);
    const accountId = formData.lastName;
    const output = await this.contractInstance.registerAccount(accountId, 'lei');
    console.log('##output', output);
    this.authService.createUser(formData).subscribe((res: any) => {
      if(res?.login) {
        alert(res?.firstName + ' created successfully');
        this.customerForm.patchValue({
          firstName: '',
          email: '',
          login: '',
          lastName: '',
        })
      }
    });
  }

  logout(){
    this.route.navigate(['/login']);
  }
}
