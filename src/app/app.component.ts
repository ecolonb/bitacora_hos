import { Component } from "@angular/core";

import { Platform, NavController, MenuController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";
import { UtilidadesService } from "./services/utilidades.service";
import { UiService } from "./services/ui.service";
import { LoginService } from "./services/login.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  public appMenu = [
    {
      title: "Aviso de privacidad",
      url: "/aviso-de-privacidad",
      icon: "md-information-circle"
    },
    {
      title: "Terminos y condiciones",
      url: "/terminos",
      icon: "ios-bookmark"
    },
    { title: "Recomendaciones", url: "/orders", icon: "md-help-buoy" }
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public navCtrl: NavController,
    private utilidadesService: UtilidadesService,
    private ui: UiService,
    private loginService: LoginService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      /**
       * Verficar el si ya acepto los terminos
       * Verficar si hay actividades pendientes por sincronizar
       *      ->Si hay actividades: sincronizar
       * Verificar localStorage si hay sesión activa
       *      ->Verificar SI está en servicio
       *          => Redirect actividades
       *      ->Si NO está en servicio => redirect(ConfiguracionServicio)
       *
       */

      this.loginService.authState.subscribe(authState => {
        if (authState) {
          this.ui.activeSideMenu();
          this.router.navigate(["tabs"], { replaceUrl: true });
        } else {
          this.router.navigate(["login"], { replaceUrl: true });
        }
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
    });
  }
  navToPage(UrlToNavigate: any) {
    console.log("NavTo: ", UrlToNavigate);
    this.router.navigateByUrl(UrlToNavigate);
  }
  logOut() {
    console.log("LogOut: ");
    this.router.navigate(["login"], { replaceUrl: true });
  }
  goBack() {
    // this.navCtrl.navigateBack('/route');
    this.navCtrl.navigateBack("/route");
  }

  // angular router replaceurl
}
