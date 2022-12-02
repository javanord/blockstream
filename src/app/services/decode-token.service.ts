import { Inject, Injectable, InjectionToken } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

const JWTHELPER = new InjectionToken<JwtHelperService>(
  'JwtHelperService',
  {
    providedIn: 'root',
    factory: () => {
      return new JwtHelperService()
    }
  }
)

@Injectable({
  providedIn: 'root'
})
export class DecodeTokenService {

  constructor(@Inject(JWTHELPER) private jwtHelper: JwtHelperService) { }

  decode(token: string) {
    return this.jwtHelper.decodeToken(token);
  }
}
