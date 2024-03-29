import { Component, OnInit } from '@angular/core';

// import { App, NavController } from 'ionic-angular';
import { NavController } from '@ionic/angular';
import { BitacoraService } from '../../services/bitacora.service';
import { LoginService } from '../../services/login.service';
import { UtilidadesService} from '../../services/utilidades.service';
import { LoginPage } from '../login/login.page';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  public LoginPage: any = LoginPage;
  public strPosition: string = '';
  public LoginOkProvider: boolean = false;
  public strLoginOkProvider: string = 'false';
  public strTiempoManejo: string;
  public strTiempoServicio: string;
  public TimeZone: string;
  public minutosTimeOfSet: number;
  // Constructor
  constructor(
    public navCtrl: NavController,
    public bitacoraProvider: BitacoraService,
    private loginProvider: LoginService,
    public utilidadesProvider: UtilidadesService
  ) {
    this.LoginOkProvider = Boolean(this.loginProvider.getActivo());
    this.strLoginOkProvider = String(this.LoginOkProvider);
    // try {
    //   const now: Date = new Date();
    //   const strTime: string = now.toTimeString();
    //   this.TimeZone = strTime.substring(8, strTime.length);
    //   console.log('Zona horaria: ', this.TimeZone);
    //   this.minutosTimeOfSet = now.getTimezoneOffset();
    //   console.log('timeOfSet: ', this.minutosTimeOfSet);
    //   console.log('timeOfSet Horas: ', this.minutosTimeOfSet / 60);
    // } catch (error) {}
  }

  ngOnInit() {
    console.log('Page loeaded: ')
  }
  // public goToPage(PageParam: any) {
  //   this.navCtrl.push(PageParam);
  // }
  public ionViewDidLoad() {
    this.pintarGrafica();
    setInterval(() => {
      this.pintarGrafica();
    }, 60000);
  }
  public pintarGrafica() {
    // ********** SERVICIO **********
    // Obtener Hora inicio Servicio To Hora actual
    try {
      let dateSql: Date;
      dateSql = this.utilidadesProvider.convertSqlToDate(
        this.bitacoraProvider.StatusServicio.FechaHoraInicio
      );
      // Ajustando la hora a ZonaHorariaLocal
      dateSql.setMinutes(dateSql.getMinutes() - dateSql.getTimezoneOffset());
      const hrInicioServicio: number = Number(dateSql.getHours());
      const hrFinServicio: number = Number(new Date().getHours());
      for (let i = 0; i < 24; i++) {
        const element: any = document.getElementById(
          's' + i
        ) as HTMLInputElement;
        if (i >= hrInicioServicio) {
          if (i <= hrFinServicio) {
            element.style.backgroundColor = '#4CACDC';
            element.style.display = 'block';
            element.innerHTML = '&nbsp;';
          } else {
            element.innerHTML = '-';
            element.style.backgroundColor = '#FFFFFF';
            element.style.display = 'block';
          }
        } else {
          element.innerHTML = '-';
          element.style.backgroundColor = '#FFFFFF';
          element.style.display = 'block';
        }
      }

      // Limpiando actividades actividades
      for (let i = 0; i < 24; i++) {
        let element: any = document.getElementById('c' + i) as HTMLInputElement;
        element.innerHTML = '-';
        element.style.backgroundColor = '#FFFFFF';
        element.style.display = 'block';
        element = document.getElementById('d' + i) as HTMLInputElement;
        element.innerHTML = '-';
        element.style.backgroundColor = '#FFFFFF';
        element.style.display = 'block';
      }
      // Pintando actividades
      for (const itBitacora of this.bitacoraProvider.BitacoraData) {
        let dateStartActivity: Date;
        let dateEndActivity: Date;
        dateStartActivity = this.utilidadesProvider.convertSqlToDate(
          itBitacora.FechaHoraInicio
        );
        dateStartActivity.setMinutes(
          dateStartActivity.getMinutes() - dateStartActivity.getTimezoneOffset()
        );
        const hrStartActivity: number = Number(dateStartActivity.getHours());
        let hrEndActivity: number = -1;
        // Definiendo hora de fin
        if (itBitacora.FechaHoraFinal !== '-') {
          dateEndActivity = this.utilidadesProvider.convertSqlToDate(
            itBitacora.FechaHoraFinal
          );
          dateEndActivity.setMinutes(
            dateEndActivity.getMinutes() - dateEndActivity.getTimezoneOffset()
          );
        } else {
          dateEndActivity = new Date();
        }
        // Obteniendo la hora final de la actividad
        hrEndActivity = Number(dateEndActivity.getHours());
        if (itBitacora.Actividad !== 'ET') {
          let element: any;
          for (let i = hrStartActivity; i <= hrEndActivity; i++) {
            if (itBitacora.Actividad === 'C') {
              element = document.getElementById('c' + i) as HTMLInputElement;
            }
            if (itBitacora.Actividad === 'D') {
              element = document.getElementById('d' + i) as HTMLInputElement;
            }

            element.style.backgroundColor = '#4CACDC';
            element.style.display = 'block';
            element.innerHTML = '&nbsp;';
          }
        }
      }
    } catch (error) {}
  }

}
