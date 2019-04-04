import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NavController,
  AlertController,
  LoadingController,
  ModalController,
  Platform
} from '@ionic/angular';
import { LoginService } from '../../services/login.service';
import { BitacoraService } from '../../services/bitacora.service';
import { ConductorService } from '../../services/conductor.service';
import { AppConfiguracionService } from 'src/app/services/app-configuracion.service';
import { UnidadService } from '../../services/unidad.service';
import { SyncUpService } from '../../services/sync-up.service';
import { ConfiguracionPage } from '../configuracion/configuracion.page';
import { ConfiguracionServicioPage } from '../configuracion-servicio/configuracion-servicio.page';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Device } from '@ionic-native/device/ngx';
import { LocalTimeActivitysService } from '../../services/local-time-activitys.service';
import { NgForm } from '@angular/forms';

// UniqueDeviceID
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public loading: any = undefined;
  public configuracionPage: any = ConfiguracionPage;
  public myModal = undefined;
  public usuario = '';
  public contrasenia = '';
  public strLoginOkProvider = 'false';
  public configuracionServicioPage: any = ConfiguracionServicioPage;
  // public menuPage: any = MenuPage;
  // public uidDevice: string;
  // public platformDevice: string;
  // public versionPlatformDevice: string;
  // public modelDevice: string;
  public ObjLoginDevice: any;
  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    private loadingController: LoadingController,
    public LoginProvider: LoginService,
    private modalController: ModalController,
    private bitacoraProvider: BitacoraService,
    private conductorProvider: ConductorService,
    private appConfiguracionProvider: AppConfiguracionService,
    private unidadProvider: UnidadService,
    private syncUpProvider: SyncUpService,
    private device: Device,
    private platform: Platform,
    private uniqueDeviceID: UniqueDeviceID,
    private localTimeActivitysProvider: LocalTimeActivitysService
  ) {
    this.strLoginOkProvider = 'false';
    this.LoginProvider.setActivo(false)
      .then(() => {})
      .catch(() => {});
    if (this.platform.is('cordova')) {
      this.uniqueDeviceID
        .get()
        .then((uuid: any) => {
          this.ObjLoginDevice = {
            uid: String(uuid),
            platform: String(this.device.platform),
            model: String(this.device.model),
            versionPlatform: String(this.device.version),
            user: '',
            password: ''
          };
          // console.log('this.ObjDevice: ' + JSON.stringify(this.ObjLoginDevice));
          // this.uidDevice = String(uuid);
          // this.platformDevice = String(this.device.platform);
          // this.modelDevice = String(this.device.model);
          // this.versionPlatformDevice = String(this.device.version);
        })
        .catch((error: any) => {
          console.log('Catch Error--->>>>: ', error);
        });
    } else {
      this.ObjLoginDevice = {
        uid: '-',
        platform: 'desktop',
        model: '-',
        versionPlatform: '-',
        user: '',
        password: ''
      };
    }
  }

  ngOnInit() {
    // Verifica si hay sevicios y actividades pnedientes

    this.syncUpProvider
      .checkServiceToSend()
      .then(() => {
        this.syncUpProvider
          .checkActivitysToSend()
          .then(() => {})
          .catch(() => {});
      })
      .catch(() => {});
  }
  ionViewWillEnter() {
    console.log('Will enter: ');
  }

  public ingresar() {
    // Validar que el la propiedad privada Logged=True; si no mostrar login
    if (this.LoginProvider.getActivo() === true) {
      // ****** Validar si esta en Servicio y en alguna actividad
      this.loading.dismiss();
      // Si no esta configurado el servicio solicitar configuracion:
      try {
        // if (
        //   this.bitacoraProvider.StatusServicio !== null &&
        //   this.bitacoraProvider.StatusServicio !== undefined
        // ) {
        //   if (this.bitacoraProvider.StatusServicio.Terminado === false) {
        //     this.bitacoraProvider.resetServicicio();
        //     this.navCtrl.setRoot(this.menuPage);
        //     // this.rootPage = this.configuracionServicioPage;
        //   } else {
        //     // Aqui cargarLasUnidadesDelaCuenta
        //     this.unidadProvider.cargarFromStorage = false;
        //     this.navCtrl.setRoot(this.configuracionServicioPage);
        //   }
        // } else {
        //   // Aqui cargarLasUnidadesDelaCuenta
        //   this.unidadProvider.cargarFromStorage = false;
        //   this.navCtrl.setRoot(this.configuracionServicioPage);
        // }
        this.localTimeActivitysProvider
          .getDataFromServer(false)
          .then(ResposeData => {
            console.log('ResposeData localTimeActivitysProvider---->>>>:', ResposeData);
          })
          .catch(ErrorRequest => {
            console.log('ResposeData: localTimeActivitysProvider ---->>>', ErrorRequest);
          });
        this.unidadProvider.cargarFromStorage = false;
        console.log('Aqui redireccionar: configurar servicio');
        // this.navCtrl.setRoot(this.configuracionServicioPage);
      } catch (error) {}
    }
  }
  // public continuar(formData: any) {
  //   this.usuario = formData.usuario.value;
  //   this.contrasenia = formData.contrasenia.value;
  //   let ObjMEnsaje: any;
  //   this.loading = this.loadingCtrl.create({
  //     content: 'Iniciando la aplicación. Favor de esperar...'
  //   });
  //   if (this.usuario === '' || this.contrasenia === '') {
  //     const alert = this.alertCtrl.create({
  //       title: 'Error',
  //       subTitle: '¡Favor de ingresar Usuario y Contraseña!',
  //       buttons: [
  //         {
  //           text: 'Ok',
  //           role: 'ok',
  //           handler: () => {
  //             this.LoginProvider.setActivo(false);
  //           }
  //         }
  //       ]
  //     });
  //     alert.present();
  //     return false;
  //   } else {
  //     this.loading.present();
  //   }

  //   this.LoginProvider.validarSesion(this.usuario, this.contrasenia).subscribe(
  //     (DATARCV) => {
  //       if (DATARCV) {
  //         ObjMEnsaje = DATARCV;
  //         if (ObjMEnsaje._error === false) {
  //           this.LoginProvider.guardarServicio(DATARCV);
  //           this.LoginProvider.setActivo(true);
  //           // Promise cargar y guardar solo el Login Cuando se cargue la bitacora manejar variable boolean para mantener el estado actual de la bitacora (loaded/unload) y luego ingresar -------------------------------------->>>>>>>>>>>>
  //           this.bitacoraProvider
  //             .getBitacoraFromStorage()
  //             .then((ResultBitacoraStorage) => {
  //               // this.bitacoraProvider.getHHmmss();
  //               this.ingresar();
  //             });
  //         } else {
  //           this.loading.dismiss();
  //           const alert = this.alertCtrl.create({
  //             title: 'Error',
  //             subTitle: ObjMEnsaje.mensaje,
  //             buttons: [
  //               {
  //                 text: 'Ok',
  //                 role: 'ok',
  //                 handler: () => {
  //                   this.LoginProvider.setActivo(false);
  //                 }
  //               }
  //             ]
  //           });
  //           alert.present();
  //         }
  //       } else {
  //         this.LoginProvider.setActivo(false);
  //       }
  //     },
  //     (error) => {
  //       this.loading.dismiss();
  //       const alert = this.alertCtrl.create({
  //         title: 'Error',
  //         subTitle: error.message,
  //         buttons: [
  //           {
  //             text: 'Ok',
  //             role: 'ok',
  //             handler: () => {
  //               // this.LoginProvider.setActivo(false);
  //               // Borrar las dos lineas de abajo
  //               this.LoginProvider.setActivo(true);
  //               this.ingresar();
  //               // // Promise cargar bitacora y luego ingresar -------------------------------------->>>>>>>>>>>>
  //               // this.bitacoraProvider
  //               //   .getBitacoraFromStorage()
  //               //   .then((ResultBitacoraStorage) => {
  //               //     // this.bitacoraProvider.getHHmmss();
  //               //     console.log('ResultBitacoraStorage', ResultBitacoraStorage);
  //               //     this.ingresar();
  //               //   });
  //             }
  //           }
  //         ]
  //       });
  //       alert.present();
  //     }
  //   );
  //   return false;
  // }
  public async loginUserAndPassword(formData: any) {
    // this.LoginProvider.setAuthenticate(true);
    console.log(
      '---------------------->>>>>>>LoginUserAndPassword=>>>>>=>>>=>',
      formData
    );

    this.usuario = formData.form.controls.usuario.value;
    this.usuario = this.usuario.trim();
    this.contrasenia = formData.form.controls.contrasenia.value;

    this.loading = await this.loadingController.create({
      message: 'Iniciando sesión. Por favor espere...'
    });
    if (this.usuario === '' || this.contrasenia === '') {
      const alert = await this.alertController.create({
        header: 'Error!',
        message: '¡Favor de ingresar Usuario y Contraseña!',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              console.log('Confirm Okay');
              this.LoginProvider.setActivo(false);
              // this.LoginProvider.setAuthenticate(false)
            }
          }
        ]
      });

      await alert.present();
      return false;
    } else {
      await this.loading.present();
    }
    this.ObjLoginDevice.user = this.usuario.trim().toLocaleLowerCase();
    this.ObjLoginDevice.password = btoa(this.contrasenia.trim());
    this.LoginProvider.loginUserAndPaswword(this.ObjLoginDevice)
      .then(async RESULT_PROVIDER => {
        // Aqui se procesa la información que se recibe desde el Servidor
        if (RESULT_PROVIDER.errorRequest === true) {
          this.loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Error en login',
            message: RESULT_PROVIDER.mensaje,
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  console.log('Confirm Okay');
                  this.LoginProvider.setActivo(false);
                }
              }
            ]
          });

          await alert.present();
        } else if (RESULT_PROVIDER.errorRequest === false) {
          // Guardar datos del conductor en provider y el token, Ingresa hasta guardar Token-> evitar error en petición unidades
          this.conductorProvider.setDataconductor(RESULT_PROVIDER.conductor);
          this.appConfiguracionProvider
            .setToken(RESULT_PROVIDER.token)
            .then(() => {
              this.LoginProvider.setActivo(true)
                .then(() => {
                  this.ingresar();
                })
                .catch(() => {
                  this.ingresar();
                }); // Guardar token LOGIN_PROVIDER
            });
        }
      })
      .catch(async ERROR => {
        if (ERROR.ok === false) {
          this.loading.dismiss();
          // const alert = this.alertCtrl.create({
          //   title: 'Error de comunicación',
          //   subTitle:
          //     'Fue imposible conectarse al servidor, favor de revisar tu conexión a internet.',
          //   buttons: [
          //     {
          //       text: 'Ok',
          //       role: 'ok',
          //       handler: () => {
          //         this.LoginProvider.setActivo(false);
          //       }
          //     }
          //   ]
          // });
          // alert.present();
          const alert = await this.alertController.create({
            header: 'Error de comunicación',
            message:
              'Fue imposible conectarse al servidor, favor de revisar tu conexión a internet.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  console.log('Confirm Okay');
                  this.LoginProvider.setActivo(false);
                }
              }
            ]
          });

          await alert.present();
        }
      });
  }
  public ngAfterViewInit() {
    // this.slides.lockSwipes(true);
    // this.slides.freeMode = false;
    // this.slides.paginationType = 'progress';
  }
  public async openConfigModal() {
    // this.myModal.present();

    this.myModal = await this.modalController.create({
      component: this.configuracionPage,
      componentProps: { value: 123 }
    });
    return await this.myModal.present();
  }

  public dismissModal() {
    // this.myModal.dismiss();
  }
  async presentAlertPrompt() {
    const textEx = 'http://was.asasa.ssasa.';
    const alert = await this.alertController.create({
      header: 'Configuración',
      inputs: [
        {
          name: 'url_endPoint',
          type: 'text',
          placeholder: 'Url servicios web',
          value: textEx
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Guardar',
          handler: data => {
            console.log('Confirm Ok', data);
          }
        }
      ]
    });

    await alert.present();
  }

  public onKeyUp(evt: any, frmLogin: NgForm) {
    if (evt.keyCode === 13) {
      frmLogin.ngSubmit.emit();
    }
  }
}
