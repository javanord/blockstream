import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layouts/header/header.component';
import { SideMenuComponent } from './layouts/side-menu/side-menu.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SideMenuComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class SharedModule { }
