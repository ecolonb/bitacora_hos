// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class LoginService {

//   constructor() { }
// }
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
// import { Observable } from 'rxjs/Observable';
// import { map } from 'rxjs/operators';
import { UsuarioModel } from '../models/usuario.model';
import { AppConfiguracionService } from './app-configuracion.service';
import { UsuarioService } from './usuario.service';
import { BehaviorSubject } from 'rxjs';
// import { filter, map, switchMap } from 'rxjs/operators';
import { UiService } from './ui.service';

@Injectable()
export class LoginService {
  // Declaracion de variables globales
  // Variable to use on GUARDS
  public authState = new BehaviorSubject(false);
  public objPermisos: any;

  public serverEndPoint = 's5';

  // Pagina para redireccionar:
  public pageRedirect = 'actividades';

  // Variables de usuarioLogin
  public objSesionRespuesta: UsuarioModel;

  // Propiedades privadas
  // http://dev1.copiloto.com.mx
  private sesionOk = false;

  // private URL_: string = 'http://dev1.copiloto.com.mx/lab';
  private ComplementEndPoint = 'rest/api/Login';

  // Constructor de clase
  constructor(
    private httpClient: HttpClient,
    private storage: Storage,
    private platform: Platform,
    private appConfiguracionProvider: AppConfiguracionService,
    private usuarioProvider: UsuarioService,
    private ui: UiService
  ) {}

  // Funcion para validar sesion retorna un Obervable  -> cambiar metodo Implementar una promesa
  // public validarSesion(
  //   userToSend: string,
  //   passToSend: string
  // ): Observable<any> {
  //   userToSend = userToSend.toLowerCase();
  //   const HEADERS = {
  //     headers: { 'Content-Type': 'application/json; charset=utf-8' }
  //   };
  //   // Obj datos que recibe el ApiRestFul LoginIbutton
  //   const dataSendform = {
  //     id_ibutton: '9721371',
  //     server_endpoint: 's2'
  //   };
  //   return this.httpClient.post<Observable<any>>(
  //     this.URL_,
  //     dataSendform,
  //     HEADERS
  //   );
  // }

  // LOG IN USER_PASSWORD method POST -> Api RESTFul
  public loginUserAndPaswword(ObjLoginDevice: any): Promise<any> {
    console.log('/ObjLoginDevice: ', ObjLoginDevice);
    let urlEndPointComplety = '';
    const promiseLoginUserAndPaswword = new Promise((resolve, reject) => {
      const HEADERS = {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      };
      const dataSendform = ObjLoginDevice;
      const serverEndPointConfig = 'http://dev1.copiloto.com.mx/lab/';
      // this.appConfiguracionProvider
      //   .getServerEndPoint()
      //   .toLowerCase();
      // validate ServerEndPoint
      if (
        serverEndPointConfig.substring(
          serverEndPointConfig.length - 1,
          serverEndPointConfig.length
        ) === '/'
      ) {
        urlEndPointComplety = serverEndPointConfig + this.ComplementEndPoint;
      } else {
        urlEndPointComplety =
          serverEndPointConfig + '/' + this.ComplementEndPoint;
      }
      this.httpClient
        .post(urlEndPointComplety, dataSendform, HEADERS)
        .toPromise()
        .then((RESULT_DATA: any) => {
          console.log('RESULT_DATA: ', RESULT_DATA);
          if (
            RESULT_DATA.errorRequest == false &&
            RESULT_DATA.mensaje == 'login_ok'
          ) {
            this.ui.activeSideMenu();
            this.pageRedirect = 'ServiceConfig';
            this.authState.next(true);
          }
          resolve(RESULT_DATA);
        })
        .catch(error => {
          console.log('Error: ', error);
          this.pageRedirect = 'login';
          this.authState.next(false);
          reject(error);
        });
    });
    return promiseLoginUserAndPaswword;
  }

  // Obtiene si está activa la sesion
  public getActivo(): Boolean {
    // const promiseGetActivo = new Promise((resolve, reject) => {
    if (
      this.sesionOk &&
      this.sesionOk !== undefined &&
      this.sesionOk !== null
    ) {
      return this.sesionOk;
    } else {
      return false;
    }
    // });
    // return promiseGetActivo;
  }

  // Cambia el estado de la sesion
  public setActivo(valor: boolean): Promise<any> {
    this.sesionOk = valor;
    const promiseSetActivo = new Promise((resolve, reject) => {
      this.guardarStorage()
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
    return promiseSetActivo;
  }

  // Guarda los datos de la sesion si el Login es correcto
  public guardarServicio(ObjSesion: any) {
    this.objSesionRespuesta = ObjSesion;
    if (this.objSesionRespuesta._error === false) {
      this.sesionOk = true;
      this.usuarioProvider
        .guardarUsuarioInfo(this.objSesionRespuesta)
        .then(() => {
          // Guardando variable de SesionActivo <-> LoginActivo
          this.guardarStorage();
        });
    }
  }

  // Carga datos de la sesion desde el LocalStorage
  public cargarStorage() {
    console.log('Cargando storage.....');
    this.sesionOk = false;
    const storagePromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.storage.ready().then(() => {
          // Get items from Storage
          this.storage
            .get('sesionOk')
            .then(sesionOkStorage => {
              console.log('sesionOkStorage: -------->>>>', sesionOkStorage);
              this.sesionOk = Boolean(sesionOkStorage);
              if (this.sesionOk) {
                console.log(
                  'OKOKOKOKOKOKOKOKO=>>>>>>>>>> validar si esta en SERVICIO o NO'
                );
                this.ui.activeSideMenu();
                this.pageRedirect = 'ServiceConfig';
                this.authState.next(true);
              } else {
                this.ui.desactiveSideMenu();
                this.pageRedirect = 'login';
                this.authState.next(false);
              }
              return resolve();
            })
            .catch(() => {
              this.ui.desactiveSideMenu();
              this.pageRedirect = 'login';
              this.authState.next(false);
              this.sesionOk = false;
              return reject();
            });
        });
      } else {
        this.sesionOk = Boolean(localStorage.getItem('sesionOk'));
        console.log('sesionOk: ', this.sesionOk);
        if (this.sesionOk) {
          console.log(
            'OKOKOKOKOKOKOKOKO=>>>>>>>>>> validar si esta en SERVICIO o NO'
          );
          this.ui.activeSideMenu();
          this.pageRedirect = 'ServiceConfig';
          this.authState.next(true);
        } else {
          this.authState.next(false);
        }
        return resolve();
      }
    });
    return storagePromise;
  }

  // Cerrar sesion y guardar estado actual en LocalStorage
  public cerrarSesion(): Promise<any> {
    const cerrarSesionPromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        // Dispositivo
        try {
          this.setActivo(false)
            .then(() => {})
            .catch(() => {});
          this.storage.remove('sesionOk');
          this.storage.remove('ObjUnidades');
          this.storage.remove('ObjConductor');
        } catch (error) {}
        resolve();
      } else {
        // Desktop webBrowser
        try {
          this.setActivo(false)
            .then(() => {})
            .catch(() => {});
          localStorage.removeItem('sesionOk');
          localStorage.removeItem('ObjUnidades');
          localStorage.removeItem('ObjConductor');
        } catch (error) {}
        resolve();
      }
    });
    return cerrarSesionPromise;
  }

  isAuthenticated() {
    return this.authState.value;
  }
  setAuthenticate(newAuthState: boolean) {
    this.authState.next(newAuthState);
  }
  // ************* METODOS PRIVADOS *****************  //

  // Guarda datos de la sesion en LocalStorage
  private guardarStorage() {
    const savePromise = new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        // Dispositivo
        if (this.sesionOk === true) {
          this.storage.set('sesionOk', String(this.sesionOk));
        } else {
          this.storage.remove('sesionOk');
        }
        return resolve(true);
      } else {
        // Desktop webBrowser
        if (this.sesionOk === true) {
          localStorage.setItem('sesionOk', String(this.sesionOk));
        } else {
          // localStorage.removeItem('sesionOk');
          localStorage.removeItem('sesionOk');
        }
        return resolve(true);
      }
    });
    return savePromise;
  }
}
