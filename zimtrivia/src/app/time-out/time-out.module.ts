import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeOutPageRoutingModule } from './time-out-routing.module';

import { TimeOutPage } from './time-out.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeOutPageRoutingModule
  ],
  declarations: [TimeOutPage]
})
export class TimeOutPageModule {}
