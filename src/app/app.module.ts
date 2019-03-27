


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClientModule } from '@angular/common/http';
// import { BitacoraService } from '../../services/bitacora.service';
// import { LoginService } from '../../services/login.service';
// import { UtilidadesService} from '../../services/utilidades.service';
import { BitacoraService } from './services/bitacora.service';
import { LoginService } from './services/login.service';
import { UtilidadesService } from './services/utilidades.service';
import { AppConfiguracionService } from './services/app-configuracion.service';
import { UnidadService } from './services/unidad.service';
import { ConductorService } from './services/conductor.service';
import { SyncUpService } from './services/sync-up.service';
import { UsuarioService } from './services/usuario.service';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot(), HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    BitacoraService,
    LoginService,
    UtilidadesService,
    AppConfiguracionService,
    UnidadService,
    ConductorService,
    UsuarioService,
    SyncUpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
