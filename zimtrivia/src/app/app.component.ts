import { Component } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { initializeApp } from 'firebase';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor( private menu: MenuController, private splashScreen: SplashScreen, private platform: Platform) {
    this.splashScreen.show();
    // initializseApp();
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  closeMenu(){
    this.menu.close();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.show();
    });
  }
}

