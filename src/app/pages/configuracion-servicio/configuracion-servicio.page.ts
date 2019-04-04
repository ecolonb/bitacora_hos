import { Component, OnInit, ViewChild } from '@angular/core';
import { UnidadRequestModel } from 'src/app/models/unidad-request.model';
import { UnidadModel } from 'src/app/models/unidad.model';
import {
  NavController,
  AlertController,
  LoadingController
} from '@ionic/angular';
import { ViewController } from '@ionic/core';
import { BitacoraService } from '../../services/bitacora.service';
import { LoginService } from '../../services/login.service';
import { ConductorService } from '../../services/conductor.service';
import { UnidadService } from '../../services/unidad.service';
import { UtilidadesService } from '../../services/utilidades.service';
import { SyncUpService } from '../../services/sync-up.service';
import { AppConfiguracionService } from '../../services/app-configuracion.service';
import { ServicioModel } from 'src/app/models/servicio.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion-servicio',
  templateUrl: './configuracion-servicio.page.html',
  styleUrls: ['./configuracion-servicio.page.scss']
})
export class ConfiguracionServicioPage implements OnInit {
  // constructor() { }
  slideOpts = {
    effect: 'flip'
  };
  // ngOnInit() {
  // }
  @ViewChild('configServiceSlider') slides;
  // public slides: Slides;
  public tipoDeServicio: string = 'default';
  public modalidadDeServicio: string = 'default';
  public NombreConductor: string = 'Copiloto';
  public origenServicio: string;
  public destinoServicio: string;
  public descripcionRutaASeguir: string;
  public nombreUnidad: string = '';
  public confirmacionConfSer: boolean = false;
  public objUnidadSeleccionada: UnidadModel;

  public searchQuery: string = '';
  public items: string[];
  public objUnidades: UnidadModel[];
  public itemsS2: any;
  public searchTerm: string = '';
  public itemsSr: any;

  public tipoServicioDescLong: string = '';
  public modalidadServicioDescLong: string = '';

  // ******** variables Globales *********
  // private menuPage: any = MenuPage;
  // private loginPage: any = LoginPage;

  constructor(
    public navCtrl: NavController,
    // public navParams: NavParams,
    // private alertCtrl: AlertController,
    // private bitacoraProvider: BitacoraService,
    // private viewController: ViewController,
    private loginProvider: LoginService,
    public conductorProvider: ConductorService,
    private unidadProvider: UnidadService,
    private utilidadesProvider: UtilidadesService,
    private syncUpProvider: SyncUpService,
    private appConfiguracionProvider: AppConfiguracionService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {
    /**
     */
    // Aqui realizar peticiones para ontener la lista de unidades
    // if (this.unidadProvider.cargarFromStorage) {
    //   this.unidadProvider.getUnidadesFromStorage().then(() => {});
    // } else {
    //   this.unidadProvider.getUnidadesPost();
    // }
    console.log(
      'On configuracion service........----------------------------->'
    );
  }
  public setFilteredItems() {
    if (this.searchTerm !== '') {
      this.itemsSr = this.filterItems(this.searchTerm);
    } else {
      delete this.itemsSr;
    }
  }
  ngOnInit() {
    this.slides.lockSwipes(true);
    this.slides.freeMode = false;
    this.slides.paginationType = 'progress';
  }
  // }
  // public ionViewCanEnter() {
  //   if (this.loginProvider.getActivo() === false) {
  //     delete this.unidadProvider.arrObjUnidades;
  //     this.unidadProvider
  //       .setUnidadesInStorage()
  //       .then(() => {})
  //       .catch(() => {});
  //     this.app.getRootNavs()[0].setRoot(this.loginPage);
  //     return;
  //   }
  // }
  public ionViewDidEnter() {
    // let loading = this.loadingCtrl.create({
    //   content: 'Cargando lista de unidades, por favor espere...'
    // });
    // loading.present();
    console.log(
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxIn ionViewDidload----------------------------------------------====>>>>'
    );
    if (this.unidadProvider.cargarFromStorage) {
      this.unidadProvider
        .getUnidadesFromStorage()
        .then(() => {
          // Una vez que se cargan las unidades del Storage verficar si existe el objUnidades si no realizar peticion pos
          if (
            this.unidadProvider.arrObjUnidades !== [] &&
            this.unidadProvider.arrObjUnidades !== null &&
            this.unidadProvider.arrObjUnidades !== undefined &&
            this.unidadProvider.arrObjUnidades.length > 0
          ) {
            // loading.dismiss();
            // loading = this.loadingCtrl.create({
            //   content: 'Sincronizando información, por favor espere...'
            // });
            // loading.present();
            this.syncUpProvider
              .checkServiceToSend()
              .then(() => {
                this.syncUpProvider
                  .checkActivitysToSend()
                  .then(() => {
                    // loading.dismiss();
                  })
                  .catch(() => {
                    // loading.dismiss();
                  });
              })
              .catch(() => {
                // loading.dismiss();
              });
          } else {
            this.unidadProvider
              .getUnidadesPost()
              .then((RESULT_DATA: UnidadRequestModel) => {
                this.unidadProvider.mappingResult(RESULT_DATA);
                // loading.dismiss();
                // loading = this.loadingCtrl.create({
                //   content:
                //     'Sincronizando información del localStorage, por favor espere...'
                // });
                // loading.present();
                this.syncUpProvider
                  .checkServiceToSend()
                  .then(() => {
                    this.syncUpProvider
                      .checkActivitysToSend()
                      .then(() => {
                        // loading.dismiss();
                      })
                      .catch(() => {
                        // loading.dismiss();
                      });
                  })
                  .catch(() => {
                    // loading.dismiss();
                  });
              })
              .catch(() => {
                // error get unidades....
                // loading.dismiss();
                // loading = this.loadingCtrl.create({
                //   content:
                //     'Sincronizando información del localStorage, por favor espere...'
                // });
                // loading.present();
                this.syncUpProvider
                  .checkServiceToSend()
                  .then(() => {
                    this.syncUpProvider
                      .checkActivitysToSend()
                      .then(() => {
                        // loading.dismiss();
                      })
                      .catch(() => {
                        // loading.dismiss();
                      });
                  })
                  .catch(() => {
                    // loading.dismiss();
                  });
              });
          }
        })
        .catch(error => {
          //  loading.dismiss();
        });
    } else {
      this.unidadProvider
        .getUnidadesPost()
        .then((RESULT_DATA: UnidadRequestModel) => {
          this.unidadProvider.mappingResult(RESULT_DATA);
          // loading.dismiss();
          // loading = this.loadingCtrl.create({
          //   content:
          //     'Sincronizando información del localStorage, por favor espere...'
          // });
          // loading.present();
          this.syncUpProvider
            .checkServiceToSend()
            .then(() => {
              this.syncUpProvider
                .checkActivitysToSend()
                .then(() => {
                  // loading.dismiss();
                })
                .catch(() => {
                  // loading.dismiss();
                });
            })
            .catch(() => {
              // loading.dismiss();
            });
        });
    }
  }
  public async nextSlideConfirmacion() {
    let error: boolean = false;
    // Despues de entrar en esta funcion debe guardar los datos que se capturan
    let liErrores: string = '';

    if (
      this.objUnidadSeleccionada == null ||
      this.objUnidadSeleccionada === undefined
    ) {
      error = true;
      liErrores += '<li style="float:left;">Debes elegir una unidad</li>';
    }
    if (this.tipoDeServicio === 'default') {
      error = true;
      liErrores +=
        '<li style="float:left;">Debes elegir un tipo de servicio</li>';
    }
    if (error) {
      // En caso de error en los datos capturados se dispara la alerta
      // const alert = this.alertCtrl.create({
      //   title: 'Error',
      //   subTitle: '<ul>' + liErrores + '</ul>',
      //   buttons: [
      //     {
      //       text: 'Ok',
      //       role: 'ok'
      //     }
      //   ]
      // });
      // alert.present();alertController

      const alert = await this.alertController.create({
        header: 'Error!',
        message: '<ul>' + liErrores + '</ul>',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              console.log('Confirm ERRORS Okay');
            }
          }
        ]
      });

      await alert.present();
    } else {
      // Esto se ejecuta si no hay errores al validar
      this.confirmacionConfSer = true;

      if (this.tipoDeServicio === '1368') {
        this.tipoServicioDescLong = 'De carga';
      } else if (this.tipoDeServicio === '1369') {
        this.tipoServicioDescLong = 'Turismo';
      } else if (this.tipoDeServicio === '1370') {
        this.tipoServicioDescLong = 'Pasajeros';
      } else if (this.tipoDeServicio === '1371') {
        this.tipoServicioDescLong = 'Privado';
      }
      // <!-- De carga general	2786
      // De carga especializada	2787
      // De lujo	2788
      // Ejecutivo	2789
      // Primera	2790
      // Económico	2791
      // Mixto	2792
      // Turístico	2793
      // Turístico de lujo	2794
      // Excursión	2795
      // Chofer – guía	2796 -->
      if (this.modalidadDeServicio === 'default') {
        this.modalidadServicioDescLong = 'Sin modalidad';
      } else if (this.modalidadDeServicio === '2788') {
        this.modalidadServicioDescLong = 'De lujo';
      } else if (this.modalidadDeServicio === '2789') {
        this.modalidadServicioDescLong = 'Ejecutivo';
      } else if (this.modalidadDeServicio === '2790') {
        this.modalidadServicioDescLong = 'Primera';
      } else if (this.modalidadDeServicio === '2791') {
        this.modalidadServicioDescLong = 'Económico';
      } else if (this.modalidadDeServicio === '2792') {
        this.modalidadServicioDescLong = 'Mixto';
      } else if (this.modalidadDeServicio === '2793') {
        this.modalidadServicioDescLong = 'Turístico';
      } else if (this.modalidadDeServicio === '2794') {
        this.modalidadServicioDescLong = 'Turístico de lujo';
      } else if (this.modalidadDeServicio === '2786') {
        this.modalidadServicioDescLong = 'De carga general';
      } else if (this.modalidadDeServicio === '2787') {
        this.modalidadServicioDescLong = 'De carga especializada';
      } else if (this.modalidadDeServicio === '2795') {
        this.modalidadServicioDescLong = 'Excursión';
      } else if (this.modalidadDeServicio === '2796') {
        this.modalidadServicioDescLong = 'Chofer - Guía';
      }

      this.slides.lockSwipes(false);
      this.slides.slideNext();
      this.slides.lockSwipes(true);
    }
  }

  public showOptionsToLogInApp() {
    // const alertOpion = this.alertCtrl.create({
    //   title: 'Elige una opción',
    //   inputs: [
    //     {
    //       type: 'radio',
    //       label: 'Iniciar servicio',
    //       value: 'IniciarServicio',
    //       checked: true
    //     },
    //     { type: 'radio', label: 'Ver bitácora', value: 'VerBitacora' },
    //     { type: 'radio', label: 'Salir', value: 'Salir' }
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancelar'
    //     },
    //     {
    //       text: 'Ok',
    //       handler: (DataOk: string) => {
    //         if (DataOk === 'VerBitacora') {
    //           // Cambiar variable Status appConfiguracion verbitacora
    //           this.app.getRootNavs()[0].setRoot(this.menuPage);
    //         }
    //         if (DataOk === 'IniciarServicio') {
    //           // Cambiar variable Status appConfiguracion IniciarServicio
    //           this.app.getRootNavs()[0].setRoot(this.menuPage);
    //         }
    //         if (DataOk === 'Salir') {
    //           // Cambiar variable Status appConfiguracion verbitacora
    //           // Cerrar Sesion

    //           this.loginProvider.cerrarSesion().then(() => {
    //             // this.navCtrl.setRoot(LoginPage);
    //             // use that this.App.getRootNavs()[0].setRoot(LoginPage); for this.App.getRootNav().setRoot(LoginPage)
    //             this.app.getRootNavs()[0].setRoot(this.loginPage);
    //           });
    //         }
    //       }
    //     }
    //   ]
    // });
    // alertOpion.present();
    console.log('showOptionsToLogInApp():_ ');
  }
  public async cerrarSesion() {
    // const alert = this.alertCtrl.create({
    //   title: 'Cerrar sesión',
    //   message: '¿Estas seguro que quieres cerrar sesión?',
    //   buttons: [
    //     {
    //       text: 'Cancelar',
    //       role: 'cancel',
    //       handler: () => {}
    //     },
    //     {
    //       text: 'Si',
    //       handler: () => {
    //         this.loginProvider
    //           .cerrarSesion()
    //           .then(() => {
    //             // this.navCtrl.setRoot(LoginPage);
    //             // use that this.App.getRootNavs()[0].setRoot(LoginPage); for this.App.getRootNav().setRoot(LoginPage)
    //             this.app.getRootNavs()[0].setRoot(this.loginPage);
    //           })
    //           .catch(() => {
    //             // Error Here
    //           });
    //       }
    //     }
    //   ]
    // });
    // alert.present();
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estas seguro que quieres cerrar sesión?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel-->>>: blah');
          }
        },
        {
          text: 'SI',
          handler: () => {
            console.log('Confirm Okay');
            this.loginProvider.cerrarSesion().then(() => {
              console.log('Cerrando sesion ok');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // Se inicia el servicio : se guarda información en localStorage
  public async iniciarServicio() {
    // Cuando se inicia el servicio se arma el objeto configuración servicio en ese mismo objeto se establece la unidad seleccionada.
    // Falta obtener los datos del Permisionario Nombre/Razon social y Dirección
    // Generar HashId y setearIdConductor
    const hashIdServicio: number = this.utilidadesProvider.hashCode(
      new Date().toISOString().toString() +
        this.appConfiguracionProvider.getToken()
    );
    console.log('hashIdServicio:', hashIdServicio);
    const objConfServicio: ServicioModel = {
      IdServicio: 0,
      HashIdServicio: hashIdServicio,
      IdConductor: this.conductorProvider.IdConductor(),
      Unidad: this.objUnidadSeleccionada,
      DireccionOrigen:
        this.origenServicio === undefined || this.origenServicio === null
          ? '-'
          : this.origenServicio,
      DireccionDestino:
        this.destinoServicio === undefined || this.origenServicio === null
          ? '-'
          : this.destinoServicio,
      Ruta:
        this.descripcionRutaASeguir === undefined
          ? '-'
          : this.descripcionRutaASeguir,
      TipoServicio: Number(this.tipoDeServicio),
      ModalidadServicio: Number(this.modalidadDeServicio),
      Permisionario: 'Test - Copiloto Satelital',
      PermisionarioDomicilio: 'El Yaqui, 05320 Cuajimalpa de Morelos, CDMX',
      FechaHoraInicio: this.utilidadesProvider.isoStringToSQLServerFormat(
        new Date()
          .toISOString()
          .toString()
          .toUpperCase()
      ),
      FechaHoraFin: '-'
    };
    // const loading = this.loadingCtrl.create({
    //   content:
    //     'Sincronizando información del localStorage al server, por favor espere...'
    // });
    // loading.present();
    const loading = await this.loadingController.create({
      message:
        'Sincronizando información del localStorage al server, por favor espere...INICIAR SERVICIO'
    });
    await loading.present();
    // this.bitacoraProvider
    //   .iniciarServicio(objConfServicio)
    //   .then(() => {
    //     loading.dismiss();
    //     // this.app.getRootNavs()[0].setRoot(this.menuPage);
    //     this.router.navigate(['/tabs'], {
    //       replaceUrl: true
    //     });
    //   })
    //   .catch(Err => {
    //     loading.dismiss();
    //     // this.app.getRootNavs()[0].setRoot(this.menuPage);
    //   });
  }

  public filterItems(searchTerm) {
    if (
      this.unidadProvider.arrObjUnidades &&
      this.unidadProvider.arrObjUnidades !== undefined &&
      this.unidadProvider.arrObjUnidades !== null &&
      this.unidadProvider.arrObjUnidades.length > 0
    ) {
      return this.unidadProvider.arrObjUnidades.filter((item: UnidadModel) => {
        return (
          item.noEconomico
            .toString()
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase()) > -1
        );
      });
    }
  }
  public setUnidad(ObjSearch: UnidadModel) {
    this.objUnidadSeleccionada = ObjSearch;
    this.searchTerm =
      this.objUnidadSeleccionada.nuid.toString() +
      ' - ' +
      this.objUnidadSeleccionada.placas +
      ' - ' +
      this.objUnidadSeleccionada.modelo;
    this.nombreUnidad = this.searchTerm;
    delete this.itemsSr;
  }
  public goBackConfiguration() {
    this.confirmacionConfSer = false;
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }
  public slectTipoServicio(ionElement: any) {
    // Asignando valor seleccionado
    this.tipoDeServicio = String(ionElement);
    // Cerrando vista actual selectTipoDeServicio
    this.closeCurrentView();
  }

  public slectModalidadServicio(ionElement: any) {
    // Asignando valor seleccionado
    this.modalidadDeServicio = String(ionElement);
    // Cerrando vista actual selectTipoDeServicio
    this.closeCurrentView();
  }
  // Cerrar vista actual
  public closeCurrentView() {
    // const root = this.viewController.instance.navCtrl._app._appRoot;
    // const view = root._overlayPortal._views[0];
    // view.dismiss();
    console.log('Close currentView');
  }
  public onCancel(event) {
    try {
      delete this.objUnidadSeleccionada;
    } catch (error) {}
  }
}
