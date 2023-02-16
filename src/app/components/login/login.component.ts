import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Roles } from 'src/app/enums/role.enum';
import { AuthService } from 'src/app/services/auth.service';
import { DecodeTokenService } from 'src/app/services/decode-token.service';
import { WalletService } from 'src/app/services/wallet.service';
import { ethers } from 'ethers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public loginForm!: FormGroup;
  imagineLogo: string = "assets/media/imagine.svg";
  private wind: any;

  constructor(private router: Router, private authService: AuthService, private decodeTokenService: DecodeTokenService, private walletService: WalletService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  public login() {
    const formVal = this.loginForm.value;

    this.authService.login(formVal.username, formVal.password).subscribe((data: any) => {
      const userData: any = this.decodeTokenService.decode(data['id_token']);
      localStorage.setItem('token', data['id_token']);
      if ((userData['auth'].includes(Roles.ROLE_ADMIN) && userData['sub'] === 'admin')) {
        this.router.navigate(['admin']);
      } else {
        this.router.navigate(['customer']);
      }

      this.authService.getUser(formVal.username).subscribe((res: any) => {
        localStorage.setItem('userHash', res['lastName']);
        localStorage.setItem('loggedInUser', res['login']);

        if (res?.id) {
          this.walletService.userId.next(res?.id);
        }
      })
    })
  }
}

