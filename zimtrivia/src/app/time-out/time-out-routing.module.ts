import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeOutPage } from './time-out.page';

const routes: Routes = [
  {
    path: '',
    component: TimeOutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeOutPageRoutingModule {}
