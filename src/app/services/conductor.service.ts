// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ConductorService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { ConductorModel } from '../models/conductor.model';

// ******** PLUGINS *******
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

/*
  Servicio que guarda la informacion del conductor
*/

@Injectable()
export class ConductorService {
  public nombreConductor = '';
  public apellidosConductor = '';
  public numeroLicencia = '';
  public tipoLicencia = '';
  public vigenciaLicencia: Date;
  public objConductor: ConductorModel;

  constructor(private platform: Platform, private storage: Storage) {}

  public setDataconductor(objParam: ConductorModel) {
    this.objConductor = objParam;
    this.setConductorDataStorage().then(() => {});
    this.setNombreConductor();
    // guardar datos del conductor en localStorage
  }
  public setNombreConductor() {
    if (this.objConductor !== null && this.objConductor) {
      this.nombreConductor = this.objConductor.nombre;
      this.apellidosConductor = this.objConductor.apellidos;
      this.numeroLicencia = this.objConductor.numeroLicencia;
      this.tipoLicencia = this.objConductor.tipoLicencia;
      this.vigenciaLicencia = this.objConductor.vigenciaLicencia;
    }
  }
  public IdUsuarioParent(): number {
    return this.objConductor.idUsuarioParent;
  }
  public IdConductor(): number {
    return this.objConductor.idConductor;
  }
  // Guarda los datos del conductor en el LocalStorage
  public setConductorDataStorage(): Promise<any> {
    const promiseGuardaConductorData = new Promise((resolve, reject) => {
      // Guardando en LocalStorage y actualizando el status de horas invertidas
      if (this.platform.is('cordova')) {
        // Dispositivo android or ios is running
        if (
          this.objConductor &&
          this.objConductor !== null &&
          this.objConductor !== undefined
        ) {
          this.storage.set('ObjConductor', JSON.stringify(this.objConductor));
        } else {
          this.storage.remove('ObjConductor');
        }

        resolve(true);
      } else {
        // Desktop webBrowser
        if (
          this.objConductor &&
          this.objConductor !== null &&
          this.objConductor !== undefined
        ) {
          localStorage.setItem(
            'ObjConductor',
            JSON.stringify(this.objConductor)
          );
        } else {
          localStorage.removeItem('ObjConductor');
        }
        resolve(true);
      }
    });
    return promiseGuardaConductorData;
  }

  // Cargar los datos del storage
  public getConductorDataStorage() {
    const storageInfoPromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.storage.ready().then(() => {
          // Get items from Storage
          this.storage.get('ObjConductor').then(ObjConductor => {
            if (ObjConductor) {
              this.objConductor = JSON.parse(ObjConductor);
            } else {
              delete this.objConductor;
            }
            this.setNombreConductor();
            resolve(true);
          });
        });
      } else {
        this.objConductor = JSON.parse(localStorage.getItem('ObjConductor'));
        this.setNombreConductor();
        resolve(true);
      }
    });
    return storageInfoPromise;
  }
}
