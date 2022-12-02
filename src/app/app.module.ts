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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TokenizationComponent,
    CustomerComponent,
    RegistrationComponent,
    SmartTradeComponent,
    TradeBlotterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
