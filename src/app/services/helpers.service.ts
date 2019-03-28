import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }
  //bitacoraProvider.stInProgress ? bitacoraProvider.actividadActual : 'S'

  actividadProgressTitle(Actividad: String) {
    let strTitle: string;

    if (Actividad === 'S') {
      strTitle = 'En servicio';
    } else if (Actividad === 'C') {
      strTitle = 'En conducción';
    } else if (Actividad === 'D') {
      strTitle = 'En descanso';
    } else if (Actividad === 'ET') {
      strTitle = 'Excepción temporal';
    } else if (Actividad === 'FS') {
      strTitle = 'Fuera de servicio';
    } else if (Actividad === '-') {
      strTitle = 'Sin actividad';
    }

    return strTitle;
  }
  actividadTitle(Actividad: String) {
    let strTitle: string;

    if (Actividad === 'S') {
      strTitle = 'Servicio';
    } else if (Actividad === 'C') {
      strTitle = 'Conducción';
    } else if (Actividad === 'D') {
      strTitle = 'Descanso';
    } else if (Actividad === 'ET') {
      strTitle = 'Excepción temporal';
    } else if (Actividad === 'FS') {
      strTitle = 'Fuera de servicio';
    } else if (Actividad === '-') {
      strTitle = 'Sin actividad';
    }

    return strTitle;
  }
}
