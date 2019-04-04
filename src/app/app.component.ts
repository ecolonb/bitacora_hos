import { Component } from '@angular/core';

import {
  Platform,
  NavController,
  MenuController,
  AlertController,
  LoadingController
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { UtilidadesService } from './services/utilidades.service';
import { UiService } from './services/ui.service';
import { LoginService } from './services/login.service';
import { BitacoraService } from './services/bitacora.service';
import { UnidadService } from './services/unidad.service';
import { UsuarioService } from './services/usuario.service';
import { ConductorService } from './services/conductor.service';
import { LocalTimeActivitysService } from './services/local-time-activitys.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appMenu = [
    {
      title: 'Aviso de privacidad',
      url: '/aviso-de-privacidad',
      icon: 'md-information-circle'
    },
    {
      title: 'Terminos y condiciones',
      url: '/terminos',
      icon: 'ios-bookmark'
    },
    { title: 'Recomendaciones', url: '/orders', icon: 'md-help-buoy' }
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public navCtrl: NavController,
    private utilidadesService: UtilidadesService,
    private ui: UiService,
    private loginService: LoginService,
    private bitacoraService: BitacoraService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private unidadService: UnidadService,
    private usuarioService: UsuarioService,
    private conductorService: ConductorService,
    private localTimeActivitysService: LocalTimeActivitysService
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
      this.loginService
        .cargarStorage()
        .then(resultProm => {
          console.log('resultProm:_ ', resultProm);
          this.usuarioService.cargarStorage().then(() => {
            // Información del usuario cargada Validar Sesion Status -> Redirect
            this.bitacoraService
              .getBitacoraFromStorage()
              .then(() => {
                // se obtiene la información de la Bitácora desde el localStorage
                // ****** si no esta en servicio o configuración de ultimo servicio solicitar configuracion
                // this.rootPage = MenuPage;
                // Se obtiene la configuracion del Servicio
                this.bitacoraService.cargarServicioFromStorage().then(() => {
                  try {
                    if (
                      this.bitacoraService.StatusServicio !== null &&
                      this.bitacoraService.StatusServicio !== undefined
                    ) {
                      if (
                        this.bitacoraService.StatusServicio.Terminado === false
                      ) {
                        this.conductorService
                          .getConductorDataStorage()
                          .then(() => {
                            this.localTimeActivitysService
                              .activitysSeparator()
                              .then(() => {
                                // console.log(
                                //   'activitysSeparator -------------> OK'
                                // );
                                this.loginService.pageRedirect = 'actividades';
                                this.bitacoraService.resetServicicio();
                                //  this.rootPage = MenuPage;
                                //  statusBar.styleDefault();
                                //  splashScreen.hide();
                              })
                              .catch(() => {});
                          })
                          .catch(() => {});

                        // this.rootPage = this.configuracionServicioPage;
                      } else {
                        // console.log(
                        //   'En este   punto traer información del día actual y día anterior'
                        // );
                        console.log('No esta en service....');
                        this.loginService.pageRedirect = 'actividades';
                        this.conductorService
                          .getConductorDataStorage()
                          .then(() => {
                            this.localTimeActivitysService
                              .getDataFromServer(false)
                              .then(ResposeData => {})
                              .catch(ErrorRequest => {});
                            //  this.rootPage = this.configuracionServicioPage;
                            //  statusBar.styleDefault();
                            //  splashScreen.hide();
                          });
                      }
                    } else {
                      // console.log(
                      //   'En este   punto traer información del día actual y día anterior'
                      // );

                      this.conductorService
                        .getConductorDataStorage()
                        .then(() => {
                          this.localTimeActivitysService
                            .getDataFromServer(false)
                            .then(ResposeData => {
                              // console.log('ResposeData:', ResposeData);
                            })
                            .catch(ErrorRequest => {
                              // console.log('ResposeData:', ErrorRequest);
                            });
                          //  this.rootPage = this.configuracionServicioPage;
                          //  statusBar.styleDefault();
                          //  splashScreen.hide();
                        });
                    }
                    // TEST redirect
                    console.log('No esta en service....');
                    // this.loginService.pageRedirect = 'actividades';
                    // Dejar esto al final de todas las promesas ressueltas
                    this.loginService.authState.subscribe(authState => {
                      if (authState) {
                        this.ui.activeSideMenu();
                        // Check si esta en Servicio redireccionar a actividades
                        if (
                          this.loginService.pageRedirect === 'ServiceConfig'
                        ) {
                          this.router.navigate(
                            ['app', 'configuracion-servicio'],
                            {
                              replaceUrl: true
                            }
                          );
                        } else {
                          this.router.navigate(['tabs', 'actividades'], {
                            replaceUrl: true
                          });
                        }
                      } else {
                        this.router.navigate(['login'], { replaceUrl: true });
                      }
                      this.statusBar.styleDefault();
                      this.splashScreen.hide();
                    });
                    // End subscribe
                  } catch (error) {}
                });
              })
              .catch(err => {
                // Si hay un error al cargar la bitácora muestra la pagína principal, si la fecha actual es igual
                // a la bitácora almacenada mostrar los datos del localStorage
                this.loginService.setActivo(false);
                // this.rootPage = LoginPage;
                //  statusBar.styleDefault();
                //  splashScreen.hide();
              });
          });
        })
        .catch(() => {
          console.log('Error load storage!');
        });
    });
  }
  navToPage(UrlToNavigate: any) {
    console.log('NavTo: ', UrlToNavigate);
    this.router.navigateByUrl(UrlToNavigate);
  }
  async logOut() {
    console.log('LogOut: ');
    // this.router.navigate(['login'], { replaceUrl: true });
    const alert = await this.alertController.create({
      header: '¿Cerrar sesión?',
      message:
        'Al cerrar sesión, terminaras tu servicio y todas las actividades en progreso. <p>¿Realmente deseas cerrar sesión?</p>',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel-->>>: blah');
          }
        },
        {
          text: 'Si',
          handler: async () => {
            console.log('Confirm Okay===============>>>> CERAR SESION');
            await this.logOutConfirmAction();
          }
        }
      ]
    });

    await alert.present();
  }
  async logOutConfirmAction() {
    const loading = await this.loadingController.create({
      message:
        'Obteniendo posición y sincronizando información, por favor espere...'
    });
    await loading.present();
    // Cerrando session
    this.bitacoraService
      .terminarServicio()
      .then(() => {
        this.loginService.cerrarSesion().then(() => {
          console.log('Terminar servicio Ok:_===>>>>>');
          loading.dismiss();
          // this.app.getRootNavs()[0].setRoot(this.loginPage);
          delete this.bitacoraService.BitacoraData;
          // delete this.bitacoraService.StatusServicio;
          // delete this.bitacoraService.objConfServicio;
          this.loginService.setActivo(false);
          this.bitacoraService.strHoras = '00';
          this.bitacoraService.strMinutos = ':00';
          this.bitacoraService.strSegundos = ':00';
          this.bitacoraService.strHorasExcepcion = '00';
          this.bitacoraService.strSegundosExcepcion = ':00';
          this.bitacoraService.segundosConduccionHhmmss = '00:00:00';
          this.bitacoraService.segundosDescansoHhmmss = '00:00:00';
          this.bitacoraService.strHorasServicio = '00';
          this.bitacoraService.strMinutosServicio = ':00';
          this.bitacoraService.strSegundosServicio = ':00';
          this.bitacoraService.segundosConduccionStorage = 0;
          this.bitacoraService.segundosDescansoStorage = 0;
          this.bitacoraService.segundosConduccion = 0;
          this.bitacoraService.segundosDescanso = 0;
          this.bitacoraService.haveElements = false;
          // this.bitacoraService.stora
          this.bitacoraService.stExepcionTemporal = false;
          this.bitacoraService.ExcepcionTemporal = false;
          this.bitacoraService.stInProgress = false;
          this.unidadService.cargarFromStorage = true;
          this.loginService.setAuthenticate(false);
        });
        // redirect configuracion nuevo servicio
      })
      .catch(err => {
        console.log(
          'aaaaaaabbbccccdddXXXXxxXX xxxokxxxokCATCHxxCATCHErro al cerrar sesion...............catch',
          err
        );
        this.loginService
          .cerrarSesion()
          .then(() => {
            loading.dismiss();
            try {
              clearInterval(this.bitacoraService.ctrlTimerServicio);
              clearInterval(this.bitacoraService.controlTimerExcepcion);
              clearInterval(this.bitacoraService.control);
            } catch (error) {}
            // loading.dismiss();
            console.log(
              'Antes de: this.app.getRootNavs()[0].setRoot(this.loginPage);'
            );
            // this.app.getRootNavs()[0].setRoot(this.loginPage);
            delete this.bitacoraService.BitacoraData;
            this.bitacoraService.sincronizarInformacion().then(() => {
              console.log(
                'Despues de: -> delete this.bitacoraService.BitacoraData;'
              );
              this.loginService.setActivo(false);
              this.bitacoraService.strHoras = '00';
              this.bitacoraService.strMinutos = ':00';
              this.bitacoraService.strSegundos = ':00';
              this.bitacoraService.strHorasExcepcion = '00';
              this.bitacoraService.strSegundosExcepcion = ':00';
              this.bitacoraService.segundosConduccionHhmmss = '00:00:00';
              this.bitacoraService.segundosDescansoHhmmss = '00:00:00';
              this.bitacoraService.strHorasServicio = '00';
              this.bitacoraService.strMinutosServicio = ':00';
              this.bitacoraService.strSegundosServicio = ':00';
              this.bitacoraService.segundosConduccionStorage = 0;
              this.bitacoraService.segundosDescansoStorage = 0;
              this.bitacoraService.segundosConduccion = 0;
              this.bitacoraService.segundosDescanso = 0;
              this.bitacoraService.haveElements = false;
              // this.bitacoraService.stora
              this.bitacoraService.stExepcionTemporal = false;
              this.bitacoraService.ExcepcionTemporal = false;
              this.bitacoraService.stInProgress = false;
              this.unidadService.cargarFromStorage = true;
              console.log('Terminando CATCH Cerrar sesión............');
            });
            // delete this.bitacoraService.StatusServicio;
            // delete this.bitacoraService.objConfServicio;
          })
          .catch(() => {
            console.log('Cerrar sesión.... catch..........');
          });
      });
  }
  goBack() {
    // this.navCtrl.navigateBack('/route');
    this.navCtrl.navigateBack('/route');
  }

  // angular router replaceurl
}
