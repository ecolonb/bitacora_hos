// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class UnidadService {

//   constructor() { }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { UnidadRequestModel } from '../models/unidad-request.model';
import { UnidadModel } from '../models/unidad.model';
import { AppConfiguracionService } from './app-configuracion.service';
import { ConductorService } from './conductor.service';

/*
  Servicio que provee las unidades
*/
@Injectable({
  providedIn: 'root'
})
export class UnidadService {
  public arrObjUnidades: UnidadModel[] = [];
  public cargarFromStorage = true;
  // URL to request
  // public URL_: string = 'http://dev1.copiloto.com.mx/lab/rest/api/Unidad';
  private ComplementEndPoint = 'rest/api/Unidad';
  constructor(
    public http: HttpClient,
    private conductorProvider: ConductorService,
    private appConfiguracionProvider: AppConfiguracionService,
    private platform: Platform,
    private storage: Storage
  ) {}

  public getUnidadesPost() {
    const promiseLoginUserAndPaswword = new Promise((resolve, reject) => {
      const HEADERS = {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      };
      // Obj datos que recibe el ApiRestFul idConductor, token, idUsuarioParent
      const dataSendform = {
        IdConductor: this.conductorProvider.IdConductor(),
        Token: this.appConfiguracionProvider.getToken(),
        IdUsuarioParent: this.conductorProvider.IdUsuarioParent()
      };
      const UrlEndPointCompletly: string =
        this.appConfiguracionProvider.getServerEndPoint() +
        this.ComplementEndPoint;
      this.http
        .post(UrlEndPointCompletly, dataSendform, HEADERS)
        .toPromise()
        .then(RESULT_DATA => {
          // this.setUnidadesInStorage();
          resolve(RESULT_DATA);
        })
        .catch(error => {
          reject(error);
        });
    });
    return promiseLoginUserAndPaswword;
  }

  public mappingResult(ResultData: UnidadRequestModel) {
    this.arrObjUnidades = ResultData.unidades;
    this.setUnidadesInStorage().then(() => {});
  }

  // Guardar En storage ObjUnidades
  public setUnidadesInStorage() {
    const promiseGuardaUnidades = new Promise((resolve, reject) => {
      // Guardando en LocalStorage y actualizando el status de horas invertidas
      if (this.platform.is('cordova')) {
        // Dispositivo android or ios is running
        this.storage.set('ObjUnidades', JSON.stringify(this.arrObjUnidades));
        resolve(true);
      } else {
        // Desktop webBrowser
        if (this.arrObjUnidades) {
          localStorage.setItem(
            'ObjUnidades',
            JSON.stringify(this.arrObjUnidades)
          );
        } else {
          localStorage.removeItem('ObjUnidades');
        }
        resolve(true);
      }
    });
    return promiseGuardaUnidades;
  }

  // Leer del storage unidades guardadas
  public getUnidadesFromStorage() {
    const storageInfoPromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.storage.ready().then(() => {
          // Get items from Storage
          this.storage.get('ObjUnidades').then(ObjUnidades => {
            if (ObjUnidades) {
              this.arrObjUnidades = JSON.parse(ObjUnidades);
              resolve(true);
            } else {
              this.arrObjUnidades = [];
              resolve(true);
            }
          });
        });
      } else {
        this.arrObjUnidades = JSON.parse(localStorage.getItem('ObjUnidades'));
        resolve(true);
      }
    });
    return storageInfoPromise;
  }
}
