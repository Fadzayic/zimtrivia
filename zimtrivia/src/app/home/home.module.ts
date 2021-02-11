import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../../environments/environment';
import {
  AngularFireDatabase,
  AngularFireDatabaseModule } from 'angularfire2/database';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFireDatabaseModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage],
  providers: [AngularFireDatabase]
})
export class HomePageModule {}
