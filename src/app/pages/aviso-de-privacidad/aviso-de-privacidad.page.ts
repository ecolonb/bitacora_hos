import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";


@Component({
  selector: "app-aviso-de-privacidad",
  templateUrl: "./aviso-de-privacidad.page.html",
  styleUrls: ["./aviso-de-privacidad.page.scss"]
})
export class AvisoDePrivacidadPage implements OnInit {
  constructor(public navCtrl: NavController) {}

  ngOnInit() {}
  _goBack() {
    // this.navCtrl.navigateBack('/route');
    this.navCtrl.back();
    //this.navCtrl.pop();
  }
}
