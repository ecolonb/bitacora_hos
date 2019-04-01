import { Injectable } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(public sideMenu: MenuController) {
    this.desactiveSideMenu();
  }
  desactiveSideMenu() {
    this.sideMenu.enable(false);
  }
  activeSideMenu() {
    this.sideMenu.enable(true);
  }

}
