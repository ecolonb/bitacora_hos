import { BitacoraModel } from './../../models/bitacora.model';

import { ConfiguracionServicioPage } from '../configuracion-servicio/configuracion-servicio.page';
import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DetalleItemBitacoraPage } from '../detalle-item-bitacora/detalle-item-bitacora.page'
import { NavController, AlertController, Platform, ActionSheetController, LoadingController } from '@ionic/angular';

// Services
import { UtilidadesService } from '../../services/utilidades.service';
import { BitacoraService } from './../../services/bitacora.service';
import { SyncUpService } from './../../services/sync-up.service';
import { UnidadService } from './../../services/unidad.service';
import { ActividadProgressTitlePipe } from '../../pipes/actividad-progress-title.pipe'
import { HelpersService } from '../../services/helpers.service';

//Plugins - NAtive
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.page.html',
  styleUrls: ['./actividades.page.scss'],
})
export class ActividadesPage implements OnInit {

  public DetalleItemBitacoraPage: any = DetalleItemBitacoraPage;
  public configuracionServicioPage: any = ConfiguracionServicioPage;
  actividadProgressTitle: any = ActividadProgressTitlePipe;
  isLoading = true;
  // public boolSelectActividad: boolean = false;
  // public navParams: NavParams
  constructor(
    public navCtrl: NavController,
    private alertController: AlertController,
    private utilidadesProvider: UtilidadesService,
    public bitacoraProvider: BitacoraService,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private loadingController: LoadingController,
    private unidadProvider: UnidadService,
    private syncUpProvider: SyncUpService,
    public helpersService: HelpersService
  ) { }


  ngOnInit() {
    console.log('Actividades page Loaded -->>');
    try {
      if (
        this.bitacoraProvider.BitacoraData.length !== 0 &&
        this.bitacoraProvider.BitacoraData !== null
      ) {
        console.log('If -->>>>>>>>>', this.bitacoraProvider.BitacoraData);
        if (this.bitacoraProvider.BitacoraData[0]) {
          if (this.bitacoraProvider.BitacoraData.length > 0) {
            this.bitacoraProvider.haveElements = true;

            // Recorrer items para ver que actividad esta pendiente
            for (const itBitacoraReboot of this.bitacoraProvider.BitacoraData) {
              if (Boolean(itBitacoraReboot.Terminado) === false) {
                // Reiniciando actividad pendiente

                if (itBitacoraReboot.Actividad === 'C') {
                  this.bitacoraProvider.Conduciendo = true;
                  this.bitacoraProvider.dsDescanso = true;
                  this.bitacoraProvider.dsConduciendo = false;
                  this.bitacoraProvider.dsExcepcionTemporal = false;
                  this.bitacoraProvider.boolReinicio = true;
                  this.bitacoraProvider.fechaInicioActividad =
                    itBitacoraReboot.FechaHoraInicio;
                  this.inicio(itBitacoraReboot.Actividad);
                }
                if (itBitacoraReboot.Actividad === 'D') {
                  this.bitacoraProvider.Descanso = true;
                  this.bitacoraProvider.boolReinicio = true;
                  this.bitacoraProvider.dsExcepcionTemporal = false;
                  this.bitacoraProvider.fechaInicioActividad =
                    itBitacoraReboot.FechaHoraInicio;
                  this.inicio(itBitacoraReboot.Actividad);
                }
                if (itBitacoraReboot.Actividad === 'ET') {
                  // reiniciar timerexcepcion temporal
                  this.bitacoraProvider.ExcepcionTemporal = true;
                  this.bitacoraProvider.stExepcionTemporal = true;
                  this.bitacoraProvider.dsExcepcionTemporal = false;
                  this.bitacoraProvider.strFechaInicioExcepcion =
                    itBitacoraReboot.FechaHoraInicio;
                  this.bitacoraProvider.controlTimerExcepcion = setInterval(
                    () => {
                      this.bitacoraProvider.timerExcepcionTemporal();
                    },
                    1000
                  );
                }
              }
            }
          }
        }
      } else {
        console.log('Else --->>>> Bitacora')
      }
    } catch (error_) {
      console.log('Error -->>', error_);
    }

    // Sincronizando eventos pendientes -> aqui validar cuando ya se sincronizaron por Nuevo Evento
    // Eddpoint
    // const loading = this.loadingCtrl.create({
    //   content: 'Sincronizando información, por favor espere...'
    // });
    // loading.present();
    console.log('Antes de syncUpProvider');
    this.syncUpProvider
      .checkServiceToSend()
      .then(() => {
        this.syncUpProvider
          .checkActivitysToSend()
          .then((DataRequest) => {
            this.bitacoraProvider
              .changeGuardadoServer(DataRequest)
              .then(() => {
                this.bitacoraProvider
                  .guardarBitacoraInStorage()
                  .then(() => { })
                  .catch(() => { });
              })
              .catch(() => { });
            // loading.dismiss();
          })
          .catch(() => {
            // loading.dismiss();
          });
      })
      .catch((Err) => {
        // loading.dismiss();
      });
  }
  // Incia el proceso del cronometro setInterval a 1 segundo
  public async inicio(ActividadParam: string) {
    if (ActividadParam === 'C') {
      this.bitacoraProvider.actividadActual = 'C';
      this.bitacoraProvider.actividaActualTtl = 'C';
      this.bitacoraProvider.Conduciendo = true;
      this.bitacoraProvider.dsDescanso = true;
      if (!this.bitacoraProvider.boolReinicio) {
        this.bitacoraProvider.dsConduciendo = true;
      }
    }
    if (ActividadParam === 'D') {
      this.bitacoraProvider.actividadActual = 'D';
      this.bitacoraProvider.actividaActualTtl = 'D';
      this.bitacoraProvider.Descanso = true;
      this.bitacoraProvider.dsConduciendo = true;
      if (!this.bitacoraProvider.boolReinicio) {
        this.bitacoraProvider.dsDescanso = true;
      }
    }
    if (!this.bitacoraProvider.stInProgress) {
      this.bitacoraProvider.stInProgress = true;
      this.bitacoraProvider.strSegundos = ':00';
      this.bitacoraProvider.strMinutos = ':00';
      this.bitacoraProvider.strHoras = '00';
      let dtSart: Date;
      if (!this.bitacoraProvider.boolReinicio) {
        if (ActividadParam === 'C') {
          this.bitacoraProvider.dsConduciendo = false;
        }
        if (ActividadParam === 'D') {
          this.bitacoraProvider.dsDescanso = false;
        }
        if (ActividadParam === 'ET') {
          this.bitacoraProvider.dsExcepcionTemporal = false;
        }
        dtSart = new Date();
        this.bitacoraProvider.dtFechaInicio = this.utilidadesProvider.convertLocalDateToUTC(
          dtSart
        );

        this.bitacoraProvider.dtFechaFin = this.utilidadesProvider.convertLocalDateToUTC(
          new Date()
        );

        this.bitacoraProvider.dtCurrentDT = new Date();
        this.bitacoraProvider.fechaInicioActividad = this.utilidadesProvider.isoStringToSQLServerFormat(
          dtSart
            .toISOString()
            .toString()
            .toUpperCase()
        );
        // const loading = this.loadingCtrl.create({
        //   content:
        //     'Obteniendo posición y sincronizando información, por favor espere...'
        // });
        // loading.present();
        const loading = await this.loadingController.create({
          message: 'Obteniendo posición y sincronizando información, por favor espere...'
        });
        await loading.present();
        this.bitacoraProvider
          .newItemBitacora(dtSart)
          .then(() => {
            // Una vez Resuelta la promEsa de nuevoItemBitacora se guarda para sincronizar despues.
            loading.dismiss();
          })
          .catch(() => {
            loading.dismiss();
          });
      } else {
        // Si hay una actividad en curso aqui se reiniciar tomar la fecha de inicio de actividad pendiente que no sea ET

        this.bitacoraProvider.boolReinicio = false;

        dtSart = this.utilidadesProvider.convertSqlToDate(
          this.bitacoraProvider.BitacoraData[0].FechaHoraInicio
        );

        // this.dtFechaFin
        this.bitacoraProvider.dtFechaInicio = this.utilidadesProvider.convertSqlToDate(
          this.bitacoraProvider.BitacoraData[0].FechaHoraInicio
        );

        this.bitacoraProvider.dtFechaFin = this.utilidadesProvider.convertLocalDateToUTC(
          new Date()
        );

        this.bitacoraProvider.dtCurrentDT = new Date();
      }

      this.bitacoraProvider.control = setInterval(() => {
        this.bitacoraProvider.cronometro();
      }, 1000);
      // Guardar item bitacora
    } else {
      // al guardar habilitar o deshabilitar botones. Eddpoint
      // const loading = this.loadingCtrl.create({
      //   content:
      //     'Obteniendo posición y sincronizando información, por favor espere...'
      // });
      // loading.present();
      const loading = await this.loadingController.create({
        message: 'Obteniendo posición y sincronizando información, por favor espere...'
      });
      await loading.present();

      this.bitacoraProvider
        .guardar()
        .then((DataRequest) => {
          loading.dismiss();
        })
        .catch(() => {
          loading.dismiss();
        });
    }

    // this.changeTitlteLarge(this.actividaActualTtl);
  }

  public async confirmarAccionActividad(Actividadaram: string) {
    let titleAlert: string;
    let messageAlert: string;

    if (this.bitacoraProvider.stInProgress) {
      // Termina actividad
      if (this.bitacoraProvider.Conduciendo && Actividadaram === 'C') {
        titleAlert = 'Terminar conducción';
        messageAlert = '¿Realmente deseas terminar de conducir?';
      }
      if (this.bitacoraProvider.Descanso && Actividadaram === 'D') {
        titleAlert = 'Terminar descanso';
        messageAlert = '¿Realmente deseas terminar de descansar?';
      }
    } else {
      // Inicia actividad
      if (!this.bitacoraProvider.Conduciendo && Actividadaram === 'C') {
        titleAlert = '¿Iniciar conducción?';
        messageAlert = '¿Realmente deseas iniciar a conducir?';
      }
      if (!this.bitacoraProvider.Descanso && Actividadaram === 'D') {
        titleAlert = 'Iniciar descanso?';
        messageAlert = '¿Realmente deseas iniciar descanso?';
      }
    }

    // const confirm = this.alertCtrl.create({
    //   title: titleAlert,
    //   message: messageAlert,
    //   buttons: [
    //     {
    //       text: 'No',
    //       role: 'cancel',
    //       handler: () => { }
    //     },
    //     {
    //       text: 'SI',
    //       handler: () => {
    //         this.inicio(Actividadaram);
    //       }
    //     }
    //   ]
    // });
    // confirm.present();
    const alert = await this.alertController.create({
      header: titleAlert,
      message: messageAlert,
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel-->>>: blah');
          }
        }, {
          text: 'SI',
          handler: () => {
            console.log('Confirm Okay');
            this.inicio(Actividadaram);
          }
        }
      ]
    });

    await alert.present();
  }

  public confirmarTerminarServicio() { }
  public async confirmExcepcionTemporal() {
    let titleAlert: string;
    let messageAlert: string;

    if (this.bitacoraProvider.stExepcionTemporal) {
      titleAlert = 'Terminar excepción temporal';
      messageAlert = '¿Realmente deseas terminar la Excepción temporal?';
    } else {
      // Inicia actividad
      titleAlert = 'Iniciar excepción temporal';
      messageAlert = '¿Realmente deseas iniciar la Excepción temporal?';
    }

    const alert = await this.alertController.create({
      header: titleAlert,
      message: messageAlert,
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel-->>>: blah');
          }
        }, {
          text: 'SI',
          handler: () => {
            console.log('Confirm Okay');
            this.controlaExcepcion();
          }
        }
      ]
    });

    await alert.present();
    // const confirm = this.alertCtrl.create({
    //   title: titleAlert,
    //   message: messageAlert,
    //   buttons: [
    //     {
    //       text: 'No',
    //       role: 'cancel',
    //       handler: () => {}
    //     },
    //     {
    //       text: 'Si',
    //       handler: () => {
    //         this.controlaExcepcion();
    //       }
    //     }
    //   ]
    // });
    // confirm.present();
  }
  // Funcion detiene el vento debe guardarse en localStorage
  public eliminarExcepcion() { }
  public editar() { }
  public async eliminar() {

    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Deseas eliminar este registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel-->>>: blah');
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            console.log('Confirm Okay');
            // this.controlaExcepcion();
            clearInterval(this.bitacoraProvider.control);

            this.bitacoraProvider.stInProgress = false;
            (document.getElementById(
              'inicio'
            ) as HTMLInputElement).disabled = false;
            (document.getElementById(
              'eliminar'
            ) as HTMLInputElement).disabled = true;
            (document.getElementById(
              'guardar'
            ) as HTMLInputElement).disabled = true;
            this.bitacoraProvider.strSegundos = ':00';
            this.bitacoraProvider.strMinutos = ':00';
            this.bitacoraProvider.strHoras = '00';
            try {
              this.bitacoraProvider.BitacoraData.splice(0, 1);
              // Al eliminar un elemento se actualiza el LocalStorage
              this.bitacoraProvider.guardarBitacoraInStorage();
              if (this.bitacoraProvider.BitacoraData !== []) {
                if (this.bitacoraProvider.BitacoraData.length >= 1) {
                  this.bitacoraProvider.haveElements = true;
                } else {
                  this.bitacoraProvider.haveElements = false;
                }
              }
            } catch (error) { }
          }
        }
      ]
    });

    // await alert.present();

    // // Alert desea eliminar
    // const alert = this.alertCtrl.create({
    //   title: 'Confirmar',
    //   message: '¿Deseas eliminar este registro?',
    //   buttons: [
    //     {
    //       text: 'Cancelar',
    //       role: 'cancelar',
    //       handler: () => {}
    //     },
    //     {
    //       text: 'Eliminar',
    //       handler: () => {
    //         clearInterval(this.bitacoraProvider.control);

    //         this.bitacoraProvider.stInProgress = false;
    //         (document.getElementById(
    //           'inicio'
    //         ) as HTMLInputElement).disabled = false;
    //         (document.getElementById(
    //           'eliminar'
    //         ) as HTMLInputElement).disabled = true;
    //         (document.getElementById(
    //           'guardar'
    //         ) as HTMLInputElement).disabled = true;
    //         this.bitacoraProvider.strSegundos = ':00';
    //         this.bitacoraProvider.strMinutos = ':00';
    //         this.bitacoraProvider.strHoras = '00';
    //         try {
    //           this.bitacoraProvider.BitacoraData.splice(0, 1);
    //           // Al eliminar un elemento se actualiza el LocalStorage
    //           this.bitacoraProvider.guardarBitacoraInStorage();
    //           if (this.bitacoraProvider.BitacoraData !== []) {
    //             if (this.bitacoraProvider.BitacoraData.length >= 1) {
    //               this.bitacoraProvider.haveElements = true;
    //             } else {
    //               this.bitacoraProvider.haveElements = false;
    //             }
    //           }
    //         } catch (error) {}
    //       }
    //     }
    //   ]
    // });
    // alert.present();
  }

  public testDatetTiime(Title: string, Date1: any, Date2: any) {
    const date1Test: any = new Date(Date1);
    const date2Test: Date = new Date(Date2);
    let dateDiff = Math.abs(date1Test.valueOf() - date2Test.valueOf());

    dateDiff /= 1000;
    const horas: any = Math.floor(dateDiff / 3600);
    const minutos: any = Math.floor((dateDiff - horas * 3600) / 60);
    const segundos: any = Math.round(dateDiff - horas * 3600 - minutos * 60);
    console.log(
      Title +
      ' TIEMPO transcurridos: [ ' +
      horas +
      ':' +
      minutos +
      ':' +
      segundos +
      ' ]'
    );
  }

  // change title card activity
  public changeTitlte(Actividad: string) {
    if (this.bitacoraProvider.BitacoraData.length >= 1) {
      this.bitacoraProvider.BitacoraData[0].Actividad = Actividad;
      // Cuando se cambia de actividad tambien se actualiza LocalStorage
      this.bitacoraProvider.guardarBitacoraInStorage();
    }
  }
  public changeTitlteLarge(Actividad: string) {
    if (Actividad === 'S') {
      this.bitacoraProvider.actividaActualTtl = 'Servicio';
    } else if (Actividad === 'C') {
      this.bitacoraProvider.actividaActualTtl = 'Conduciendo';
    } else if (Actividad === 'D') {
      this.bitacoraProvider.actividaActualTtl = 'Descanso';
    } else if (Actividad === 'FS') {
      this.bitacoraProvider.actividaActualTtl = 'Fuera de servicio';
    } else if (Actividad === 'ET') {
      this.bitacoraProvider.actividaActualTtl = 'Excepción temporal';
    } else {
      this.bitacoraProvider.actividaActualTtl = '--';
    }
  }
  public goToDetallesItem(itemBitacora: BitacoraModel) {
    console.log('Haciendo push para ver detalles-->>');
    // this.navCtrl.push(DetalleItemBitacoraPage, { itemBitacora });
  }

  public async terminarServicio() {
    const alert = await this.alertController.create({
      header: 'Terminar servicio',
      message: '¿Realmente deseas terminar el servicio?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel-->>>: blah');
          }
        }, {
          text: 'SI',
          handler: async () => {
            console.log('Confirm Okay');
            // const loading = this.loadingCtrl.create({
            //   content: 'Sincronizando información, por favor espere...'
            // });
            // loading.present();

            const loading = await this.loadingController.create({
              message: 'Sincronizando información, por favor espere...'
            });
            await loading.present();

            this.bitacoraProvider
              .terminarServicio()
              .then(() => {
                // redirect configuracion nuevo servicio
                loading.dismiss();
                try {
                  clearInterval(this.bitacoraProvider.ctrlTimerServicio);
                  clearInterval(this.bitacoraProvider.controlTimerExcepcion);
                  clearInterval(this.bitacoraProvider.control);
                } catch (error) { }
                this.bitacoraProvider.strHoras = '00';
                this.bitacoraProvider.strMinutos = ':00';
                this.bitacoraProvider.strSegundos = ':00';
                this.bitacoraProvider.strHorasExcepcion = '00';
                this.bitacoraProvider.strSegundosExcepcion = ':00';
                this.bitacoraProvider.segundosConduccionHhmmss = '00:00:00';
                this.bitacoraProvider.segundosDescansoHhmmss = '00:00:00';
                this.bitacoraProvider.strHorasServicio = '00';
                this.bitacoraProvider.strMinutosServicio = ':00';
                this.bitacoraProvider.strSegundosServicio = ':00';
                this.bitacoraProvider.segundosConduccionStorage = 0;
                this.bitacoraProvider.segundosDescansoStorage = 0;
                this.bitacoraProvider.segundosConduccion = 0;
                this.bitacoraProvider.segundosDescanso = 0;
                this.bitacoraProvider.haveElements = false;
                // this.bitacoraProvider.stora
                // this.app
                //   .getRootNavs()[0]
                //   .setRoot(this.configuracionServicioPage);
                delete this.bitacoraProvider.BitacoraData;
                delete this.bitacoraProvider.StatusServicio;
                delete this.bitacoraProvider.objConfServicio;
                this.bitacoraProvider.stExepcionTemporal = false;
                this.bitacoraProvider.ExcepcionTemporal = false;
                this.bitacoraProvider.stInProgress = false;
                this.unidadProvider.cargarFromStorage = true;

                console.log('Redirect config service');
              })
              .catch(() => {
                loading.dismiss();
                try {
                  clearInterval(this.bitacoraProvider.ctrlTimerServicio);
                  clearInterval(this.bitacoraProvider.controlTimerExcepcion);
                  clearInterval(this.bitacoraProvider.control);
                } catch (error) { }
                this.bitacoraProvider.strHoras = '00';
                this.bitacoraProvider.strMinutos = ':00';
                this.bitacoraProvider.strSegundos = ':00';
                this.bitacoraProvider.strHorasExcepcion = '00';
                this.bitacoraProvider.strSegundosExcepcion = ':00';
                this.bitacoraProvider.segundosConduccionHhmmss = '00:00:00';
                this.bitacoraProvider.segundosDescansoHhmmss = '00:00:00';
                this.bitacoraProvider.strHorasServicio = '00';
                this.bitacoraProvider.strMinutosServicio = ':00';
                this.bitacoraProvider.strSegundosServicio = ':00';
                this.bitacoraProvider.segundosConduccionStorage = 0;
                this.bitacoraProvider.segundosDescansoStorage = 0;
                this.bitacoraProvider.segundosConduccion = 0;
                this.bitacoraProvider.segundosDescanso = 0;
                this.bitacoraProvider.haveElements = false;
                // this.bitacoraProvider.stora
                // this.app
                //   .getRootNavs()[0]
                //   .setRoot(this.configuracionServicioPage);
                delete this.bitacoraProvider.BitacoraData;
                delete this.bitacoraProvider.StatusServicio;
                delete this.bitacoraProvider.objConfServicio;
                this.bitacoraProvider.sincronizarInformacion();
                this.bitacoraProvider.stExepcionTemporal = false;
                this.bitacoraProvider.ExcepcionTemporal = false;
                this.bitacoraProvider.stInProgress = false;
                this.unidadProvider.cargarFromStorage = true;
                console.log('Redirect config service.....');
              });
          }
        }
      ]
    });

    await alert.present();


    // const confirm = this.alertCtrl.create({
    //   title: 'Terminar servicio',
    //   message: '¿Realmente deseas terminar el servicio?',
    //   buttons: [
    //     {
    //       text: 'No',
    //       role: 'cancel'
    //     },
    //     {
    //       text: 'Si',
    //       handler: () => {

    //       }
    //     }
    //   ]
    // });
    // confirm.present();
  }
  public async controlaExcepcion() {
    const loading = await this.loadingController.create({
      message: 'Obteniendo posición y sincronizando información, por favor espere...'
    });
    await loading.present();

    // public newItemBitacora(dtSart: Date, actividadParam?: string) {
    // const loading = this.loadingCtrl.create({
    //   content:
    //     'Obteniendo posición y sincronizando información, por favor espere...'
    // });
    // loading.present();
    this.bitacoraProvider
      .iniciarExcepcionTemporal(new Date())
      .then(() => {
        loading.dismiss();
      })
      .catch(() => {
        loading.dismiss();
      });
  }
  public terminarExcepcion() { }

}
