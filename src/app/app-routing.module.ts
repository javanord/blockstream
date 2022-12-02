import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './components/customer/customer.component';
import { LoginComponent } from './components/login/login.component';
import { TokenizationComponent } from './components/tokenization/tokenization.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SmartTradeComponent } from './components/smart-trade/smart-trade.component';
import { TradeBlotterComponent } from './components/trade-blotter/trade-blotter.component';

const routes: Routes = [
  {path:'',redirectTo:'/login',pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'customer', component: CustomerComponent ,children: [
    {path: '', redirectTo: 'tokenization', pathMatch: 'full'},
    {path: 'tokenization', component: TokenizationComponent},
    {path: 'smart-trade', component: SmartTradeComponent},
    {path:'trade-blotter',component:TradeBlotterComponent}
  ]},
  {path:'register',component:RegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
