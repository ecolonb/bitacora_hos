import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { UtilidadesService } from './services/utilidades.service'


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appMenu = [
    { title: 'Aviso de privacidad', url: '/profile', icon: 'md-information-circle' },
    {
      title: 'Terminos y condiciones', url: '/cocas', icon: 'ios-bookmark'
    },
    { title: 'Recomendaciones', url: '/orders', icon: 'md-help-buoy' }
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public navCtrl: NavController,
    private utilidadesService: UtilidadesService
  ) {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      console.log('-->>>', this.utilidadesService.isoStringToSQLServerFormat(new Date().toISOString()));

    });
  }
  navToPage(UrlToNavigate: any) {
    console.log('NavTo: ', UrlToNavigate);
    this.router.navigate([UrlToNavigate]);
  }
  logOut() {
    console.log('LogOut: ');
    this.router.navigate(['login']);
  }
  goBack() {
    // this.navCtrl.navigateBack('/route');
    this.navCtrl.navigateBack('/route');
  }
}
