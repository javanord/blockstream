import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from './shared/shared.module';
import { TokenizationComponent } from './components/tokenization/tokenization.component';
import { CustomerComponent } from './components/customer/customer.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SmartTradeComponent } from './components/smart-trade/smart-trade.component';
import { TradeBlotterComponent } from './components/trade-blotter/trade-blotter.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AdmindashboardComponent } from './components/admindashboard/admindashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TokenizationComponent,
    CustomerComponent,
    RegistrationComponent,
    SmartTradeComponent,
    TradeBlotterComponent,
    AdmindashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
